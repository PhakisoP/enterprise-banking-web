# Enterprise Banking Web

A responsive React dashboard for the Enterprise Banking application. It displays an account and its transaction activity, supports deposits, withdrawals, and transfers, and can print a transaction statement for a selected period.

This is a portfolio application for learning and demonstration. It is not a real banking service and does not implement user login or authorization.

## Project overview

The web app is built with React and Vite. It communicates with the separate Spring Boot REST API, which applies the banking rules and stores account and transaction data in MySQL.

```text
Browser (React)  ->  Spring Boot REST API  ->  MySQL
                           Flyway manages schema changes
```

The API repository contains the backend setup, endpoint reference, database details, and architecture notes: [Enterprise Banking API](https://github.com/PhakisoP/enterprise-banking-api) and its [architecture guide](https://github.com/PhakisoP/enterprise-banking-api/blob/main/docs/architecture.md).

## Features

- Account dashboard and account information
- Transaction history with statement-period filtering
- Deposit, withdrawal, and transfer forms
- Loading, success, and error feedback for account actions
- Printable statement using the browser print dialog
- Responsive layouts for narrower screens

## Run the full application locally

You need Java 25, Node.js 22, npm, and a running MySQL server. The API README has the full backend configuration and database instructions.

1. Clone both repositories and create the `enterprise_banking` database in MySQL.
2. In the API repository, configure `DB_PASSWORD` for your local MySQL account. Set `DB_URL` or `DB_USERNAME` only if your local connection differs from the defaults. Start the API:

   ```powershell
   .\mvnw.cmd spring-boot:run
   ```

   The API runs at `http://localhost:8080`. Flyway applies pending migrations at startup. Migrations create the schema but do not seed demo accounts; add local sample accounts in MySQL after startup if needed:

   ```sql
   INSERT INTO accounts (account_number, customer_id, account_type, balance)
   VALUES
       (888888, 888888, 'Cheque', 31000.00),
       (999999, 999999, 'Savings', 2000.00);
   ```

3. In this repository, create `.env.local` with the account and API URL you want the dashboard to use:

   ```dotenv
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   VITE_ACCOUNT_NUMBER=888888
   ```

   Replace the account number with an account that exists in your database. Vite exposes `VITE_` values in the browser bundle, so they must contain non-secret configuration only.

4. Install dependencies and start the frontend:

   ```sh
   npm install
   npm run dev
   ```

   Open the local URL printed by Vite, usually `http://localhost:5173`.

## Frontend commands

```sh
npm test
npm run lint
npm run build
```

`npm test` runs the Node.js built-in tests for statement-period filtering and transfer input validation. `npm run build` writes the production bundle to `dist/`.

## API integration

The frontend reads account details and transaction history from the configured API. Deposits and withdrawals use the account action endpoints. Transfers use:

```http
POST /api/v1/accounts/{sourceAccountNumber}/transfers
Content-Type: application/json

{
  "destinationAccountNumber": 123456,
  "amount": 250.00
}
```

The API applies the debit, credit, and corresponding transaction records in one database transaction. The statement period is filtered from the account history returned by the API; printing opens the browser's print dialog for the selected period.

For a live project presentation, follow the [demo walkthrough](docs/demo-walkthrough.md). The gallery below shows static example states using sample account data.

## Screenshots

### Dashboard

The dashboard brings the configured account balance, actions, and recent activity together.

![Dashboard overview](docs/screenshots/dashboard-overview.png)

### Accounts

The account view presents the demo account summary and its available actions.

![Accounts overview](docs/screenshots/accounts-overview.png)

### Transaction history

The statement view supports selecting a period and printing the filtered activity.

![Transaction history](docs/screenshots/transaction-history.png)

### Transfer funds

The transfer form collects a destination account and amount before submission.

![Transfer funds dialog](docs/screenshots/transfer-dialog.png)

### Deposit

The deposit form lets the user enter an amount for the configured account.

![Deposit dialog](docs/screenshots/deposit-dialog.png)

### Withdrawal

The withdrawal form lets the user enter an amount for the configured account.

![Withdrawal dialog](docs/screenshots/withdrawal-dialog.png)

### Dashboard after transfer

The success state shows refreshed account activity after a transfer.

![Dashboard after transfer](docs/screenshots/dashboard-after-transfer.png)
