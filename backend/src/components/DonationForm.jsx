import React, { useState } from 'react';
import { ethers } from 'ethers';
import { makeDonation } from '../services/blockchain';
import './DonationForm.css';

const DonationForm = ({ isConnected, isSepolia, onDonationSuccess }) => {
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isConnected) {
            setError('Harap koneksikan wallet terlebih dahulu');
            return;
        }

        if (!isSepolia) {
            setError('Harap switch ke jaringan Sepolia');
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            setError('Masukkan jumlah donasi yang valid');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const tx = await makeDonation(provider, amount, message || 'Donasi tanpa pesan');

            setSuccess(`Donasi berhasil! TX Hash: ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}`);
            setAmount('');
            setMessage('');

            // Callback to refresh donation list
            if (onDonationSuccess) {
                onDonationSuccess();
            }
        } catch (err) {
            console.error('Donation error:', err);
            if (err.code === 'ACTION_REJECTED') {
                setError('Transaksi dibatalkan oleh user');
            } else if (err.message.includes('insufficient funds')) {
                setError('Saldo ETH tidak mencukupi');
            } else {
                setError('Gagal melakukan donasi. Silakan coba lagi.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const quickAmounts = ['0.001', '0.005', '0.01', '0.05'];

    return (
        <div className="donation-form">
            <div className="form-header">
                <h2>💝 Berdonasi</h2>
                <p>Dukung dengan mengirimkan ETH ke smart contract</p>
            </div>

            {!isConnected && (
                <div className="warning-notice">
                    <span className="notice-icon">⚠️</span>
                    <span>Hubungkan wallet MetaMask untuk berdonasi</span>
                </div>
            )}

            {isConnected && !isSepolia && (
                <div className="warning-notice">
                    <span className="notice-icon">🔗</span>
                    <span>Switch ke jaringan Sepolia untuk berdonasi</span>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="amount">Jumlah (ETH)</label>
                    <div className="amount-input-wrapper">
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.01"
                            step="0.001"
                            min="0.0001"
                            disabled={!isConnected || !isSepolia || isLoading}
                        />
                        <span className="currency-label">ETH</span>
                    </div>
                    <div className="quick-amounts">
                        {quickAmounts.map((amt) => (
                            <button
                                key={amt}
                                type="button"
                                className={`quick-btn ${amount === amt ? 'active' : ''}`}
                                onClick={() => setAmount(amt)}
                                disabled={!isConnected || !isSepolia || isLoading}
                            >
                                {amt} ETH
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="message">Pesan (opsional)</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tulis pesan untuk penerima donasi..."
                        rows="3"
                        maxLength="200"
                        disabled={!isConnected || !isSepolia || isLoading}
                    />
                    <span className="char-count">{message.length}/200</span>
                </div>

                {error && (
                    <div className="error-message">
                        <span>❌</span> {error}
                    </div>
                )}

                {success && (
                    <div className="success-message">
                        <span>✅</span> {success}
                    </div>
                )}

                <button
                    type="submit"
                    className="donate-btn"
                    disabled={!isConnected || !isSepolia || isLoading || !amount}
                >
                    {isLoading ? (
                        <>
                            <span className="btn-spinner"></span>
                            Memproses...
                        </>
                    ) : (
                        <>
                            💝 Donasi Sekarang
                        </>
                    )}
                </button>
            </form>

            <div className="form-info">
                <p>📋 Donasi akan disimpan di blockchain Sepolia secara permanen</p>
            </div>
        </div>
    );
};

export default DonationForm;
