import os
from django.utils import timezone
import logging

from langchain.chains.retrieval_qa.base import RetrievalQA
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import CharacterTextSplitter
from decouple import config
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.views import APIView

from egyptian_constitution_app.models import User
from egyptian_constitution_app.serializers import LoginSerializer, UserSerializer

logging.basicConfig(level=logging.INFO)

class Question(APIView):
    permission_classes = (IsAuthenticated,)
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.loader = PyPDFLoader("دستور-جمهورية-مصر-العربية- edited 2019.pdf")
        api_key = config("api_key")

        if api_key is None:
            raise ValueError("API key not set")

        self.embedding = OpenAIEmbeddings(model="text-embedding-3-small", api_key=api_key)
        self.vectordb = self.initialize_vector_store()

        self.qa_chain = RetrievalQA.from_chain_type(
            llm=ChatOpenAI(model="gpt-3.5-turbo", api_key=api_key),
            chain_type="stuff",
            retriever=self.vectordb.as_retriever(),
            return_source_documents=True
        )

    def initialize_vector_store(self):
        persist_dir = 'docs/chroma/'
        # Check if vector store already exists
        if os.path.exists(persist_dir):
            return Chroma(persist_directory=persist_dir, embedding_function=self.embedding)

        # Otherwise, create the embeddings and save them
        pages = self.loader.load()
        text_splitter = CharacterTextSplitter(
            separator="\n",
            chunk_size=1000,
            chunk_overlap=150,
            length_function=len
        )
        docs = text_splitter.split_documents(pages)

        vectordb = Chroma.from_documents(
            documents=docs,
            embedding=self.embedding,
            persist_directory=persist_dir
        )
        return vectordb

    def post(self, request):
        question = request.data.get('question', '')

        if not question:
            return Response({"error": "No question provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            answer = self.qa_chain.invoke({"query": question})
            sources = [
                {"page_content": doc.page_content, "source": doc.metadata.get("source")}
                for doc in answer["source_documents"]
            ]

            return Response({
                "answer": answer['result'],
                "source_documents": sources
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(f"Error processing question: {e}")
            return Response({
                "error": "Could you ask your question again, please?"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class Login(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            user = authenticate(username=username, password=password)
            if user is not None:
                token, created = Token.objects.get_or_create(user=user)
                User.objects.update(last_login=timezone.now())
                return Response({'message': 'Successfully logged in', 'token': token.key}, status=status.HTTP_200_OK)
            else:
                return Response({'errors': ['Invalid credentials']},
                                status=status.HTTP_401_UNAUTHORIZED)

        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class Logout(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            request.user.auth_token.delete()
            return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except (AttributeError, Token.DoesNotExist):
            return Response({'error': 'Invalid token or user not logged in.'}, status=status.HTTP_400_BAD_REQUEST)


class Register(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            return Response({
                'message': 'successfully registered',
                'user': serializer.data,
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)