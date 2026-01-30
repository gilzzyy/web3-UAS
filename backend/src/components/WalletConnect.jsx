import React from 'react';
import './WalletConnect.css';

const WalletConnect = ({
    account,
    isConnecting,
    isConnected,
    isMetaMaskInstalled,
    isSepolia,
    error,
    onConnect,
    onDisconnect,
    onSwitchToSepolia
}) => {
    // Format address for display
    const formatAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    if (!isMetaMaskInstalled) {
        return (
            <div className="wallet-connect">
                <div className="wallet-warning">
                    <span className="warning-icon">⚠️</span>
                    <p>MetaMask tidak terdeteksi</p>
                    <a
                        href="https://metamask.io/download/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="install-btn"
                    >
                        Install MetaMask
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="wallet-connect">
            {error && (
                <div className="wallet-error">
                    <span className="error-icon">❌</span>
                    <p>{error}</p>
                </div>
            )}

            {isConnected ? (
                <div className="wallet-connected">
                    <div className="wallet-info">
                        <div className="wallet-address">
                            <span className="address-label">Connected:</span>
                            <span className="address-value">{formatAddress(account)}</span>
                            <button
                                className="copy-btn"
                                onClick={() => navigator.clipboard.writeText(account)}
                                title="Copy address"
                            >
                                📋
                            </button>
                        </div>

                        {!isSepolia && (
                            <div className="network-warning">
                                <span className="warning-icon">⚠️</span>
                                <span>Wrong network!</span>
                                <button
                                    className="switch-network-btn"
                                    onClick={onSwitchToSepolia}
                                >
                                    Switch to Sepolia
                                </button>
                            </div>
                        )}

                        {isSepolia && (
                            <div className="network-badge sepolia">
                                <span className="network-dot"></span>
                                Sepolia Testnet
                            </div>
                        )}
                    </div>

                    <button
                        className="disconnect-btn"
                        onClick={onDisconnect}
                    >
                        Disconnect
                    </button>
                </div>
            ) : (
                <button
                    className="connect-btn"
                    onClick={onConnect}
                    disabled={isConnecting}
                >
                    {isConnecting ? (
                        <>
                            <span className="spinner"></span>
                            Connecting...
                        </>
                    ) : (
                        <>
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                                alt="MetaMask"
                                className="metamask-icon"
                            />
                            Connect MetaMask
                        </>
                    )}
                </button>
            )}
        </div>
    );
};

export default WalletConnect;
