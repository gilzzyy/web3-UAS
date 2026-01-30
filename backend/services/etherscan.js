const axios = require('axios');

// Etherscan Sepolia API configuration
const ETHERSCAN_API_URL = 'https://api-sepolia.etherscan.io/api';
const ETHERSCAN_API_KEY = 'YourApiKeyToken'; // Free API key - get from etherscan.io

// Donation contract address (deployed on Sepolia)
const DONATION_CONTRACT_ADDRESS = '0x5B07360756Ebbc350e2E4c642a09E00942240212';

/**
 * Fetch transactions for the donation contract from Etherscan
 */
async function getContractTransactions() {
    try {
        const response = await axios.get(ETHERSCAN_API_URL, {
            params: {
                module: 'account',
                action: 'txlist',
                address: DONATION_CONTRACT_ADDRESS,
                startblock: 0,
                endblock: 99999999,
                page: 1,
                offset: 50,
                sort: 'desc',
                apikey: ETHERSCAN_API_KEY
            }
        });

        if (response.data.status === '1' && response.data.result) {
            return response.data.result.map((tx, index) => ({
                id: index + 1,
                hash: tx.hash,
                from: tx.from,
                to: tx.to,
                value: (parseFloat(tx.value) / 1e18).toFixed(6), // Wei to ETH
                gasUsed: tx.gasUsed,
                gasPrice: tx.gasPrice,
                status: tx.txreceipt_status === '1' ? 'success' : 'failed',
                timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
                blockNumber: parseInt(tx.blockNumber),
                confirmations: parseInt(tx.confirmations),
                methodId: tx.methodId,
                functionName: tx.functionName || 'Unknown'
            }));
        }

        return [];
    } catch (error) {
        console.error('Error fetching from Etherscan:', error.message);
        throw error;
    }
}

/**
 * Fetch internal transactions (contract interactions)
 */
async function getInternalTransactions() {
    try {
        const response = await axios.get(ETHERSCAN_API_URL, {
            params: {
                module: 'account',
                action: 'txlistinternal',
                address: DONATION_CONTRACT_ADDRESS,
                startblock: 0,
                endblock: 99999999,
                page: 1,
                offset: 50,
                sort: 'desc',
                apikey: ETHERSCAN_API_KEY
            }
        });

        if (response.data.status === '1' && response.data.result) {
            return response.data.result;
        }

        return [];
    } catch (error) {
        console.error('Error fetching internal transactions:', error.message);
        throw error;
    }
}

/**
 * Get contract ETH balance
 */
async function getContractBalance() {
    try {
        const response = await axios.get(ETHERSCAN_API_URL, {
            params: {
                module: 'account',
                action: 'balance',
                address: DONATION_CONTRACT_ADDRESS,
                tag: 'latest',
                apikey: ETHERSCAN_API_KEY
            }
        });

        if (response.data.status === '1' && response.data.result) {
            return (parseFloat(response.data.result) / 1e18).toFixed(6);
        }

        return '0';
    } catch (error) {
        console.error('Error fetching balance:', error.message);
        throw error;
    }
}

module.exports = {
    getContractTransactions,
    getInternalTransactions,
    getContractBalance,
    DONATION_CONTRACT_ADDRESS
};
