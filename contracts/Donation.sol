// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Donation
 * @dev Smart contract untuk menerima dan mencatat donasi
 * @notice Deploy contract ini di Sepolia testnet menggunakan Remix IDE
 * 
 * Cara Deploy:
 * 1. Buka https://remix.ethereum.org
 * 2. Buat file baru dengan nama Donation.sol
 * 3. Copy paste code ini
 * 4. Compile dengan Solidity compiler 0.8.19+
 * 5. Deploy ke Sepolia testnet (pastikan MetaMask terhubung ke Sepolia)
 * 6. Salin contract address dan update di frontend/src/services/blockchain.js
 */

contract Donation {
    // Struct untuk menyimpan data donasi
    struct DonationRecord {
        address donor;      // Alamat wallet donatur
        uint256 amount;     // Jumlah donasi dalam wei
        uint256 timestamp;  // Waktu donasi
        string message;     // Pesan dari donatur
    }
    
    // Array untuk menyimpan semua donasi
    DonationRecord[] public donations;
    
    // Total donasi yang diterima
    uint256 public totalDonations;
    
    // Owner contract
    address public owner;
    
    // Event yang dipancarkan saat ada donasi
    event DonationReceived(
        address indexed donor, 
        uint256 amount, 
        string message,
        uint256 timestamp
    );
    
    // Event untuk penarikan dana
    event FundsWithdrawn(address indexed to, uint256 amount);
    
    // Modifier untuk fungsi yang hanya bisa diakses owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Fungsi untuk menerima donasi
     * @param _message Pesan dari donatur
     */
    function donate(string memory _message) public payable {
        require(msg.value > 0, "Donation amount must be greater than 0");
        
        donations.push(DonationRecord({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            message: _message
        }));
        
        totalDonations += msg.value;
        
        emit DonationReceived(msg.sender, msg.value, _message, block.timestamp);
    }
    
    /**
     * @dev Mendapatkan semua donasi
     * @return Array dari semua DonationRecord
     */
    function getDonations() public view returns (DonationRecord[] memory) {
        return donations;
    }
    
    /**
     * @dev Mendapatkan jumlah donasi
     * @return Jumlah total donasi yang diterima
     */
    function getDonationCount() public view returns (uint256) {
        return donations.length;
    }
    
    /**
     * @dev Mendapatkan donasi berdasarkan index
     * @param _index Index donasi
     * @return DonationRecord pada index tersebut
     */
    function getDonation(uint256 _index) public view returns (DonationRecord memory) {
        require(_index < donations.length, "Index out of bounds");
        return donations[_index];
    }
    
    /**
     * @dev Mendapatkan saldo contract
     * @return Saldo dalam wei
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Menarik dana dari contract (hanya owner)
     * @param _to Alamat tujuan
     * @param _amount Jumlah yang akan ditarik
     */
    function withdraw(address payable _to, uint256 _amount) public onlyOwner {
        require(_amount <= address(this).balance, "Insufficient balance");
        
        _to.transfer(_amount);
        
        emit FundsWithdrawn(_to, _amount);
    }
    
    /**
     * @dev Menarik semua dana dari contract (hanya owner)
     */
    function withdrawAll() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        payable(owner).transfer(balance);
        
        emit FundsWithdrawn(owner, balance);
    }
    
    // Receive function untuk menerima ETH langsung
    receive() external payable {
        donations.push(DonationRecord({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            message: "Direct transfer"
        }));
        
        totalDonations += msg.value;
        
        emit DonationReceived(msg.sender, msg.value, "Direct transfer", block.timestamp);
    }
}
