import { useState } from 'react'
import { getTransferValidationError } from '../utils/statementUtils'

function TransferForm({ sourceAccountNumber, onSubmit, onCancel, submitting, error }) {
    const [destination, setDestination] = useState('')
    const [amount, setAmount] = useState('')
    const [validationError, setValidationError] = useState(null)
    const [reviewing, setReviewing] = useState(false)

    function handleSubmit(event) {
        event.preventDefault()
        if (reviewing) {
            onSubmit({
                destinationAccountNumber: Number(destination),
                amount: Number(amount),
            })
            return
        }

        const validationMessage = getTransferValidationError(sourceAccountNumber, destination, amount)
        if (validationMessage) {
            setValidationError(validationMessage)
            return
        }

        setValidationError(null)
        setReviewing(true)
    }

    return (
        <div className="modal-backdrop">
            <div className="modal" role="dialog" aria-modal="true" aria-labelledby="transfer-form-title">
                <div className="modal-header">
                    <div>
                        <span className="section-label">Payments</span>
                        <h2 id="transfer-form-title">Transfer funds</h2>
                        <p className="transfer-source">From account ending in {String(sourceAccountNumber ?? '').slice(-4) || '—'}</p>
                    </div>
                    <button type="button" className="modal-close" onClick={onCancel} disabled={submitting} aria-label="Close transfer form">×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {reviewing ? (
                        <div className="transfer-review">
                            <p>From account ending in <strong>{String(sourceAccountNumber ?? '').slice(-4) || '—'}</strong></p>
                            <p>To account <strong>{destination}</strong></p>
                            <p>Transfer amount <strong>R{Number(amount).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></p>
                            <p className="transfer-review-note">Confirm the destination and amount before sending.</p>
                        </div>
                    ) : <>
                    <div className="form-group">
                        <label htmlFor="transfer-destination">Destination account number</label>
                        <input
                            id="transfer-destination"
                            className="text-input"
                            type="number"
                            min="1"
                            step="1"
                            value={destination}
                            onChange={(event) => { setDestination(event.target.value); setValidationError(null) }}
                            autoFocus
                            required
                            disabled={submitting}
                        />
                    </div>

                    <div className="form-group transfer-amount-group">
                        <label htmlFor="transfer-amount">Amount</label>
                        <div className="amount-input">
                            <span>R</span>
                            <input
                                id="transfer-amount"
                                type="number"
                                min="0.01"
                                step="0.01"
                                placeholder="0.00"
                                value={amount}
                                onChange={(event) => { setAmount(event.target.value); setValidationError(null) }}
                                required
                                disabled={submitting}
                            />
                        </div>
                    </div>
                    </>}

                    {(validationError || error) && <div className="form-error" role="alert">{validationError || error}</div>}

                    <div className="modal-actions">
                        {reviewing && <button type="button" className="secondary-button" onClick={() => setReviewing(false)} disabled={submitting}>Edit details</button>}
                        <button type="button" className="secondary-button" onClick={onCancel} disabled={submitting}>Cancel</button>
                        <button type="submit" disabled={submitting}>{submitting ? 'Processing…' : reviewing ? 'Confirm transfer' : 'Review transfer'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TransferForm
