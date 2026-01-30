import { ethers } from 'ethers';
import DonationABI from '../contracts/DonationABI.json';

// Sepolia Testnet contract address (deployed via Remix IDE)
const DONATION_CONTRACT_ADDRESS = '0xeab96354D6c8F851f5b1c3221F02AccEc350Ab51';

// Sepolia RPC URL (public)
const SEPOLIA_RPC_URL = 'https://eth-sepolia.g.alchemy.com/v2/3TpHx1dkA0m_tlTfEws3a';

// Get read-only provider for Sepolia
export const getSepoliaProvider = () => {
    return new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
};

// Get donation contract instance (read-only)
export const getDonationContract = (provider) => {
    return new ethers.Contract(DONATION_CONTRACT_ADDRESS, DonationABI, provider);
};

// Get donation contract with signer (for write operations)
export const getDonationContractWithSigner = async (browserProvider) => {
    const signer = await browserProvider.getSigner();
    return new ethers.Contract(DONATION_CONTRACT_ADDRESS, DonationABI, signer);
};

// Fetch all donations from the smart contract
export const fetchDonationsFromContract = async (provider) => {
    try {
        const contract = getDonationContract(provider);
        const donations = await contract.getDonations();

        // Format the donations data
        return donations.map((donation, index) => ({
            id: index + 1,
            donor: donation.donor,
            amount: ethers.formatEther(donation.amount),
            timestamp: new Date(Number(donation.timestamp) * 1000).toISOString(),
            message: donation.message,
        }));
    } catch (error) {
        console.error('Error fetching donations from contract:', error);
        // Return empty array - no dummy data
        return [];
    }
};

// Get donation count
export const getDonationCount = async (provider) => {
    try {
        const contract = getDonationContract(provider);
        const count = await contract.getDonationCount();
        return Number(count);
    } catch (error) {
        console.error('Error getting donation count:', error);
        return 0;
    }
};

// Make a donation (requires connected wallet)
export const makeDonation = async (browserProvider, amount, message) => {
    try {
        const contract = await getDonationContractWithSigner(browserProvider);
        const tx = await contract.donate(message, {
            value: ethers.parseEther(amount),
        });
        await tx.wait();
        return tx;
    } catch (error) {
        console.error('Error making donation:', error);
        throw error;
    }
};

// Dummy donations data for demo purposes
export const getDummyDonations = () => [
    {
        id: 1,
        donor: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD58',
        amount: '0.5',
        timestamp: '2026-01-29T08:00:00Z',
        message: 'Semoga bermanfaat! 🙏',
    },
    {
        id: 2,
        donor: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72',
        amount: '1.0',
        timestamp: '2026-01-29T09:30:00Z',
        message: 'Donasi untuk kebaikan',
    },
    {
        id: 3,
        donor: '0xdD870fA1b7C4700F2BD7f44238821C26f7392148',
        amount: '0.25',
        timestamp: '2026-01-29T10:15:00Z',
        message: 'Keep up the good work!',
    },
    {
        id: 4,
        donor: '0x583031D1113aD414F02576BD6afaBfb302140225',
        amount: '2.0',
        timestamp: '2026-01-29T11:45:00Z',
        message: 'Happy to help!',
    },
    {
        id: 5,
        donor: '0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB',
        amount: '0.15',
        timestamp: '2026-01-29T12:30:00Z',
        message: 'Small contribution, big heart ❤️',
    },
];
