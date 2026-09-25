import { useEffect, useState } from 'react'
import {
  getAccount,
  getTransactions,
} from './services/accountService'
import TransactionHistory from './components/TransactionHistory'
import './App.css'

function App() {
  const accountNumber = import.meta.env.VITE_ACCOUNT_NUMBER

  const [account, setAccount] = useState(null)
  const [transactions, setTransactions] = useState([])

  const [transactionsLoading, setTransactionsLoading] = useState(true)
  const [transactionsError, setTransactionsError] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [currentView, setCurrentView] = useState(
    window.location.hash === '#transactions'
      ? 'transactions'
      : 'dashboard',
  )

  useEffect(() => {
    async function loadAccount() {
      try {
        const accountData = await getAccount(accountNumber)
        setAccount(accountData)
      } catch (exception) {
        setError(exception.message)
      } finally {
        setLoading(false)
      }
    }

    async function loadTransactions() {
      try {
        const transactionData = await getTransactions(accountNumber)
        setTransactions(transactionData)
      } catch (exception) {
        setTransactionsError(exception.message)
      } finally {
        setTransactionsLoading(false)
      }
    }

    loadAccount()
    loadTransactions()
  }, [accountNumber])

  useEffect(() => {
    function handleHashChange() {
      setCurrentView(
        window.location.hash === '#transactions'
          ? 'transactions'
          : 'dashboard',
      )
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  if (loading) {
    return (
      <div className="app-state">
        <p>Loading your account...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-state">
        <h2>Unable to load your account</h2>
        <p>{error}</p>
      </div>
    )
  }

  if (currentView === 'transactions') {
    return (
      <div className="app">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-mark">EB</div>

            <div>
              <span className="brand-name">Enterprise</span>
              <span className="brand-subtitle">Banking</span>
            </div>
          </div>

          <nav className="navigation">
            <a
              href="#dashboard"
              className="navigation-item"
            >
              Dashboard
            </a>

            <a
              href="#accounts"
              className="navigation-item"
            >
              Accounts
            </a>

            <a
              href="#transactions"
              className="navigation-item active"
            >
              Transactions
            </a>

            <a
              href="#payments"
              className="navigation-item"
            >
              Payments
            </a>

            <a
              href="#settings"
              className="navigation-item"
            >
              Settings
            </a>
          </nav>

          <div className="sidebar-footer">
            <span>Enterprise Banking</span>
            <span>Secure banking platform</span>
          </div>
        </aside>

        <main className="main-content">
          <header className="topbar">
            <div>
              <span className="topbar-label">
                Personal Banking
              </span>

              <h1>Transactions</h1>
            </div>

            <div className="profile">
              <div className="profile-avatar">P</div>

              <div className="profile-details">
                <span className="profile-name">Phakiso</span>
                <span className="profile-role">
                  Account Holder
                </span>
              </div>
            </div>
          </header>

          <TransactionHistory
            transactions={transactions}
            loading={transactionsLoading}
            error={transactionsError}
          />
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">EB</div>

          <div>
            <span className="brand-name">Enterprise</span>
            <span className="brand-subtitle">Banking</span>
          </div>
        </div>

        <nav className="navigation">
          <a
            href="#dashboard"
            className="navigation-item active"
          >
            Dashboard
          </a>

          <a
            href="#accounts"
            className="navigation-item"
          >
            Accounts
          </a>

          <a
            href="#transactions"
            className="navigation-item"
          >
            Transactions
          </a>

          <a
            href="#payments"
            className="navigation-item"
          >
            Payments
          </a>

          <a
            href="#settings"
            className="navigation-item"
          >
            Settings
          </a>
        </nav>

        <div className="sidebar-footer">
          <span>Enterprise Banking</span>
          <span>Secure banking platform</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="topbar-label">
              Personal Banking
            </span>

            <h1>Dashboard</h1>
          </div>

          <div className="profile">
            <div className="profile-avatar">P</div>

            <div className="profile-details">
              <span className="profile-name">Phakiso</span>
              <span className="profile-role">
                Account Holder
              </span>
            </div>
          </div>
        </header>

        <section className="welcome">
          <span className="welcome-label">Good evening</span>

          <h2>Welcome to Enterprise Banking</h2>

          <p>
            Manage your account, monitor transactions and keep track
            of your finances.
          </p>
        </section>

        <section className="dashboard-grid">
          <article className="balance-card">
            <div className="card-header">
              <div>
                <span className="card-label">
                  Primary Account
                </span>

                <span className="account-number">
                  Account •••• {account?.accountNumber}
                </span>
              </div>

              <span className="account-type">
                {account?.accountType}
              </span>
            </div>

            <div className="balance">
              <span className="balance-label">
                Available Balance
              </span>

              <strong>
                {account
                  ? `R${Number(account.balance).toLocaleString(
    'en-ZA',
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
)}`
                  : '—'}
              </strong>
            </div>

            <div className="card-actions">
              <button type="button">
                Deposit
              </button>

              <button
                type="button"
                className="secondary-button"
              >
                Withdraw
              </button>
            </div>
          </article>

          <article className="summary-card">
            <span className="card-label">
              Account Overview
            </span>

            <div className="summary-row">
              <span>Account Status</span>
              <strong className="status">
                Active
              </strong>
            </div>

            <div className="summary-row">
              <span>Account Type</span>
              <strong>Current Account</strong>
            </div>

            <div className="summary-row">
              <span>Currency</span>
              <strong>ZAR</strong>
            </div>
          </article>
        </section>

        <section className="transactions-section">
          <div className="section-header">
            <div>
              <span className="section-label">
                Activity
              </span>

              <h2>Recent Transactions</h2>
            </div>

            <a href="#transactions">
              View all
            </a>
          </div>

          <div className="transactions-card">
            {transactionsLoading ? (
              <div className="transaction-state">
                Loading transactions...
              </div>
            ) : transactionsError ? (
              <div className="transaction-state">
                Unable to load transactions.
              </div>
            ) : transactions.length === 0 ? (
              <div className="transaction-state">
                No transactions found.
              </div>
            ) : (
              transactions.slice(0, 5).map((transaction) => {
                const isCredit =
                  transaction.transactionType === 'Deposit' ||
                  transaction.transactionType === 'Transfer In'

                const amount = Number(
                  transaction.amount,
                ).toLocaleString('en-ZA', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })

                const date = new Date(
                  transaction.transactionDate,
                ).toLocaleString('en-ZA', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })

                return (
                  <div
                    className="transaction-row"
                    key={transaction.transactionId}
                  >
                    <div>
                      <strong>
                        {transaction.transactionType}
                      </strong>

                      <span>{date}</span>
                    </div>

                    <div
                      className={`transaction-amount ${
  isCredit
      ? 'positive'
      : 'negative'
}`}
                    >
                      {isCredit ? '+' : '-'} R{amount}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App