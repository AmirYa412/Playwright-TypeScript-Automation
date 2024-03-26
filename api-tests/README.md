# API Automation Tests Overview
This project contains API tests for an open-source “Pet Store” server.

The Swagger "Petstore" is a sample API for a pet store, showcasing Swagger’s capabilities for designing, building, and documenting APIs. 

It provides endpoints for managing pets, store orders, and user accounts, including operations like adding new pets, updating existing pets, placing orders, and managing user data.

Project written in `TypeScript` and uses `Playwright` automation framework.
It utilizes `axios 1.6.8` library for making API requests.

---

# Project's Structure
The project is structured as follows:

| File Name                | Description                                                                                                                                            |
|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| `client/axios-client.ts` | Setup client based on `axios` session for making the API requests.                                                                                     |
| `support/`               | Support directory for general utilities and `constants.ts` variables.                                                                                  |
| `tests/`                 | Directory `Playwright` will look for tests. Defined in the `playwright.config.ts`.                                                                     |
| `tests/pet`              | Each endpoint the API provides will get it's own directory.                                                                                            |
| `tests/pet/api-utils.ts` | Contain util classes for `/pet/*` endpoints. It extend `Client` class in `axios-client.ts`, build payloads for POST requests and execute the requests. |
| `tests/pet/get.spec.ts`  | Tests for GET API requests of `/pet/*` endpoints.                                                                                                      |
| `tests/pet/post.spec.ts` | Tests for POST API requests of `/pet/*` endpoints.                                                                                                     |
| `.env.template`          | Template for `.env` file, you need to rename `.env.template` in order to run the project. Read root's `README.md` for installation steps.              |
| `playwright.config.ts`   | `playwright` config for test runs.                                                                                                                     |

---

# Installation
Follow the installation steps in the root's `README.md` file.

---
# Configuration

In order to run the project, you will need to set up `.env` file in `api-tests` directory.

Run this command to create `.env` from `.env.template` file:

```bash
cp .env.template .env
```

### Environment Variables

`.env` contains 2 mandatory variables.

1. `API_BASE_URL` - The base URL of the API, requests from `Client` will be sent to this base URL.
2. `Protocol` - The protocol of `API_BASE_URL`.

### Configuration Options

* Timeout for test execution is 10 seconds.
* Assertion's timeout is 3 seconds.


---

# Writing Tests
This section provides guidelines for writing API tests in the `api-tests` project.

### Creating New Tests & Files
To maintain a structured approach, each endpoint that the API provides should have its own directory under the tests directory. 
For instance, all tests related to the `/pet/*` endpoints should be located in the `tests/pet` directory.

When adding new tests for a new endpoint, follow these steps:
1. Create a new directory for the endpoint, for example `tests/store`.
2. Within this directory, create an `api-utils.ts` file. 
This file will contain a class with methods specific to the endpoint's tests, such as `getPayloadData`.


Ensure that the class in `api-utils.ts` extends the `Client` class in `axios-client.ts` to have access to the client's methods.

### Writing Tests
Here’s an example of a test for GET `/pet/{petId}` endpoint:

* Use `test.describe` to group tests and `test` to write a test.
* Create a new instance of the `PetAPI` class using `const client = new PetAPI();` in the describe block to access the methods in `api-utils.ts`.

```typescript
test.describe('Tests GET request for API /pet/{id}', () => {
    let client: PetAPI;

    test.beforeAll(async () => {
        client = new PetAPI();
    });

    test('Get existing pet by id - 200 Success', {tag: '@smoke'}, async () => {
        const validPetId = 5;
        const response = await client.getPetById(validPetId);
        expect(response.status).toBe(200);
    });
});
```

### Writing Assertions
Assertions are written using the expect built-in function provided by `Playwright`. Here’s an example of an assertion in a test:
```typescript
expect(response.status).toBe(200);
```

---

# Running Tests

`Playwright` offers a variety of command options to run the tests.

| Command                                           | Description                                                                                      |
|---------------------------------------------------|--------------------------------------------------------------------------------------------------|
| `npm run test-api`                                | Use `package.json` script to run all tests.                                                      |
| `npx playwright test`                             | Use `playwright` installed in root's `node_modules` to run tests.                                |
| `npx playwright test tests/pet/get.spec.ts`       | Run only `get.spec.ts` tests.                                                                    |
| `npx playwright test tests/pet/post.spec.ts`      | Run only `post.spec.ts` tests.                                                                   |
| `npx playwright test get post`                    | Run by filename contains `get` or `post`.                                                        |
| `npx playwright test --workers=1`                 | Control amount of workers for parallel execution. 1 worker means test run won't run in parallel. |
| `npx playwright test -g "Get existing pet by id"` | Run specific test containing the string in its title.                                            |
| `npx playwright test --grep @smoke`               | Run `@smoke` tagged tests.                                                                       |
| `npx playwright test --grep-invert @smoke`        | Skip `@smoke` tagged tests.                                                                      |
| `npx playwright show-report`                      | Skip `@smoke` tagged tests.                                                                      |

