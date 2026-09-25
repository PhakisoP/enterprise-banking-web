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