import './App.css'

function App() {
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
            <a href="#dashboard" className="navigation-item active">
              Dashboard
            </a>

            <a href="#accounts" className="navigation-item">
              Accounts
            </a>

            <a href="#transactions" className="navigation-item">
              Transactions
            </a>

            <a href="#payments" className="navigation-item">
              Payments
            </a>

            <a href="#settings" className="navigation-item">
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
              <span className="topbar-label">Personal Banking</span>
              <h1>Dashboard</h1>
            </div>

            <div className="profile">
              <div className="profile-avatar">P</div>
              <div className="profile-details">
                <span className="profile-name">Phakiso</span>
                <span className="profile-role">Account Holder</span>
              </div>
            </div>
          </header>

          <section className="welcome">
            <span className="welcome-label">Good evening</span>
            <h2>Welcome to Enterprise Banking</h2>
            <p>
              Manage your account, monitor transactions and keep track of your
              finances.
            </p>
          </section>

          <section className="dashboard-grid">
            <article className="balance-card">
              <div className="card-header">
                <div>
                  <span className="card-label">Primary Account</span>
                  <span className="account-number">Account •••• 888888</span>
                </div>

                <span className="account-type">Current Account</span>
              </div>

              <div className="balance">
                <span className="balance-label">Available Balance</span>
                <strong>R31,000.00</strong>
              </div>

              <div className="card-actions">
                <button type="button">Deposit</button>
                <button type="button" className="secondary-button">
                  Withdraw
                </button>
              </div>
            </article>

            <article className="summary-card">
              <span className="card-label">Account Overview</span>

              <div className="summary-row">
                <span>Account Status</span>
                <strong className="status">Active</strong>
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
                <span className="section-label">Activity</span>
                <h2>Recent Transactions</h2>
              </div>

              <a href="#transactions">View all</a>
            </div>

            <div className="transactions-card">
              <div className="transaction-row">
                <div>
                  <strong>Withdrawal</strong>
                  <span>Account transaction</span>
                </div>

                <div className="transaction-amount negative">
                  - R500.00
                </div>
              </div>

              <div className="transaction-row">
                <div>
                  <strong>Deposit</strong>
                  <span>Account transaction</span>
                </div>

                <div className="transaction-amount positive">
                  + R1,000.00
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
  )
}

export default App