import bs58 from 'bs58';
import prompt from 'prompt-sync';

// Function to convert a base58 private key (Phantom format) to a Solana wallet (byte array)
function base58ToWallet() {
  const input = prompt()("Enter your base58 private key: ");
  const wallet = bs58.decode(input);
  console.log(`Wallet (byte array): [${wallet}]`);
}

// Function to convert a Solana wallet (byte array) to a base58 private key (Phantom format)
function walletToBase58() {
  const input = prompt()("Enter your wallet byte array (comma-separated numbers): ");
  const wallet = input.split(',').map(Number);
  const base58 = bs58.encode(wallet);
  console.log(`Base58 Private Key: ${base58}`);
}

// Example usage
base58ToWallet();
// walletToBase58();