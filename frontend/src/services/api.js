const API_BASE_URL = 'http://localhost:3001/api';

export const fetchTransactions = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/transactions`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
};

export const fetchTransactionById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/transactions/${id}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching transaction:', error);
        throw error;
    }
};
