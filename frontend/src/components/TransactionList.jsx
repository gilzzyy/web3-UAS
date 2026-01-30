import React, { useState, useEffect } from 'react';
import { fetchTransactions } from '../services/api';
import './TransactionList.css';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchTransactions();
            if (response.success) {
                setTransactions(response.data);
            }
        } catch (err) {
            setError('Gagal memuat data transaksi. Pastikan backend server berjalan.');
            console.error('Error loading transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    // Format address for display
    const formatAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    // Format hash for display
    const formatHash = (hash) => {
        if (!hash) return '';
        return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
    };

    // Format date
    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="transaction-list">
                <div className="section-header">
                    <h2>📜 Daftar Transaksi (Backend API)</h2>
                </div>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Memuat transaksi...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="transaction-list">
                <div className="section-header">
                    <h2>📜 Daftar Transaksi (Backend API)</h2>
                </div>
                <div className="error-container">
                    <span className="error-icon">⚠️</span>
                    <p>{error}</p>
                    <button className="retry-btn" onClick={loadTransactions}>
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="transaction-list">
            <div className="section-header">
                <h2>📜 Daftar Transaksi (Backend API)</h2>
                <span className="transaction-count">{transactions.length} transaksi</span>
            </div>

            <div className="table-container">
                <table className="transaction-table">
                    <thead>
                        <tr>
                            <th>Hash</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Value</th>
                            <th>Status</th>
                            <th>Waktu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => (
                            <tr key={tx.id}>
                                <td>
                                    <span className="hash" title={tx.hash}>
                                        {formatHash(tx.hash)}
                                    </span>
                                </td>
                                <td>
                                    <span className="address" title={tx.from}>
                                        {formatAddress(tx.from)}
                                    </span>
                                </td>
                                <td>
                                    <span className="address" title={tx.to}>
                                        {formatAddress(tx.to)}
                                    </span>
                                </td>
                                <td>
                                    <span className="value">{tx.value} ETH</span>
                                </td>
                                <td>
                                    <span className={`status ${tx.status}`}>
                                        {tx.status === 'success' ? '✅' : '⏳'} {tx.status}
                                    </span>
                                </td>
                                <td>
                                    <span className="timestamp">{formatDate(tx.timestamp)}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="api-info">
                <code>📡 Real data dari Etherscan Sepolia API</code>
            </div>
        </div>
    );
};

export default TransactionList;
