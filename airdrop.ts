// Instructions: 
// 1) Run this script to request an airdrop of 2 SOL to your dev wallet.

import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import wallet from "./dev-wallet.json";

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const connection = new Connection("https://api.devnet.solana.com");

(async () => {
  try {
    const txhash = await connection.requestAirdrop(keypair.publicKey, 2 * LAMPORTS_PER_SOL);
    console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    // Q22025 - https://explorer.solana.com/tx/2LyzzE9mYs2snF1cxxofKSphhnVYofmLd519Z5boexGhZb5A5e2w9TqLNPPg5NRrmDMGsN2iXKUzAAACgx4BwxK9?cluster=devnet
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();