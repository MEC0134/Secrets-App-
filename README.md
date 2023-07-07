# App README

This README provides an overview and details about the code in the `app.js` file. The code represents an application built using Node.js and Express. It includes features for user authentication and authorization, database connectivity using Mongoose, and integration with third-party authentication providers like Google and Facebook.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Configuration](#configuration)
- [Models](#models)


## Installation

To run this application locally, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Change to the app directory: `cd <repository-folder>/`
3. Install the dependencies: `npm install`
4. Set up the environment variables by creating a `.env` file and populating it with the required values (see [Configuration](#configuration) section for details).
5. Start the application: `node app.js/nodemon app.js`

## Usage

After successfully installing and running the application, you can access it by navigating to `http://localhost:3000` in your web browser. The application provides the following features:

- **Home**: Renders the home page of the application.
- **Google Authentication**: Allows users to authenticate using their Google account.
- **Facebook Authentication**: Allows users to authenticate using their Facebook account.
- **Registration**: Allows new users to register with a username, email, and password.
- **Login**: Allows registered users to log in using their credentials.
- **Secrets**: Displays secrets shared by users who have submitted them.
- **Submit**: Allows authenticated users to submit a secret.
- **Logout**: Logs out the current user and redirects to the home page.

## Dependencies

The application has the following dependencies:

- [express](https://www.npmjs.com/package/express): Fast, unopinionated, minimalist web framework for Node.js.
- [body-parser](https://www.npmjs.com/package/body-parser): Node.js body parsing middleware.
- [ejs](https://www.npmjs.com/package/ejs): Embedded JavaScript templates for Node.js.
- [mongoose](https://www.npmjs.com/package/mongoose): MongoDB object modeling tool.
- [express-session](https://www.npmjs.com/package/express-session): Simple session middleware for Express.
- [passport](https://www.npmjs.com/package/passport): Simple, unobtrusive authentication for Node.js.
- [passport-local-mongoose](https://www.npmjs.com/package/passport-local-mongoose): Passport plugin for Mongoose that simplifies building username and password login with Passport.
- [connect-flash](https://www.npmjs.com/package/connect-flash): Flash messages for Express.
- [passport-google-oauth20](https://www.npmjs.com/package/passport-google-oauth20): Passport strategy for authenticating with Google using the OAuth 2.0 API.
- [passport-facebook](https://www.npmjs.com/package/passport-facebook): Passport strategy for authenticating with Facebook using the OAuth 2.0 API.
- [mongoose-findorcreate](https://www.npmjs.com/package/mongoose-findorcreate): Mongoose plugin to simplify finding or creating documents.

You can install all the dependencies by running `npm install`.

## Configuration

To configure the application, you need to set up the following environment variables in a `.env` file:

- `SECRET`: Secret key used for session management.
- `db_uri`: URI for connecting to the MongoDB database.
- `client_id`: Google OAuth client ID.
- `client_secret`: Google OAuth client secret.
- `fb_appid`: Facebook OAuth app ID.
- `fb_secret`: Facebook OAuth app secret.

Make sure to replace `<value>` with the appropriate values for your setup.


## Models

The application uses a single Mongoose model called `User`. The model schema has the following fields:

- `googleId`: String, stores the Google ID of the user (if authenticated via Google).
- `facebookId`: String, stores the Facebook ID of the user (if authenticated via Facebook).
- `username`: String, stores the username of the user.
- `email`: String, stores the email address of the user.
- `password`: String, stores the password of the user.
- `secret`: Object, stores the secret title and secret body submitted by the user.

The `User` model also utilizes the following plugins:

- `passportLocalMongoose`: Adds username and password fields to the model and provides helper methods for authentication.
- `findOrCreate`: Adds a `findOrCreate` method to the model for easier database operations.

