export function toDateInputValue(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export function getPresetStart(period, endValue) {
    const start = new Date(`${endValue}T12:00:00`)
    if (period === '30d') start.setDate(start.getDate() - 29)
    const months = { '3m': 3, '6m': 6, '12m': 12 }[period]
    if (months) {
        const originalDay = start.getDate()
        start.setDate(1)
        start.setMonth(start.getMonth() - months)
        const lastDay = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate()
        start.setDate(Math.min(originalDay, lastDay))
    }
    return toDateInputValue(start)
}

export function filterTransactionsByDate(transactions, startDate, endDate) {
    if (!startDate || !endDate || startDate > endDate) return []
    return transactions.filter((transaction) => {
        const date = new Date(transaction.transactionDate)
        if (Number.isNaN(date.getTime())) return false
        const value = toDateInputValue(date)
        return value >= startDate && value <= endDate
    })
}

export function getTransferValidationError(source, destination, amount) {
    const destinationNumber = Number(destination)
    const numericAmount = Number(amount)
    if (!destination || !Number.isInteger(destinationNumber) || destinationNumber <= 0) {
        return 'Enter a valid destination account number.'
    }
    if (destinationNumber === Number(source)) {
        return 'Choose a different destination account.'
    }
    if (!amount || !Number.isFinite(numericAmount) || numericAmount <= 0) {
        return 'Enter a transfer amount greater than zero.'
    }
    return null
}
