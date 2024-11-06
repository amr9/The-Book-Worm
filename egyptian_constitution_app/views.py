import os
from langchain.chains.retrieval_qa.base import RetrievalQA
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import CharacterTextSplitter
from decouple import config
import logging
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma

# Configure logging
logging.basicConfig(level=logging.INFO)


class Question(APIView):
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
