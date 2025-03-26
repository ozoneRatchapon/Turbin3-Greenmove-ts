import { Transaction, SystemProgram, Connection, Keypair, LAMPORTS_PER_SOL, sendAndConfirmTransaction, PublicKey } from "@solana/web3.js";
import wallet from "./dev-wallet.json";

const from = Keypair.fromSecretKey(new Uint8Array(wallet));
const to = new PublicKey("AqdrF1bMEayzZC72R7SxsC2KFqybT5rHPYswkFWe5Mkn");
const connection = new Connection("https://api.devnet.solana.com");

(async () => {
  try {
    // const balance = await connection.getBalance(from.publicKey);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        // lamports: balance,
        lamports: LAMPORTS_PER_SOL / 100, // instruction 3) transfer 0.01 SOL
      })
    );

    transaction.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;
    transaction.feePayer = from.publicKey;

    // const fee = (await connection.getFeeForMessage(transaction.compileMessage(), 'confirmed')).value || 0;
    // transaction.instructions.pop();

    // transaction.add(
    //   SystemProgram.transfer({
    //     fromPubkey: from.publicKey,
    //     toPubkey: to,
    //     lamports: balance - fee,
    //   })
    // );

    // Sign transaction, broadcast, and confirm
    const signature = await sendAndConfirmTransaction(connection, transaction, [from]);
    console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    // Q22025 instruction 3) - https://explorer.solana.com/tx/5d2VCCitn6t7r4p5HaWFzV6GRUMPtRG4auEyqP2hcFRfsCG5MfQZsHwusYuPo6GzkTScGt9XaRnX19rgUUFeLzSG?cluster=devnet
     
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();