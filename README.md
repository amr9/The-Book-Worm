# TheBookWorm

## Introduction

TheBookWorm is a project that utilizes the OpenAI API to provide users with quick and easy access to information from books. Through advanced AI algorithms, this tool delivers precise and relevant insights, allowing users to explore book content effortlessly and make informed choices without the hassle of extensive searching.
- **Author LinkedIn**: [Amr Emad](https://www.linkedin.com/in/amr-emad-973603224/)

## Installation

To get started with the TheBookWorm project, follow these steps:

1. **Clone the repository:**
    ```sh
    git clone https://github.com/amr9/TheBookWorm.git
    cd TheBookWorm
    ```

2. **Front-End Setup:**
    ```sh
    cd thebookworm-react-app
    npm install
    npm start
    ```

3. **Back-End Setup:**
    ```sh
    cd TheBookWorm
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    pip install -r requirements.txt
    python manage.py migrate
    python manage.py runserver
    ```

## Usage

To use TheBookWorm:
1. Just write the question for which you want the answer.

## Contributing

We welcome contributions from the community! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

## Licensing

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
