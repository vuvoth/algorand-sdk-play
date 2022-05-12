const algosdk = require('algosdk');
const nacl = require('algosdk/dist/cjs/src/nacl/naclWrappers');

let client = null;
async function setupClient() {
    if (client == null) {
        const token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
        const server = "http://localhost";
        const port = 4001;
        let algodClient = new algosdk.Algodv2(token, server, port);
        client = algodClient;
    } else {
        return client;
    }
    return client;
}

// recover first account
// never use mnemonics in code, for demo purposes only
function recoverAccount1() {
    const passphrase = "occur universe apart crush song emerge cage genre rebel require foster home slight object fury effort reduce student roof midnight tragic hello accuse absent erupt";
    let myAccount = algosdk.mnemonicToSecretKey(passphrase);
    return myAccount;
}

let myAccountA = recoverAccount1();
console.log("My account A address: %s", myAccountA.addr)

async function main() {
    const algodClient = await setupClient();

    let params = await algodClient.getTransactionParams().do();

    let transaction1 = algosdk.makePaymentTxnWithSuggestedParams(myAccountA.addr, myAccountA.addr, 100000, undefined, undefined, params);


    const blob = transaction1.signTxn(myAccountA.sk);

    // console.log(transaction1.bytesToSign());

    const signedTransaction = algosdk.decodeSignedTransaction(blob);

    // console.log(transaction1.toByte());
    // console.log(Uint8Array.from(signedTransaction.txn.bytesToSign()));

    const pk = algosdk.decodeAddress(myAccountA.addr).publicKey;
    console.log(nacl.verify(Uint8Array.from(signedTransaction.txn.bytesToSign()), signedTransaction.sig, pk));
}

main();