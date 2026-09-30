const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
const API_BASE_URL = (
    configuredApiBaseUrl ||
    (import.meta.env.DEV ? 'http://localhost:8080/api/v1' : '')
).replace(/\/+$/, '')

function accountEndpoint(accountNumber, resource = '') {
    if (!API_BASE_URL) {
        throw new Error('Banking API is not configured. Set VITE_API_BASE_URL for this deployment.')
    }

    if (!accountNumber) {
        throw new Error('Account number is not configured. Set VITE_ACCOUNT_NUMBER.')
    }

    return `${API_BASE_URL}/accounts/${encodeURIComponent(accountNumber)}${resource}`
}

async function throwResponseError(response, fallbackMessage) {
    // Keep internal server details out of user-facing errors.
    if (response.status >= 500) {
        throw new Error(`${fallbackMessage} (${response.status})`)
    }

    let problem

    try {
        problem = await response.json()
    } catch {
        // Some API errors have an empty or non-JSON response body.
    }

    throw new Error(
        problem?.detail || problem?.message || `${fallbackMessage} (${response.status})`,
    )
}

export async function getAccount(accountNumber) {
    const response = await fetch(
        accountEndpoint(accountNumber),
    )

    if (!response.ok) {
        await throwResponseError(response, 'Unable to load account')
    }

    return response.json()
}

export async function getTransactions(accountNumber) {
    const response = await fetch(
        accountEndpoint(accountNumber, '/transactions'),
    )

    if (!response.ok) {
        await throwResponseError(response, 'Unable to load transactions')
    }

    return response.json()
}

export async function deposit(accountNumber, amount) {
    const response = await fetch(
        accountEndpoint(accountNumber, '/deposits'),
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount }),
        },
    )

    if (!response.ok) {
        await throwResponseError(response, 'Deposit failed')
    }
}

export async function withdraw(accountNumber, amount) {
    const response = await fetch(
        accountEndpoint(accountNumber, '/withdrawals'),
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount }),
        },
    )

    if (!response.ok) {
        await throwResponseError(response, 'Withdrawal failed')
    }
}

export async function transfer(accountNumber, destinationAccountNumber, amount) {
    const response = await fetch(
        accountEndpoint(accountNumber, '/transfers'),
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ destinationAccountNumber, amount }),
        },
    )

    if (!response.ok) {
        await throwResponseError(response, 'Transfer failed')
    }
}
