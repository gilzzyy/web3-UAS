# 🌐 Full Stack Web3 DApp - Aplikasi Donasi

<div align="center">

![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=Ethereum&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)

**Aplikasi Donasi Berbasis Blockchain Ethereum**

*UAS Pemrograman Web 3*

</div>

---

## 📌 Tentang Aplikasi

Aplikasi donasi terdesentralisasi (DApp) yang memungkinkan pengguna untuk:
- 🔗 Menghubungkan wallet MetaMask
- 💰 Melihat saldo ETH secara real-time
- 💝 Melakukan donasi langsung ke smart contract
- 📊 Melihat riwayat donasi dari blockchain

---

## 🚀 Panduan Lengkap (Dari Awal Sampai Akhir)

### Langkah 1: Persiapan Awal

**Pastikan sudah terinstall:**

| Software | Download | Keterangan |
|----------|----------|------------|
| Node.js | [nodejs.org](https://nodejs.org/) | Versi 18 atau lebih baru |
| MetaMask | [metamask.io](https://metamask.io/download/) | Extension browser |
| Git | [git-scm.com](https://git-scm.com/) | Untuk clone repository |

---

### Langkah 2: Clone & Install Proyek

**Buka terminal/command prompt, lalu jalankan:**

```bash
# Clone repository
git clone <URL_REPOSITORY>
cd pemweb3
```

---

### Langkah 3: Jalankan Backend

```bash
# Masuk folder backend
cd backend

# Install dependencies
npm install

# Jalankan server
npm start
```

✅ **Hasil:** Server berjalan di `http://localhost:3001`

---

### Langkah 4: Jalankan Frontend

**Buka terminal BARU (jangan tutup yang backend):**

```bash
# Masuk folder frontend
cd frontend

# Install dependencies
npm install

# Jalankan aplikasi
npm run dev
```

✅ **Hasil:** Aplikasi berjalan di `http://localhost:5173`

---

### Langkah 5: Setup MetaMask

1. **Install MetaMask** di browser (Chrome/Firefox)
2. **Buat wallet baru** atau import yang sudah ada
3. **Ganti network ke Sepolia Testnet:**
   - Klik dropdown network di MetaMask
   - Pilih "Show test networks"
   - Pilih "Sepolia"
4. **Dapatkan ETH gratis** dari faucet:
   - [sepoliafaucet.com](https://sepoliafaucet.com)
   - [alchemy.com/faucets](https://www.alchemy.com/faucets/ethereum-sepolia)

---

### Langkah 6: Deploy Smart Contract

**Buka [Remix IDE](https://remix.ethereum.org) di browser:**

1. Buat file baru: `Donation.sol`
2. Copy-paste kode dari `contracts/Donation.sol`
3. Klik tab **Solidity Compiler** → Compile
4. Klik tab **Deploy & Run** → Environment: "Injected Provider - MetaMask"
5. Klik **Deploy**
6. **Copy alamat contract** yang muncul
7. **Update alamat** di file `frontend/src/services/blockchain.js`:

```javascript
const DONATION_CONTRACT_ADDRESS = 'ALAMAT_CONTRACT_ANDA';
```

---

### Langkah 7: Gunakan Aplikasi

1. **Buka** `http://localhost:5173` di browser
2. **Klik "Connect Wallet"** untuk hubungkan MetaMask
3. **Isi form donasi:**
   - Masukkan jumlah ETH (contoh: 0.001)
   - Tulis pesan (opsional)
   - Klik "Donasi Sekarang"
4. **Konfirmasi transaksi** di MetaMask
5. **Lihat donasi** muncul di daftar setelah transaksi berhasil

---

## 📁 Struktur Proyek

```
pemweb3/
├── 📂 frontend/          # Aplikasi React
│   ├── src/
│   │   ├── components/   # Komponen UI
│   │   ├── services/     # API & Blockchain
│   │   ├── hooks/        # Custom React hooks
│   │   └── contracts/    # ABI smart contract
│   └── package.json
│
├── 📂 backend/           # Server Express.js
│   ├── routes/           # API endpoints
│   ├── services/         # Etherscan API
│   └── server.js
│
├── 📂 contracts/         # Smart Contract Solidity
│   └── Donation.sol
│
└── README.md
```

---

## 🛠️ Teknologi yang Digunakan

| Layer | Teknologi | Fungsi |
|-------|-----------|--------|
| **Frontend** | React.js + Vite | Antarmuka pengguna |
| **Backend** | Node.js + Express | REST API |
| **Blockchain** | Ethereum (Sepolia) | Penyimpanan terdesentralisasi |
| **Smart Contract** | Solidity | Logic donasi on-chain |
| **Web3 Library** | Ethers.js | Komunikasi dengan blockchain |
| **Wallet** | MetaMask | Autentikasi & transaksi |

---

## 📡 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/transactions` | Daftar transaksi dari blockchain |
| GET | `/api/transactions/balance` | Saldo contract |
| GET | `/api/health` | Status server |

---

## ✨ Fitur Aplikasi

| Fitur | Deskripsi |
|-------|-----------|
| 🦊 **Connect Wallet** | Hubungkan MetaMask dengan satu klik |
| 💰 **Lihat Saldo** | Tampilkan saldo ETH wallet |
| 💝 **Form Donasi** | Kirim ETH ke smart contract |
| 📋 **Riwayat Donasi** | Data real dari blockchain |
| 📊 **Transaksi Real** | Data dari Etherscan API |
| 📱 **Responsive** | Desktop & mobile friendly |

---

## 🔧 Troubleshooting

| Masalah | Solusi |
|---------|--------|
| MetaMask tidak muncul | Pastikan extension terinstall & enabled |
| Network error | Switch ke Sepolia Testnet |
| Saldo 0 ETH | Ambil ETH dari faucet |
| Transaksi gagal | Pastikan gas fee cukup |
| Backend error | Pastikan server berjalan di port 3001 |


