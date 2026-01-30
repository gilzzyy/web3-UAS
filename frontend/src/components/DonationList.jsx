import React, { useState, useEffect } from 'react';
import { fetchDonationsFromContract, getSepoliaProvider } from '../services/blockchain';
import './DonationList.css';

const DonationList = ({ isConnected, isSepolia }) => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDonations();
    }, [isConnected, isSepolia]);

    const loadDonations = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch from blockchain (real data only)
            const provider = getSepoliaProvider();
            const data = await fetchDonationsFromContract(provider);
            setDonations(data);
        } catch (err) {
            console.error('Error loading donations:', err);
            setError('Gagal memuat data dari blockchain');
            setDonations([]);
        } finally {
            setLoading(false);
        }
    };

    // Format address for display
    const formatAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
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

    // Calculate total donations
    const totalDonations = donations.reduce((sum, d) => sum + parseFloat(d.amount), 0);

    if (loading) {
        return (
            <div className="donation-list">
                <div className="section-header">
                    <h2>🎁 Daftar Donasi (Smart Contract)</h2>
                </div>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Memuat data dari blockchain...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="donation-list">
            <div className="section-header">
                <h2>🎁 Daftar Donasi (Smart Contract)</h2>
                <div className="donation-stats">
                    <span className="stat-badge">
                        <span className="stat-value">{donations.length}</span>
                        <span className="stat-label">Donasi</span>
                    </span>
                    <span className="stat-badge total">
                        <span className="stat-value">{totalDonations.toFixed(4)}</span>
                        <span className="stat-label">ETH Total</span>
                    </span>
                </div>
            </div>

            {error && (
                <div className="error-notice">
                    <span className="notice-icon">⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            {!error && donations.length === 0 && (
                <div className="empty-notice">
                    <span className="notice-icon">📭</span>
                    <span>Belum ada donasi. Jadilah yang pertama berdonasi!</span>
                </div>
            )}

            <div className="donations-grid">
                {donations.map((donation) => (
                    <div key={donation.id} className="donation-card">
                        <div className="donation-header">
                            <div className="donor-avatar">
                                {donation.donor.slice(2, 4).toUpperCase()}
                            </div>
                            <div className="donor-info">
                                <span className="donor-address" title={donation.donor}>
                                    {formatAddress(donation.donor)}
                                </span>
                                <span className="donation-time">{formatDate(donation.timestamp)}</span>
                            </div>
                        </div>
                        <div className="donation-amount">
                            <span className="amount-value">{donation.amount}</span>
                            <span className="amount-unit">ETH</span>
                        </div>
                        {donation.message && (
                            <div className="donation-message">
                                <span className="message-icon">💬</span>
                                <p>{donation.message}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="blockchain-info">
                <div className="info-row">
                    <span className="info-label">Network:</span>
                    <span className="info-value">Sepolia Testnet</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Contract:</span>
                    <code className="contract-address">0x5B07360756Ebbc350e2E4c642a09E00942240212</code>
                </div>
            </div>
        </div>
    );
};

export default DonationList;
