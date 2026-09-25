import { useState } from 'react'

function DepositForm({ onSubmit, onCancel, submitting, error }) {
    const [amount, setAmount] = useState('')
    const [validationError, setValidationError] = useState(null)

    function handleSubmit(event) {
        event.preventDefault()

        const numericAmount = Number(amount)

        if (!amount || Number.isNaN(numericAmount)) {
            setValidationError('Please enter a valid deposit amount.')
            return
        }

        if (numericAmount <= 0) {
            setValidationError('Deposit amount must be greater than zero.')
            return
        }

        setValidationError(null)
        onSubmit(numericAmount)
    }

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <div className="modal-header">
                    <div>
                        <span className="section-label">Account</span>
                        <h2>Make a Deposit</h2>
                    </div>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onCancel}
                        disabled={submitting}
                        aria-label="Close deposit form"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="deposit-amount">
                            Deposit amount
                        </label>

                        <div className="amount-input">
                            <span>R</span>

                            <input
                                id="deposit-amount"
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
                            {submitting ? 'Processing...' : 'Deposit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default DepositForm