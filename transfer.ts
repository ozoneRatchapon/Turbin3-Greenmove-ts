/* Instructions: 
3) Transfer 0.01 SOL from Dev wallet to Turbin3 Address on the Devnet
4) Transfer all SOL from Dev wallet to Turbin3 Address on the Devnet
*/

import { Transaction, SystemProgram, Connection, Keypair, LAMPORTS_PER_SOL, sendAndConfirmTransaction, PublicKey } from "@solana/web3.js";
import wallet from "./dev-wallet.json";

const from = Keypair.fromSecretKey(new Uint8Array(wallet));
const to = new PublicKey("AqdrF1bMEayzZC72R7SxsC2KFqybT5rHPYswkFWe5Mkn");
const connection = new Connection("https://api.devnet.solana.com");

(async () => {
  try {
    // 4.1) Get balance of dev wallet
    const balance = await connection.getBalance(from.publicKey);

    // Create a test transaction to calculate fees
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        // lamports: LAMPORTS_PER_SOL / 100, // 3.1) transfer 0.01 SOL
        lamports: balance, // 4.2) transfer all SOL
      })
    );

    transaction.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;
    transaction.feePayer = from.publicKey;

    // 4.3) Calculate exact fee rate to transfer entire SOL amount out of account minus fees
    const fee = (await connection.getFeeForMessage(transaction.compileMessage(), 'confirmed')).value || 0;
    // 4.4) Remove our transfer instruction to replace it
    transaction.instructions.pop();

    // 4.5) Now add the instruction back with correct amount of lamports
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance - fee,
      })
    );

    // Sign transaction, broadcast, and confirm
    const signature = await sendAndConfirmTransaction(connection, transaction, [from]);
    console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    // Q22025 instruction 3) - https://explorer.solana.com/tx/5d2VCCitn6t7r4p5HaWFzV6GRUMPtRG4auEyqP2hcFRfsCG5MfQZsHwusYuPo6GzkTScGt9XaRnX19rgUUFeLzSG?cluster=devnet
    // Q22025 instruction 4) - https://explorer.solana.com/tx/2Kmn7Cuj8rZWAgJ3EeEMi9Br2tXK17NJcGPLp2bV871HNywFi5CjPs9H5jpZA89Ud6y9NzHQckseMkrkkABFNTn4?cluster=devnet

  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();