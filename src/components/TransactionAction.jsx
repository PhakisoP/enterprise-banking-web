import { useState } from 'react'

function TransactionAction({
                               type,
                               onSubmit,
                               onClose,
                               loading,
                               error,
                           }) {
    const [amount, setAmount] = useState('')

    const isDeposit = type === 'deposit'

    async function handleSubmit(event) {
        event.preventDefault()

        const numericAmount = Number(amount)

        if (!numericAmount || numericAmount <= 0) {
            return
        }

        await onSubmit(numericAmount)
    }

    return (
        <div className="transaction-modal-backdrop">
            <div className="transaction-modal">
                <div className="transaction-modal-header">
                    <div>
            <span className="section-label">
              Account transaction
            </span>

                        <h2>
                            {isDeposit ? 'Deposit Money' : 'Withdraw Money'}
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="modal-close-button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="transaction-amount">
                        Amount
                    </label>

                    <div className="amount-input">
                        <span>R</span>

                        <input
                            id="transaction-amount"
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={amount}
                            onChange={(event) => setAmount(event.target.value)}
                            placeholder="0.00"
                            disabled={loading}
                            autoFocus
                            required
                        />
                    </div>

                    {error && (
                        <div className="transaction-form-error">
                            {error}
                        </div>
                    )}

                    <div className="transaction-modal-actions">
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading || !amount || Number(amount) <= 0}
                        >
                            {loading
                                ? 'Processing...'
                                : isDeposit
                                    ? 'Deposit'
                                    : 'Withdraw'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TransactionAction