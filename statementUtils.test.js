import assert from 'node:assert/strict'
import test from 'node:test'
import {
    filterTransactionsByDate,
    getPresetStart,
    getTransferValidationError,
} from './src/utils/statementUtils.js'

test('statement presets calculate the selected term, including month ends', () => {
    assert.equal(getPresetStart('30d', '2026-09-26'), '2026-08-28')
    assert.equal(getPresetStart('3m', '2026-09-26'), '2026-06-26')
    assert.equal(getPresetStart('6m', '2026-09-26'), '2026-03-26')
    assert.equal(getPresetStart('12m', '2026-09-26'), '2025-09-26')
    assert.equal(getPresetStart('3m', '2026-05-31'), '2026-02-28')
})

test('statement date filtering includes both selected boundary dates', () => {
    const transactions = [
        { transactionId: 1, transactionDate: '2026-08-31T12:00:00' },
        { transactionId: 2, transactionDate: '2026-09-01T00:00:00' },
        { transactionId: 3, transactionDate: '2026-09-02T00:00:00' },
        { transactionId: 4, transactionDate: 'not-a-date' },
    ]

    assert.deepEqual(
        filterTransactionsByDate(transactions, '2026-09-01', '2026-09-02')
            .map(({ transactionId }) => transactionId),
        [2, 3],
    )
    assert.deepEqual(filterTransactionsByDate(transactions, '2026-09-03', '2026-09-01'), [])
})

test('transfer validation rejects a missing, invalid, or same destination account', () => {
    assert.match(getTransferValidationError(1001, '', '20'), /destination account/)
    assert.match(getTransferValidationError(1001, '1.5', '20'), /destination account/)
    assert.match(getTransferValidationError(1001, '1001', '20'), /different destination/)
})

test('transfer validation requires a positive amount and accepts valid details', () => {
    assert.match(getTransferValidationError(1001, '2002', '0'), /greater than zero/)
    assert.match(getTransferValidationError(1001, '2002', '-1'), /greater than zero/)
    assert.equal(getTransferValidationError(1001, '2002', '25.50'), null)
})
