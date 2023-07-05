# Project Readme

This project is a simple web application built with Node.js and Express.js to demonstrate user authentication and authorization using passport.js and MongoDB.

## Prerequisites

- Node.js installed on your machine
- MongoDB installed and running locally

## Installation

1. Clone the repository or download the source code.
2. Open a terminal and navigate to the project directory.
3. Install the dependencies by running the following command:

   ```shell
   npm install
   ```

4. Create a `.env` file in the project root directory and add the following configurations:

   ```plaintext
   SECRET=your_secret_key
   DATABASE_URL=mongodb://localhost:27017/usersDB
   ```

   Replace `your_secret_key` with your preferred secret key for session encryption.

## Usage

1. Start the server by running the following command:

   ```shell
   node app.js
   ```

2. Open your web browser and navigate to `http://localhost:3000` to access the home page.

3. You can register a new user by clicking on the "Register" link and providing a username, email, and password.

4. After registering, you can log in using your credentials on the "Login" page.

5. Upon successful login, you will be redirected to the "Secrets" page, which can only be accessed by authenticated users.

6. You can log out by clicking on the "Logout" link.


## Acknowledgements

- This project was built using Node.js, Express.js, MongoDB, and Passport.js.
