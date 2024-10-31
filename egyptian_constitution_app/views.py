from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from langchain.document_loaders import PyPDFLoader
from langchain.vectorstores import Chroma
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter

class Question(APIView):

    def check_attribute_exists(self, attribute_name):
        """
        Checks if an attribute exists on a Django model instance and if it is not from the database.

        Args:
            self: The Django model instance.
            attribute_name: The name of the attribute to check.

        Returns:
            True if the attribute exists and is not from the database; False otherwise.
        """

        if hasattr(self, attribute_name):
            # # Check if the attribute is in the instance's fields
            # if attribute_name in self._meta.get_fields():
            #     return False  # It's a database field

            # Check if the attribute is in the instance's dictionary
            if attribute_name in self.__dict__:
                return True  # It's a dynamic attribute

        return False  # Attribute doesn't exist and (will initiallize the pypdf loader)

    def post(self, request):
        # Extract the question from the request data
        question = request.data.get('question', '')

        if not self.check_attribute_exists("loader"):
            loader = PyPDFLoader("دستور-جمهورية-مصر-العربية-2019.pdf")

        pages = loader.load()

        text_splitter = CharacterTextSplitter(
            separator="\n",
            chunk_size=1000,
            chunk_overlap=150,
            length_function=len
        )

        docs = text_splitter.split_documents(pages)

        if not self.check_attribute_exists("embedding"):
            embedding = OpenAIEmbeddings(model="text-embedding-3-small", api_key="APIKEY")

        # Create the vector store
        vectordb = Chroma.from_documents(
            documents=docs,
            embedding=embedding,
            persist_directory='docs/chroma/'
        )

        # Placeholder for the processing logic
        result = f"You asked: {question}"  # Replace this with your actual logic

        return Response({"result": result}, status=status.HTTP_200_OK)