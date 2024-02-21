<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/SOFTENG761/project-group-3">
    <img src="frontend/src/assets/WiE_Logo.svg" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">WiE Database</h3>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This project developed a full stack web application designed to create a database similar to LinkedIn where women engineers can sign up and teachers and students can view all of the engineers. The primary goal of the project is to
provide teachers and career advisors with a user-friendly platform where they can access the profiles and contact information of women engineers.

Features include searching, favouriting engineers, and contacting them.
There are also features specific for admins such as reviewing engineer profiles, analytics of the website and reviewing feedback.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- Firebase
- Express.js
- React.js
- Node.js
- Algolia
- Tailwind
- Jest
- Cypress
- Netlify
- Vite

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

WiE Database Frontend is deployed at this link - https://wiedatabase.netlify.app/

WiE Database Backend is deployed at this link - https://wie761database.netlify.app/.netlify/functions/api

More detailed information about deployment can be found [here](/wiki/02-onboarding/03-development-machine-setup.md)

### Prerequisites

To get a local copy up and running follow these simple steps:

Before following the installation instructions you must have npm or yarn installed on your device as well as Node.js.

### Installation

These instructions will follow npm but can easily be swapped out for yarn instructions.

1. Clone the repo
   ```sh
   git clone https://github.com//SOFTENG761/project-group-3.git
   ```
2. Enter frontend and backend folders

Access the frontend and backend folders respectively with these commands

```sh
cd frontend
```

```sh
cd backend
```

3. Accessing .env files

Both the frontend and backend folders require .env files to be in the top level of the respective folders.

These can be asked for by emailing this email account: wiedatabase761@gmail.com, alternatively 761 markers should have it in included in the zip file from submission.

#### The following instructions are for both frontend and backend folders.

4. Install NPM packages

```sh
npm install
```

5. Running the code

```sh
npm run dev
```

Frontend can be accessed at this link - http://localhost:5173/

Backend can be accessed at this link - http://localhost:5001

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

There are three main users of the application and all three of them have access to a range of features both similiar and disimilar.

1. Engineers

- Sign Up and Login
- Search
- View other Engineers Profiles
- Contact Engineers
- Leave Website Feedback
- View and Edit their own profile

2. Teachers/Students

- Sign Up and Login
- Search
- View Engineer Profiles
- Contact Engineers
- Leave Website Feedback
- Favourite Engineers
- View Favourites

3. Admins

- Login (only admins can add more admins)
- Search
- View Engineers Profiles
- View all accounts and manage them i.e delete accounts
- View Analytics - you must log into Firebase with the account that has access
- Review Engineer Accounts and approve them/give feedback to improve them
- View Website Feedback
- Add another admin

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

WiE Database Team - wiedatabase761@gmail.com

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Wiki

The wiki where more detailed technical information about WiE Database is located [here](./wiki)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
