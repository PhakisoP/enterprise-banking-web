import { useCallback, useEffect, useState } from 'react'
import { deposit, getAccount, getTransactions, transfer, withdraw } from './services/accountService'
import TransactionHistory from './components/TransactionHistory'
import DepositForm from './components/DepositForm'
import TransferForm from './components/TransferForm'
import './App.css'

function App() {
  const accountNumber = import.meta.env.VITE_ACCOUNT_NUMBER

  const [account, setAccount] = useState(null)
  const [transactions, setTransactions] = useState([])

  const [transactionsLoading, setTransactionsLoading] = useState(true)
  const [transactionsError, setTransactionsError] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionType, setActionType] = useState(
      window.location.hash === '#transfer' ? 'transfer' : null,
  )
  const [actionSubmitting, setActionSubmitting] = useState(false)
  const [actionError, setActionError] = useState(null)
  const [actionNotice, setActionNotice] = useState(null)

  const [currentView, setCurrentView] = useState(
      window.location.hash === '#transactions'
          ? 'transactions'
          : 'dashboard',
  )
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const loadAccount = useCallback(async (showLoading = true, clearError = true) => {
    if (showLoading) setLoading(true)
    if (clearError) setError(null)

    try {
      const accountData = await getAccount(accountNumber)
      setAccount(accountData)
    } catch (exception) {
      setError(exception.message)
    } finally {
      if (showLoading) setLoading(false)
    }
  }, [accountNumber])

  async function handleTransaction(amount) {
    setActionSubmitting(true)
    setActionError(null)
    setActionNotice(null)

    try {
      if (actionType === 'transfer') {
        await transfer(accountNumber, amount.destinationAccountNumber, amount.amount)
        setActionType(null)
        if (window.location.hash === '#transfer') {
          window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#dashboard`)
        }
        setActionNotice('Transfer completed successfully.')
        await Promise.all([loadAccount(false), loadTransactions()])
        return
      }

      const isWithdrawal = actionType === 'withdrawal'
      await (isWithdrawal ? withdraw : deposit)(accountNumber, amount)
      setActionType(null)
      setActionNotice(`${isWithdrawal ? 'Withdrawal' : 'Deposit'} completed successfully.`)
      await Promise.all([loadAccount(false), loadTransactions()])
    } catch (exception) {
      setActionError(exception.message)
    } finally {
      setActionSubmitting(false)
    }
  }

  const loadTransactions = useCallback(async (showLoading = true, clearError = true) => {
    if (showLoading) setTransactionsLoading(true)
    if (clearError) setTransactionsError(null)

    try {
      const transactionData = await getTransactions(accountNumber)
      setTransactions(transactionData)
    } catch (exception) {
      setTransactionsError(exception.message)
    } finally {
      if (showLoading) setTransactionsLoading(false)
    }
  }, [accountNumber])

  useEffect(() => {
    let active = true

    getAccount(accountNumber)
      .then((accountData) => { if (active) setAccount(accountData) })
      .catch((exception) => { if (active) setError(exception.message) })
      .finally(() => { if (active) setLoading(false) })

    getTransactions(accountNumber)
      .then((transactionData) => { if (active) setTransactions(transactionData) })
      .catch((exception) => { if (active) setTransactionsError(exception.message) })
      .finally(() => { if (active) setTransactionsLoading(false) })

    return () => { active = false }
  }, [accountNumber])

  useEffect(() => {
    function handleHashChange() {
      if (window.location.hash === '#transfer') {
        setActionType('transfer')
        setActionError(null)
        setActionNotice(null)
      } else {
        setActionType(null)
      }
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

  useEffect(() => {
    if (!loading && currentView === 'dashboard' && window.location.hash === '#accounts') {
      document.getElementById('accounts')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [currentView, loading])

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
          <div>
            <h2>Unable to load your account</h2>
            <p>{error}</p>
            <button
                type="button"
                className="state-action"
                onClick={loadAccount}
            >
              Retry
            </button>
          </div>
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

            <nav className="navigation" aria-label="Main navigation">
              <a
                  href="#dashboard"
                  className="navigation-item"
              >
                Dashboard
              </a>

              <a href="#accounts" className="navigation-item">
                Accounts
              </a>

              <a
                  href="#transactions"
                  className="navigation-item active"
                  aria-current="page"
              >
                Transactions
              </a>

              <a href="#transfer" className="navigation-item" onClick={() => { setActionType('transfer'); setActionError(null); setActionNotice(null) }}>Payments</a>

              <span className="navigation-item navigation-item-disabled" aria-disabled="true" title="Settings are not available yet">
                Settings <small>Coming soon</small>
              </span>
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
                onRetry={loadTransactions}
                accountNumber={accountNumber}
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

          <nav className="navigation" aria-label="Main navigation">
            <a
                href="#dashboard"
                className={`navigation-item${window.location.hash === '#accounts' ? '' : ' active'}`}
                aria-current={window.location.hash === '#accounts' ? undefined : 'page'}
            >
              Dashboard
            </a>

            <a href="#accounts" className={`navigation-item${window.location.hash === '#accounts' ? ' active' : ''}`} aria-current={window.location.hash === '#accounts' ? 'page' : undefined}>
              Accounts
            </a>

            <a
                href="#transactions"
                className="navigation-item"
            >
              Transactions
            </a>

            <a href="#transfer" className="navigation-item" onClick={() => { setActionType('transfer'); setActionError(null); setActionNotice(null) }}>Payments</a>

            <span className="navigation-item navigation-item-disabled" aria-disabled="true" title="Settings are not available yet">
              Settings <small>Coming soon</small>
            </span>
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
          {actionNotice && <div className="action-notice" role="status">{actionNotice}</div>}

          <section className="welcome">
            <span className="welcome-label">{greeting}</span>

            <h2>Welcome to Enterprise Banking</h2>

            <p>
              Manage your account, monitor transactions and keep track
              of your finances.
            </p>
          </section>

          <section className="dashboard-grid">
            <article className="balance-card" id="accounts">
              <div className="card-header">
                <div>
                <span className="card-label">
                  Primary Account
                </span>

                  <span className="account-number">
                  Account ending in {String(account?.accountNumber ?? '').slice(-4) || '—'}
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
                <button type="button" onClick={() => { setActionType('deposit'); setActionError(null); setActionNotice(null) }}>
                  Deposit
                </button>

                <button
                    type="button"
                    className="secondary-button"
                    onClick={() => { setActionType('withdrawal'); setActionError(null); setActionNotice(null) }}
                >
                  Withdraw
                </button>

                <button type="button" className="secondary-button" onClick={() => { setActionType('transfer'); setActionError(null); setActionNotice(null) }}>
                  Transfer
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
                  <div className="transaction-state transaction-state-loading" role="status" aria-live="polite">
                    <span className="state-indicator" aria-hidden="true" />
                    <span>Loading your recent activity…</span>
                  </div>
              ) : transactionsError ? (
                  <div className="transaction-state transaction-state-error" role="alert">
                    <strong>Recent activity is unavailable</strong>
                    <span>{transactionsError}</span>

                    <button
                        type="button"
                        className="state-action"
                        onClick={loadTransactions}
                    >
                      Retry
                    </button>
                  </div>
              ) : transactions.length === 0 ? (
                  <div className="transaction-state transaction-state-empty">
                    <span className="empty-state-mark" aria-hidden="true">↗</span>
                    <strong>No activity yet</strong>
                    <span>Your recent account transactions will appear here.</span>
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
          {actionType === 'transfer' ? (
            <TransferForm
              sourceAccountNumber={accountNumber}
              onSubmit={handleTransaction}
              onCancel={() => {
                if (!actionSubmitting) {
                  setActionType(null)
                  if (window.location.hash === '#transfer') {
                    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#dashboard`)
                  }
                }
              }}
              submitting={actionSubmitting}
              error={actionError}
            />
          ) : actionType && (
            <DepositForm
              action={actionType}
              onSubmit={handleTransaction}
              onCancel={() => { if (!actionSubmitting) setActionType(null) }}
              submitting={actionSubmitting}
              error={actionError}
            />
          )}
        </main>
      </div>
  )
}

export default App
