# Enterprise Banking Demo Walkthrough

This walkthrough is a short way to present the current application to a reviewer. It follows the user's path through the React interface and explains where the Spring Boot API and MySQL fit. The screenshots in this repository are static examples from the project; they do not update when your local database changes.

## Prepare the demo

1. Follow the full-stack setup in the [web README](../README.md) and the [API README](https://github.com/PhakisoP/enterprise-banking-api).
2. Start MySQL, then start the API and confirm `http://localhost:8080/actuator/health` reports `UP`.
3. Start the React app at `http://localhost:5173` with `VITE_API_BASE_URL` and `VITE_ACCOUNT_NUMBER` set. Use the sample account data from the API README or another test dataset that you control.
4. Confirm that the source account has enough sample funds and that the destination account exists. Use only demonstration data; this application has no login or authorization.
5. Leave Swagger UI open if you want to show the API after the frontend walkthrough: `http://localhost:8080/swagger-ui/index.html`.

## A three to four minute walkthrough

### 1. Introduce the application

Show the dashboard and point out the displayed account balance, recent activity, and quick actions. Explain that React reads the account and history from the API; the browser does not talk directly to MySQL.

![Dashboard overview](screenshots/dashboard-overview.png)

### 2. Show the account and statement views

Open **Accounts** to show the account summary and available operations. Open **Transactions** to show the activity list, choose a statement period, and explain that printing uses the browser's print dialog. You can cancel the print dialog after showing its preview.

![Account overview](screenshots/accounts-overview.png)

![Statement and transaction history](screenshots/transaction-history.png)

### 3. Demonstrate one account action

Open the deposit or withdrawal form and briefly explain the amount field and confirmation action. If you submit it, use a small amount from the sample dataset and point out the success feedback and refreshed balance/history. The API validates the request too; frontend validation is for usability, not access control.

![Deposit form](screenshots/deposit-dialog.png)

![Withdrawal form](screenshots/withdrawal-dialog.png)

### 4. Demonstrate a transfer

Open the transfer form, enter the existing destination account and a small amount, then use the review/confirmation flow. Point out the success notice and the new transfer activity. In the backend, the source debit, destination credit, and both transaction records are handled inside one service transaction.

![Transfer form](screenshots/transfer-dialog.png)

![Dashboard after a successful transfer](screenshots/dashboard-after-transfer.png)

### 5. Connect the UI to the engineering decisions

Finish with the [architecture guide](https://github.com/PhakisoP/enterprise-banking-api/blob/main/docs/architecture.md). Summarize the request path as React → REST controller → service → repository/JPA → MySQL. Mention Flyway's schema migrations and optimistic locking only if you can point to those parts in the code.

## Keep the explanation accurate

- This is a portfolio project with sample data, not a real banking service.
- It does not implement login or authorization. A configured account number in the frontend is not user identity or access control.
- The database migrations create tables but do not seed demo accounts.
- The screenshots illustrate expected views and example UI states; live balances and transaction history depend on the local database.
- If a detail is not clear in the code, say you would verify it rather than guessing.

## If the demo does not load

- Check that MySQL is running and the API process started successfully.
- Open the health URL above. If the API is down, check the API startup output and database connection settings.
- Check that the account configured in `VITE_ACCOUNT_NUMBER` exists in MySQL.
- Check that the API's allowed CORS origin matches the local frontend origin, normally `http://localhost:5173`.
- Check `VITE_API_BASE_URL` points to `http://localhost:8080/api/v1`, then reload the frontend.
