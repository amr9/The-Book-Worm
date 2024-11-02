from langchain.chains.retrieval_qa.base import RetrievalQA
from langchain_community.llms import OpenAI
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from decouple import config
import logging

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
        self.vectordb = Chroma(persist_directory='docs/chroma/')
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=OpenAI(model="gpt-3.5-turbo", api_key=api_key),
            chain_type="stuff",
            retriever=self.vectordb.as_retriever(),
            return_source_documents=True
        )
        self.initialize_vector_store()

    def initialize_vector_store(self):
        # Load pages from the PDF
        pages = self.loader.load()

        # Split the documents into chunks
        text_splitter = CharacterTextSplitter(
            separator="\n",
            chunk_size=1000,
            chunk_overlap=150,
            length_function=len
        )
        docs = text_splitter.split_documents(pages)

        # Create or update the vector store
        self.vectordb.add_documents(docs)

    def post(self, request):
        # Extract the question from the request data
        question = request.data.get('question', '')

        if not question:
            return Response({"error": "No question provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Get the answer from the QA chain
            answer = self.qa_chain({"query": question})

            return Response({
                "answer": answer['result'],
                "source_documents": answer["source_documents"]
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(f"Error processing question: {e}")
            return Response({
                "error": "Could you ask your question again, please?"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
