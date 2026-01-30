import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

export const useWallet = () => {
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);
    const [chainId, setChainId] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState(null);
    const [provider, setProvider] = useState(null);

    // Check if MetaMask is installed
    const isMetaMaskInstalled = typeof window !== 'undefined' && window.ethereum;

    // Sepolia Chain ID
    const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hex

    // Get balance for an account
    const fetchBalance = useCallback(async (address, providerInstance) => {
        try {
            const bal = await providerInstance.getBalance(address);
            setBalance(ethers.formatEther(bal));
        } catch (err) {
            console.error('Error fetching balance:', err);
        }
    }, []);

    // Connect to MetaMask
    const connect = useCallback(async () => {
        if (!isMetaMaskInstalled) {
            setError('MetaMask tidak terinstall. Silakan install MetaMask terlebih dahulu.');
            return;
        }

        setIsConnecting(true);
        setError(null);

        try {
            const browserProvider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await browserProvider.send('eth_requestAccounts', []);

            if (accounts.length > 0) {
                const network = await browserProvider.getNetwork();
                setAccount(accounts[0]);
                setChainId(network.chainId.toString());
                setProvider(browserProvider);
                await fetchBalance(accounts[0], browserProvider);
            }
        } catch (err) {
            console.error('Error connecting to MetaMask:', err);
            setError(err.message || 'Gagal terhubung ke MetaMask');
        } finally {
            setIsConnecting(false);
        }
    }, [isMetaMaskInstalled, fetchBalance]);

    // Disconnect wallet
    const disconnect = useCallback(() => {
        setAccount(null);
        setBalance(null);
        setChainId(null);
        setProvider(null);
        setError(null);
    }, []);

    // Switch to Sepolia network
    const switchToSepolia = useCallback(async () => {
        if (!isMetaMaskInstalled) return;

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: SEPOLIA_CHAIN_ID }],
            });
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: SEPOLIA_CHAIN_ID,
                                chainName: 'Sepolia Testnet',
                                nativeCurrency: {
                                    name: 'Sepolia ETH',
                                    symbol: 'SepoliaETH',
                                    decimals: 18,
                                },
                                rpcUrls: ['https://sepolia.infura.io/v3/'],
                                blockExplorerUrls: ['https://sepolia.etherscan.io'],
                            },
                        ],
                    });
                } catch (addError) {
                    console.error('Error adding Sepolia network:', addError);
                }
            }
            console.error('Error switching to Sepolia:', switchError);
        }
    }, [isMetaMaskInstalled]);

    // Handle account changes
    useEffect(() => {
        if (!isMetaMaskInstalled) return;

        const handleAccountsChanged = async (accounts) => {
            if (accounts.length === 0) {
                disconnect();
            } else if (accounts[0] !== account) {
                setAccount(accounts[0]);
                if (provider) {
                    await fetchBalance(accounts[0], provider);
                }
            }
        };

        const handleChainChanged = (chainId) => {
            setChainId(parseInt(chainId, 16).toString());
            // Reload the page on chain change as recommended by MetaMask
            window.location.reload();
        };

        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

        return () => {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener('chainChanged', handleChainChanged);
        };
    }, [isMetaMaskInstalled, account, provider, disconnect, fetchBalance]);

    // Check if already connected on mount
    useEffect(() => {
        const checkConnection = async () => {
            if (!isMetaMaskInstalled) return;

            try {
                const browserProvider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await browserProvider.listAccounts();

                if (accounts.length > 0) {
                    const network = await browserProvider.getNetwork();
                    setAccount(accounts[0].address);
                    setChainId(network.chainId.toString());
                    setProvider(browserProvider);
                    await fetchBalance(accounts[0].address, browserProvider);
                }
            } catch (err) {
                console.error('Error checking connection:', err);
            }
        };

        checkConnection();
    }, [isMetaMaskInstalled, fetchBalance]);

    return {
        account,
        balance,
        chainId,
        isConnecting,
        isConnected: !!account,
        isMetaMaskInstalled,
        isSepolia: chainId === '11155111',
        error,
        provider,
        connect,
        disconnect,
        switchToSepolia,
    };
};
