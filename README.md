## Getting Started
- copy the .env.example file into a .env file
- `cp .env.example .env`
- `docker compose build`
- `docker compose up`
- `npm run migrate`
- `npm run seed`
- if you view your database, you should be able to see a populated form data table
- running the following in your terminal will perform a GET request to fetch the form data
```bash
curl --location 'http://127.0.0.1:8080/form/{insert your generated form id here}' --header 'Content-Type: application/json'
```

## Install dependencies
Execute the command below to install dependencies:
```shell
npm install
```

## Execute Unit Tests
Execute the unit tests running the command below:
```shell
npx jest
```
Expected result:
```
PASS  tests/form.service.test.ts
PASS  tests/source.service.test.ts

Test Suites: 2 passed, 2 total
Tests:       10 passed, 10 total
```
