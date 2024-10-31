from langchain.chains.retrieval_qa.base import RetrievalQA
from langchain.llms import OpenAI
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from langchain.document_loaders import PyPDFLoader
from langchain.vectorstores import Chroma
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
import os

class Question(APIView):

    def post(self, request):
        # Extract the question from the request data
        question = request.data.get('question', '')

        # Check if the loader exists, otherwise create it
        if not self.check_attribute_exists("loader"):
            loader = PyPDFLoader("دستور-جمهورية-مصر-العربية-2019.pdf")

        # Load pages from the PDF
        pages = loader.load()

        # Split the documents into chunks
        text_splitter = CharacterTextSplitter(
            separator="\n",
            chunk_size=1000,
            chunk_overlap=150,
            length_function=len
        )
        docs = text_splitter.split_documents(pages)

        # Check if the embedding exists, otherwise create it
        if not self.check_attribute_exists("embedding"):
            # Load your API key
            API_KEY = os.environ.get('API_KEY')

            if API_KEY is None:
                raise ValueError("API_KEY not set")
            embedding = OpenAIEmbeddings(model="text-embedding-3-small", api_key=API_KEY)

        # Create the vector store
        vectordb = Chroma.from_documents(
            documents=docs,
            embedding=embedding,
            persist_directory='docs/chroma/'
        )

        # Create the retrieval QA chain
        qa_chain = RetrievalQA.from_chain_type(
            llm=OpenAI(model="gpt-3.5-turbo", api_key=API_KEY),
            chain_type="stuff",
            retriever=vectordb.as_retriever(),
            return_source_documents=True
        )

        # Get the answer from the QA chain
        answer = qa_chain.run(question)

        return Response({
            "question": question,
            "answer": answer['result'],  # If you want only the answer
        }, status=status.HTTP_200_OK)