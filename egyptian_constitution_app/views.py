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

class Question(APIView):

    def check_attribute_exists(self, attribute_name):

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
        try:

            question = request.data.get('question', '')

            # Check if the loader exists, otherwise create it
            if not self.check_attribute_exists("loader"):
                loader = PyPDFLoader("دستور-جمهورية-مصر-العربية- edited 2019.pdf")

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
            print(self.check_attribute_exists("embedding"))
            if not self.check_attribute_exists("embedding"):
                # Load your API key
                api_key = config("api_key")

                if api_key is None:
                    raise ValueError("api_key not set")
                embedding = OpenAIEmbeddings(model="text-embedding-3-small", api_key=api_key)

            # Create the vector store
            vectordb = Chroma.from_documents(
                documents=docs,
                embedding=embedding,
                persist_directory='docs/chroma/'
            )

            # Create the retrieval QA chain
            qa_chain = RetrievalQA.from_chain_type(
                llm=OpenAI(model="gpt-3.5-turbo", api_key=api_key),
                chain_type="stuff",
                retriever=vectordb.as_retriever(),
                return_source_documents=True
            )

            # Get the answer from the QA chain
            answer = qa_chain({"query": question})

            return Response({"answer": answer['result'],"source_documents": answer["source_documents"]}, status=status.HTTP_200_OK)
        except Exception as e:

            print(e)
            return Response({"answer": "Could you ask me your question again? please.",}, status=status.HTTP_200_OK)