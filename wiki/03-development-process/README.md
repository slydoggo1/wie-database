# WiE Database Development Process

The application is developed using modified Feature model. Developers cannot commit to **main** branch and all features are developed in feature branches. A feature can be merged into master using Pull/merge request.

All branches must be named using the following conventions :

- `feat/issue-description` : use for application new features
- `hotFix/issue-description` : use for fixing application bugs / issues
- `refact/issue-description` : use for refactor tickets

examples :

- feat/editing-BE
- hotFix/favourites-test-failing

Developers should follow the following steps :

- Updated the `main` branch
- Create new branch
- Develop the specified requirements
- Commit and Push the code
- Raise a Pull request when the code meets the **[PR Checklist](#pr-checklist)**
- Ask one of the dev team for the review
- Address the required review comments
- After the review squash-merge the PR and delete the branch

### PR Checklist

- Code done as per the requirements. It should meet the acceptance criteria.
- Unit tests done for all business components and passing when running `npm run test`
- `npm run prettier` command run for backend and frontend
- `npm run lint` command run for frontend

### Testing

Testing is an integral part of our software developement process, the team has been consistently adding new tests and refactoring existing ones whenever a feature undergoes modification or addition. Testing is a means for us to verify that our code remains functional following changes, eliminating the need for conducting end-to-end testing on every occasion.

The testing for this project is split into three sections:

**Backend testing**
[Jest](https://jestjs.io/docs/getting-started) was used as the testing framework for all backend features. We used it to test all the controller methods that we implemented. These tests can be found under the backend/src/controllers/\_tests\_ directory.

Since our server had many calls to firestore, we also decided to use an external library [firestore-jest-mock](https://www.npmjs.com/package/firestore-jest-mock), to help with the mocking of some of the firestore calls.

To run our backend tests, navigate to the backend directory and run `npm run test`

**Frontend testing**
We used Cypress for our frontend tests, this was because it was relatively easy to set up and because of the robust debugging features it comes along with. You can refer to its official documentation [here](https://docs.cypress.io/guides/overview/why-cypress)

To run our frontend tests, navigate to the frontend directory, run `npm run dev` to start our frontend and run `npm run cypress:open` and click on the E2E Testing option to start the tests.

**User testing**
All the engineers from the team will periodically test out both the test version of our application and the deployed version. We recognise that since we are the developers, the feedback we have might not reflect the true needs of the end users, and so we also had other people test out and use the site. This included having our product owner sending out our deployed site to engineers to sign up and use, as well as having our friends sign up and testing the user side of the application.
