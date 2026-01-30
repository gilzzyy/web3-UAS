const express = require('express');
const router = express.Router();
const { getContractTransactions, getContractBalance, DONATION_CONTRACT_ADDRESS } = require('../services/etherscan');

// Cache untuk mengurangi API calls
let transactionsCache = null;
let cacheTime = null;
const CACHE_DURATION = 30000; // 30 detik

// GET /api/transactions - Get all transactions from blockchain
router.get('/', async (req, res) => {
    try {
        // Check cache
        const now = Date.now();
        if (transactionsCache && cacheTime && (now - cacheTime < CACHE_DURATION)) {
            return res.json({
                success: true,
                source: 'cache',
                contract: DONATION_CONTRACT_ADDRESS,
                count: transactionsCache.length,
                data: transactionsCache
            });
        }

        // Fetch fresh data from Etherscan
        const transactions = await getContractTransactions();

        // Update cache
        transactionsCache = transactions;
        cacheTime = now;

        res.json({
            success: true,
            source: 'etherscan',
            contract: DONATION_CONTRACT_ADDRESS,
            count: transactions.length,
            data: transactions
        });
    } catch (error) {
        console.error('Error fetching transactions:', error.message);

        // Return cached data if available on error
        if (transactionsCache) {
            return res.json({
                success: true,
                source: 'cache (fallback)',
                contract: DONATION_CONTRACT_ADDRESS,
                count: transactionsCache.length,
                data: transactionsCache
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to fetch transactions from blockchain',
            message: error.message
        });
    }
});

// GET /api/transactions/balance - Get contract balance
router.get('/balance', async (req, res) => {
    try {
        const balance = await getContractBalance();
        res.json({
            success: true,
            contract: DONATION_CONTRACT_ADDRESS,
            balance: balance,
            unit: 'ETH'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch balance'
        });
    }
});

// GET /api/transactions/:hash - Get single transaction by hash
router.get('/:hash', async (req, res) => {
    try {
        const hash = req.params.hash;

        // If no cache, fetch fresh
        if (!transactionsCache) {
            transactionsCache = await getContractTransactions();
            cacheTime = Date.now();
        }

        const transaction = transactionsCache.find(
            t => t.hash.toLowerCase() === hash.toLowerCase()
        );

        if (!transaction) {
            return res.status(404).json({
                success: false,
                error: 'Transaction not found'
            });
        }

        res.json({
            success: true,
            data: transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// POST /api/transactions/refresh - Force refresh cache
router.post('/refresh', async (req, res) => {
    try {
        const transactions = await getContractTransactions();
        transactionsCache = transactions;
        cacheTime = Date.now();

        res.json({
            success: true,
            message: 'Cache refreshed',
            count: transactions.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to refresh'
        });
    }
});

module.exports = router;
