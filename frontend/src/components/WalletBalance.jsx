import React from 'react';
import './WalletBalance.css';

const WalletBalance = ({ balance, isConnected }) => {
    if (!isConnected) {
        return null;
    }

    // Format balance to display
    const formatBalance = (bal) => {
        if (!bal) return '0.0000';
        const num = parseFloat(bal);
        return num.toFixed(4);
    };

    return (
        <div className="wallet-balance">
            <div className="balance-card">
                <div className="balance-header">
                    <span className="balance-icon">💰</span>
                    <span className="balance-label">Saldo Wallet</span>
                </div>
                <div className="balance-content">
                    <span className="balance-value">{formatBalance(balance)}</span>
                    <span className="balance-unit">ETH</span>
                </div>
                <div className="balance-footer">
                    <span className="network-label">Sepolia Testnet</span>
                </div>
            </div>
        </div>
    );
};

export default WalletBalance;
