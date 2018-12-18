# Register a food business collections service

## Setting up your development environment

To run this application, you must use the [register-a-food-business-environment](https://github.com/FoodStandardsAgency/register-a-food-business-environment) repository to set up your development environment.

It is recommended that you install the Prettier code-formatting extension for your IDE.

## Detailed guides

The following detailed guides are available:

- [Starting and testing the application](./docs/contribution-guidelines/starting-testing-the-app.md)
- [Adding a new data field](./docs/contribution-guidelines/adding-a-new-data-field.md)
- [The tech stack](./docs/contribution-guidelines/the-tech-stack.md)

## The `/api/registrations` route

The `/api/registrations` route is the endpoint for fetching and updating registrations.

### `GET /api/registrations/:lc`

A successful `GET` request to the `/:lc` route accepts the following inputs:

- `:lc` parameter, for example `cardiff`
- `fields` query param: an array of fields to return. Returns all fields if left empty.
- `new` query param: true or false. If true, only the 'new' records (marked as `collected: false`) are returned.
- No request headers are necessary, but `double-mode` is an optional header.

A successful `GET` request to the `/:lc` route performs the following actions:

1. Fetches every entry in the `Registrations` database table that has a matching local council name
2. Fetches the detailed information from other database tables for each of the records returned in step 1
3. Returns a combined set of data to the user

### `GET /api/registration/:lc/:fsa_rn`

A successful `GET` request to the `/:lc/:fsa_rn` route accepts the following inputs:

- `:lc` parameter, for example `cardiff`
- `:fsa_rn` parameter, for example `AA11AA-AA11AA-AA11AA`
- No request headers are necessary, but `double-mode` is an optional header.

A successful `GET` request to the `/:lc/:fsa_rn` route performs the following actions:

1. Fetches the entry in the `Registrations` database table that has a matching local council and FSA registration number
2. Fetches the detailed information from other database tables for the single record returned in step 1
3. Returns the combined data to the user

### `PUT /api/registration/:lc/:fsa_rn`

A successful `PUT` request to the `/:lc/:fsa_rn` route accepts the following inputs:

- `:lc` parameter, for example `cardiff`
- `:fsa_rn` parameter, for example `AA11AA-AA11AA-AA11AA`
- A JSON request body: an object that contains the column names to be updated, and the value they should be updated to. Currently, only the `collected` column can be updated. The most likely example of the JSON request body is `{"collected": true}`.
- No request headers are necessary, but `double-mode` is an optional header.

A successful `PUT` request to the `/:lc/:fsa_rn` route performs the following actions:

1. Updates a single record that matches the `lc` and `fsa_rn` parameters to have a `collected` column value as determined by the `POST` body. Also adds a value to the `collected_at` column, to be the current date and time.

## The `/` route

### `GET /`

This route returns the Swagger/OpenAPI specification in JSON format.

## The `/api-docs` route

### `GET /api-docs`

This route displays the Swagger UI, based on the Swagger/OpenAPI specification, to allow API users to explore and demo the service (although this functionality is effectively replaced by the Azure API Management service).
