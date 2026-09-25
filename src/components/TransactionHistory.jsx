function TransactionHistory({ transactions, loading, error }) {
    if (loading) {
        return (
            <div className="transaction-page-state">
                <p>Loading transaction history...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="transaction-page-state">
                <h2>Unable to load transactions</h2>
                <p>{error}</p>
            </div>
        )
    }

    if (transactions.length === 0) {
        return (
            <div className="transaction-page-state">
                <h2>No transactions found</h2>
                <p>There are currently no transactions for this account.</p>
            </div>
        )
    }

    return (
        <section className="transaction-history">
            <div className="page-header">
                <div>
                    <span className="section-label">Activity</span>
                    <h2>Transaction History</h2>
                    <p>View all transactions associated with your account.</p>
                </div>

                <a href="#dashboard" className="back-link">
                    Back to dashboard
                </a>
            </div>

            <div className="transaction-history-card">
                <div className="transaction-history-header">
                    <span>Transaction</span>
                    <span>Date</span>
                    <span>Amount</span>
                    <span>Balance After</span>
                </div>

                {transactions.map((transaction) => {
                    const isCredit =
                        transaction.transactionType === 'Deposit' ||
                        transaction.transactionType === 'Transfer In'

                    const amount = Number(transaction.amount).toLocaleString('en-ZA', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })

                    const balanceAfter = Number(
                        transaction.balanceAfter,
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
                            className="transaction-history-row"
                            key={transaction.transactionId}
                        >
                            <div className="transaction-description">
                                <strong>{transaction.transactionType}</strong>
                                <span>Account transaction</span>
                            </div>

                            <span className="transaction-date">{date}</span>

                            <span
                                className={`transaction-history-amount ${
                                    isCredit ? 'positive' : 'negative'
                                }`}
                            >
                {isCredit ? '+' : '-'} R{amount}
              </span>

                            <span className="transaction-balance">
                R{balanceAfter}
              </span>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default TransactionHistory