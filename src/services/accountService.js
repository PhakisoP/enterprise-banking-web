const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

export async function getAccount(accountNumber) {
    const response = await fetch(
        `${API_BASE_URL}/accounts/${accountNumber}`,
    )

    if (!response.ok) {
        throw new Error(`Unable to load account: ${response.status}`)
    }

    return response.json()
}

export async function getTransactions(accountNumber) {
    const response = await fetch(
        `${API_BASE_URL}/accounts/${accountNumber}/transactions`,
    )

    if (!response.ok) {
        throw new Error(`Unable to load transactions: ${response.status}`)
    }

    return response.json()
}

export async function deposit(accountNumber, amount) {
    const response = await fetch(
        `${API_BASE_URL}/accounts/${accountNumber}/deposits`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount }),
        },
    )

    if (!response.ok) {
        const problem = await response.json()
        throw new Error(problem.detail || 'Deposit failed')
    }
}

export async function withdraw(accountNumber, amount) {
    const response = await fetch(
        `${API_BASE_URL}/accounts/${accountNumber}/withdrawals`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount }),
        },
    )

    if (!response.ok) {
        const problem = await response.json()
        throw new Error(problem.detail || 'Withdrawal failed')
    }
}