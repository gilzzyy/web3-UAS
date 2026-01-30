import React from 'react';
import { useWallet } from './hooks/useWallet';
import WalletConnect from './components/WalletConnect';
import WalletBalance from './components/WalletBalance';
import TransactionList from './components/TransactionList';
import DonationForm from './components/DonationForm';
import DonationList from './components/DonationList';
import './App.css';

function App() {
  const {
    account,
    balance,
    chainId,
    isConnecting,
    isConnected,
    isMetaMaskInstalled,
    isSepolia,
    error,
    connect,
    disconnect,
    switchToSepolia,
  } = useWallet();

  return (
    <div className="app">
      {/* Background Effects */}
      <div className="bg-gradient"></div>
      <div className="bg-grid"></div>

      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <span className="logo-icon">⟠</span>
            <h1>Web3 DApp</h1>
          </div>
          <div className="header-info">
            <span className="network-info">Sepolia Testnet</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        <div className="container">
          {/* Hero Section */}
          <section className="hero">
            <h2>Full Stack Web3 Application</h2>
            <p>
              Aplikasi demo yang mengintegrasikan React.js, Node.js/Express, dan Ethereum Blockchain.
              Hubungkan wallet MetaMask Anda untuk melihat saldo dan berinteraksi dengan smart contract.
            </p>
          </section>

          {/* Wallet Section */}
          <section className="wallet-section">
            <div className="section-card">
              <h3>🦊 Koneksi Wallet</h3>
              <WalletConnect
                account={account}
                isConnecting={isConnecting}
                isConnected={isConnected}
                isMetaMaskInstalled={isMetaMaskInstalled}
                isSepolia={isSepolia}
                error={error}
                onConnect={connect}
                onDisconnect={disconnect}
                onSwitchToSepolia={switchToSepolia}
              />
              <WalletBalance balance={balance} isConnected={isConnected} />
            </div>
          </section>

          {/* Transaction List - From Backend API */}
          <section className="transactions-section">
            <TransactionList />
          </section>

          {/* Donation Form - Make a Donation */}
          <section className="donation-form-section">
            <DonationForm
              isConnected={isConnected}
              isSepolia={isSepolia}
            />
          </section>

          {/* Donation List - From Smart Contract */}
          <section className="donations-section">
            <DonationList isConnected={isConnected} isSepolia={isSepolia} />
          </section>

          {/* Info Cards */}
          <section className="info-section">
            <div className="info-grid">
              <div className="info-card">
                <div className="info-icon">⚛️</div>
                <h4>React.js Frontend</h4>
                <p>Komponen modern dengan hooks untuk manajemen state dan integrasi blockchain.</p>
              </div>
              <div className="info-card">
                <div className="info-icon">🔧</div>
                <h4>Express.js Backend</h4>
                <p>RESTful API yang menyediakan data transaksi dalam format JSON.</p>
              </div>
              <div className="info-card">
                <div className="info-icon">⛓️</div>
                <h4>Ethereum Blockchain</h4>
                <p>Integrasi dengan Sepolia testnet menggunakan Ethers.js.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>UAS Pemrograman Web 3 - Full Stack Web3 Application</p>
          <div className="tech-stack">
            <span>React.js</span>
            <span>•</span>
            <span>Node.js</span>
            <span>•</span>
            <span>Express.js</span>
            <span>•</span>
            <span>Ethers.js</span>
            <span>•</span>
            <span>Solidity</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
