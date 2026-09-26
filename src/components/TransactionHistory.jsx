import { useState } from 'react'
import { filterTransactionsByDate, getPresetStart, toDateInputValue } from '../utils/statementUtils'

function TransactionHistory({ transactions, loading, error, onRetry, accountNumber }) {
    const [period, setPeriod] = useState('30d')
    const today = toDateInputValue(new Date())
    const [customStart, setCustomStart] = useState(getPresetStart('30d', today))
    const [customEnd, setCustomEnd] = useState(today)

    if (loading) {
        return <div className="transaction-page-state" role="status">Loading statement activity…</div>
    }

    if (error) {
        return (
            <div className="transaction-page-state" role="alert">
                <h2>Unable to load transactions</h2>
                <p>{error}</p>
                <button type="button" className="state-action" onClick={onRetry}>Retry</button>
            </div>
        )
    }

    const endDate = period === 'custom' ? customEnd : today
    const startDate = period === 'custom' ? customStart : getPresetStart(period, endDate)
    const validRange = Boolean(startDate && endDate && startDate <= endDate)
    const filteredTransactions = validRange
        ? filterTransactionsByDate(transactions, startDate, endDate)
        : []

    return (
        <section className="transaction-history">
            <div className="page-header statement-page-header">
                <div>
                    <span className="section-label">Statements</span>
                    <h2>Account Statement</h2>
                    <p>Choose a period to review and print your account activity.</p>
                </div>
                <a href="#dashboard" className="back-link print-hide">Back to dashboard</a>
            </div>

            <div className="statement-controls print-hide">
                <div className="form-group">
                    <label htmlFor="statement-period">Statement period</label>
                    <select id="statement-period" value={period} onChange={(event) => setPeriod(event.target.value)}>
                        <option value="30d">Last 30 days</option>
                        <option value="3m">Last 3 months</option>
                        <option value="6m">Last 6 months</option>
                        <option value="12m">Last 12 months</option>
                        <option value="custom">Custom dates</option>
                    </select>
                </div>

                {period === 'custom' && (
                    <>
                        <div className="form-group">
                            <label htmlFor="statement-start">From</label>
                            <input id="statement-start" type="date" value={customStart} max={customEnd || today} onChange={(event) => setCustomStart(event.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="statement-end">To</label>
                            <input id="statement-end" type="date" value={customEnd} max={today} min={customStart} onChange={(event) => setCustomEnd(event.target.value)} />
                        </div>
                    </>
                )}

                <button type="button" className="statement-print-button" onClick={() => window.print()} disabled={!validRange}>
                    Print statement
                </button>
            </div>

            {!validRange && <p className="statement-range-error" role="alert">Choose a valid date range to view this statement.</p>}

            <section id="printable-statement" className="transaction-history-card" aria-label="Account statement transactions">
                <div className="statement-print-heading">
                    <h1>Enterprise Banking</h1>
                    <h2>Account Statement</h2>
                    <p>Account ending in {String(accountNumber ?? '').slice(-4) || '—'}</p>
                    <p>Period: {startDate} to {endDate}</p>
                    <p>Generated: {new Date().toLocaleString('en-ZA')}</p>
                </div>

                <div className="transaction-history-header">
                    <span>Transaction</span>
                    <span>Date</span>
                    <span>Amount</span>
                    <span>Balance After</span>
                </div>

                {filteredTransactions.length === 0 ? (
                    <div className="statement-no-transactions">
                        No transactions were found for this period.
                    </div>
                ) : filteredTransactions.map((transaction) => {
                    const isCredit = ['Deposit', 'Transfer In'].includes(transaction.transactionType)
                    const amount = Number(transaction.amount).toLocaleString('en-ZA', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })
                    const balanceAfter = Number(transaction.balanceAfter).toLocaleString('en-ZA', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })
                    const date = new Date(transaction.transactionDate).toLocaleString('en-ZA', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })

                    return (
                        <div className="transaction-history-row" key={transaction.transactionId}>
                            <div className="transaction-description">
                                <strong>{transaction.transactionType}</strong>
                                <span>Account transaction</span>
                            </div>
                            <span className="transaction-date">{date}</span>
                            <span className={`transaction-history-amount ${isCredit ? 'positive' : 'negative'}`}>
                                {isCredit ? '+' : '−'} R{amount}
                            </span>
                            <span className="transaction-balance">R{balanceAfter}</span>
                        </div>
                    )
                })}
            </section>
        </section>
    )
}

export default TransactionHistory
