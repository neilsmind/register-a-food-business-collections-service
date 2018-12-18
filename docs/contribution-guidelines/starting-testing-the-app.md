# Starting and testing the application

## Preparing the application for the first time

### Prerequisites

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org)

### Steps

1.  Follow the steps for 'Getting started' on the [`register-a-food-business-environment` repository](https://github.com/FoodStandardsAgency/register-a-food-business-environment).
2.  Change directory to this repository (`register-a-food-business-collections-service`)
3.  Run `npm install`

## Starting the application

- `npm start` starts the localhost server.

### Steps:

1.  Run `npm start`
2.  Send requests to `http://localhost:4001` from Postman to test the application

## Testing the application

The `/package.json` file contains a number of scripts that are used in the Azure devOps pipelines to test the code in this repository. These scripts can also be run locally to prevent unnecessary pipeline builds, using the following commands:

- `npm start:docker`

  Identical to `npm start` but checks the database connection to the Docker environment's Postgres container before starting.

- `npm test`

  Runs all of the unit tests and provides a coverage report.

- `npm run test:unit:ci`

  Identical to `npm test` but provides a name for the test report used in Azure.

- `npm run test:component`

  Runs the component tests (whole-application tests, could be viewed as E2E tests). Note: these tests require a baseline state of a database to pass. See the `wipe-and-seed-postgres` task in Jenkins.

- `npm run test:component:ci`

  Identical to `npm test:component` but provides a name for the test report used in Azure.

- `npm run test:integration`

  Runs all of the integration tests between the connectors and local doubles of external services. For more information about integration tests, see https://martinfowler.com/bliki/IntegrationTest.html.

- `npm run test:contract`

  Runs all of the contract tests between the external services and their local doubles. For more information about contract tests, see https://martinfowler.com/bliki/ContractTest.html.

- `npm run lint`

  Runs the ESLint tool against the repository. For more information about ESLint, see https://eslint.org/.

- `npm run format:verify`

  Runs the Prettier code-formatting tool against the repository. For more information about Prettier, see https://prettier.io/. Formatting issues can often be corrected by running `npm format`. It is recommended to install the [Prettier code-formatting extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) for your chosen IDE, and to enable automatic Prettier formatting on every 'save' if possible.
