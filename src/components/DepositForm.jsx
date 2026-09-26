import { useState } from 'react'

function DepositForm({ action = 'deposit', onSubmit, onCancel, submitting, error }) {
    const [amount, setAmount] = useState('')
    const [validationError, setValidationError] = useState(null)
    const isWithdrawal = action === 'withdrawal'
    const actionLabel = isWithdrawal ? 'Withdrawal' : 'Deposit'

    function handleSubmit(event) {
        event.preventDefault()

        const numericAmount = Number(amount)

        if (!amount || Number.isNaN(numericAmount)) {
            setValidationError(`Please enter a valid ${actionLabel.toLowerCase()} amount.`)
            return
        }

        if (numericAmount <= 0) {
            setValidationError(`${actionLabel} amount must be greater than zero.`)
            return
        }

        setValidationError(null)
        onSubmit(numericAmount)
    }

    return (
        <div className="modal-backdrop">
            <div className="modal" role="dialog" aria-modal="true" aria-labelledby="transaction-form-title">
                <div className="modal-header">
                    <div>
                        <span className="section-label">Account</span>
                        <h2 id="transaction-form-title">Make a {actionLabel}</h2>
                    </div>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onCancel}
                        disabled={submitting}
                        aria-label={`Close ${actionLabel.toLowerCase()} form`}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="transaction-amount">
                            {actionLabel} amount
                        </label>

                        <div className="amount-input">
                            <span>R</span>

                            <input
                                id="transaction-amount"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={amount}
                                onChange={(event) => {
                                    setAmount(event.target.value)
                                    setValidationError(null)
                                }}
                                placeholder="0.00"
                                disabled={submitting}
                                autoFocus
                            />
                        </div>
                    </div>

                    {validationError && (
                        <div className="form-error">
                            {validationError}
                        </div>
                    )}

                    {error && (
                        <div className="form-error">
                            {error}
                        </div>
                    )}

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={onCancel}
                            disabled={submitting}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting ? 'Processing...' : actionLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default DepositForm
