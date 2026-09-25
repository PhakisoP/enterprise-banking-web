import { useEffect, useState } from 'react'
import { getTransactions } from '../services/accountService'

function TransactionsPage({ accountNumber }) {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function loadTransactions() {
            try {
                const transactionData = await getTransactions(accountNumber)
                setTransactions(transactionData)
            } catch (exception) {
                setError(exception.message)
            } finally {
                setLoading(false)
            }
        }

        loadTransactions()
    }, [accountNumber])

    if (loading) {
        return (
            <section className="page-section">
                <div className="page-header">
                    <div>
                        <span className="section-label">Activity</span>
                        <h2>Transaction History</h2>
                    </div>
                </div>

                <div className="transactions-card">
                    <div className="transaction-state">
                        Loading transactions...
                    </div>
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section className="page-section">
                <div className="page-header">
                    <div>
                        <span className="section-label">Activity</span>
                        <h2>Transaction History</h2>
                    </div>
                </div>

                <div className="transactions-card">
                    <div className="transaction-state">
                        <strong>Unable to load transactions.</strong>
                        <span>{error}</span>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="page-section">
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

            <div className="transactions-card">
                {transactions.length === 0 ? (
                    <div className="transaction-state">
                        No transactions found.
                    </div>
                ) : (
                    <div className="transaction-history">
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

                            const amount = Number(transaction.amount).toLocaleString(
                                'en-ZA',
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                },
                            )

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
                                    <div>
                                        <strong>{transaction.transactionType}</strong>
                                        <span>
                      Transaction #{transaction.transactionId}
                    </span>
                                    </div>

                                    <span>{date}</span>

                                    <strong
                                        className={
                                            isCredit
                                                ? 'transaction-amount positive'
                                                : 'transaction-amount negative'
                                        }
                                    >
                                        {isCredit ? '+' : '-'} R{amount}
                                    </strong>

                                    <span>R{balanceAfter}</span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}

export default TransactionsPage