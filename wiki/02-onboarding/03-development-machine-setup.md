# Development Environment

All developers should have [tools](./02-tools.md) mentioned here installed on their machine.

## Git command-line configuration

Make sure you have configured your user with Git. This information will be used by Git.

```
git config --global user.name "Your Fullname"
git config --global user.email "Your GitHub Email"
```

## Connecting to Github using SSH

Refer to this [link](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/connecting-to-github-with-ssh) to setup SSH for your Github account.

## Clone the application

Clone the application using the following command.

```sh
git clone https://github.com/SOFTENG761/project-group-3.git
```

## Building the application

To build the application please run the following commands.

```sh
cd frontend
```

```sh
cd backend
```

In both folders

```sh
npm install
```

```sh
npm run dev
```

Frontend located at http://localhost:5173/

Backend located at http://localhost:5001

## Deployment

### Frontend Deployment:

This repository is not linked and setup for continuous integration and deployment to netlify, so all deployments are manual.

For frontend deployment, make sure to set up the necessary production environment variables.

Before uploading, run the following command to build the frontend:

```sh
npm run build
```

To deploy the frontend, upload the contents of the dist directory.

You can also test the frontend deployment by using the following command:

```sh
ntl deploy
```

For more information on deploying a Vite website, refer to the official Vite documentation: Vite Static Deploy Guide

Frontend Deployment can be accessed at https://wiedatabase.netlify.app/

### Backend Deployment:

To deploy the backend, make sure you are signed into the Netlify team account associated with the project.

Add the unique site ID to your .netlify/state.json file.

First, build the backend functions folder with the index file by running:

```sh
npm run build
```

Then, deploy the backend using the following command:

```sh
npm run deploy
```

You can test the server deployment locally using:

```sh
netlify dev
```

Backend Deployment can be accessed at https://wie761database.netlify.app/.netlify/functions/api
