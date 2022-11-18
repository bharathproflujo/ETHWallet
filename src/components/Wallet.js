import { Text } from "@rneui/base";
import { useEffect, useState } from "react";
import { StyleSheet, TextInput, } from 'react-native';
import { ethers } from 'ethers';

const INFURA_API_URL = 'https://eth-goerli.g.alchemy.com/v2/bRcj-i-w9MfyDJObmalXA817e1N58fWr'; // Decalaring node API
const WALLET_ADDRESS = '0xf1509703333e0AB155F5d55ad773f93a91422B41'; // Decalaring Wallet address
const WALLET_PRIVATE_KEY = '6054ac87f700e3f3b680ed7ca8c0c6ffc0db90499f82e8869aabb525b4797fd6'; // Decalaring wallet's private key

export default function userBalance() {

    // storing the value we got by passing JSON RPC Provider
    const provider = new ethers.providers.JsonRpcProvider(INFURA_API_URL);

    const [btnTransferAttrs, setBtnTransferAttrs] = useState({
        'text': 'Send ETH',
        'disabled': true
    });

    const [userDetails, setUserDetails] = useState({
        'address': WALLET_ADDRESS,
        'balance': '0.0'
    });

    const showData = async () => {
        try {

            // storing balance using provider
            let balance = await provider.getBalance('0xf1509703333e0AB155F5d55ad773f93a91422B41');

            setUserDetails(previousState => {
                return { ...previousState, 'balance': ethers.utils.formatEther(balance), };
            });

            setBtnTransferAttrs(previousState => {
                return { ...previousState, 'disabled': false };
            });
        }
        catch (error) {
            console.error(error);
        }
    };

    const transferTokens = async () => {
        try {
            setBtnTransferAttrs(previousState => {
                return { ...previousState, 'text': 'Sending...', 'disabled': true };
            });

            // storing receiver address
            let receivingAddress = document.getElementById('txtReceiverAddress').value;

            // storing transaction amount
            let tokensToSend = document.getElementById('txtAmount').value;

            // checking if the receiver address and transaction amount are empty
            if (receivingAddress && tokensToSend) {

                // checking if the sender have enough balance
                if (userDetails.balance >= tokensToSend) {

                    // passing private as parameter in Wallet()
                    let wallet = new ethers.Wallet(WALLET_PRIVATE_KEY);

                    // assigning signer for safe transaction using connect()
                    let walletSigner = wallet.connect(provider);

                    // declaring the transaction parameters
                    let transaction = {
                        to: receivingAddress,
                        value: ethers.utils.parseEther(tokensToSend),
                        gasPrice: ethers.utils.hexlify(await provider.getGasPrice()),
                        nonce: provider.getTransactionCount(WALLET_ADDRESS, 'latest'),
                    };

                    let response;

                    try {
                        // passing transaction as a parameter in sendTransaction()
                        response = await walletSigner.sendTransaction(transaction);

                    }
                    catch (transferErr) {
                        console.error(transferErr);
                    }

                    if (response) {
                        // returning the response if the transaction is successful
                        if (response.hash) {
                            alert('Transaction is successful. Hash : ' + response.hash);
                            document.getElementById('txtReceiverAddress').value = '';
                            document.getElementById('txtAmount').value = '';
                        }
                    }
                    else {
                        // returing a alert if transaction failed
                        alert('Transaction failed')
                    }
                } else {
                    alert('insufficient balance')
                }
            } else {
                alert('Receiving address and transaction amount should not be empty')
            }
        } catch (err) {
            console.error(err);
        }
        setBtnTransferAttrs(previousState => {
            return { ...previousState, 'text': 'Send ETH', 'disabled': false };
        });
    };

    // calling showData() inside useEffect() to avoid re-renders
    useEffect(() => {
        showData();
    }, []);

    return (
        <>
            <div style={styles.card}>
                <Text style={styles.cardText}><b>Address : </b>{userDetails.address}</Text>
                <br />
                <Text style={styles.cardText}><b>Balance : </b>{userDetails.balance} ETH</Text>
            </div>
            <form style={styles.form}>
                <div style={styles.formContent}>
                    <div style={styles.formTitle}>
                        <Text style={styles.title}><b>Transfer</b></Text>
                    </div>
                    <Text style={styles.text}>
                        Receiving Address
                        <br />
                        <input style={styles.TextInput} type="text" id="txtReceiverAddress" />
                    </Text>
                    <br />
                    <Text style={styles.text}>
                        Amount
                        <br />
                        <input style={styles.TextInput} type="number" id="txtAmount" />
                    </Text>
                    <br />
                    <button style={styles.button} onClick={transferTokens} disabled={btnTransferAttrs.disabled}>{btnTransferAttrs.text}</button>
                </div >
            </form>
        </>
    )
}


// Styling the components

const styles = StyleSheet.create({

    card: {
        width: '500px',
        height: '200px',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0))',
        backdropFilter: "blur(10px)",
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: '10px',
        marginTop: '10px'
    },
    cardText: {
        paddingLeft: 5,
        marginLeft: 10,
        color: '#fff',
        fontSize: '16px'
    },

    form: {
        width: '500px',
        height: '300px',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0))',
        backdropFilter: "blur(10px)",
        justifyContent: 'center',
        borderRadius: '10px',
        marginTop: '10px',
    },
    formContent: {
        flexDirection: 'column',
        display: 'flex',
        marginTop: '10px',
    },

    text: {
        color: '#fff',
        fontSize: '16px'
    },
    TextInput: {
        width: '350px',
        height: '40px',
        color: '#fff',
        borderRadius: '6px',
        fontSize: '16px',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderColor: '#cdcdcd5c',

    },
    formTitle: {
        flexDirection: 'column',
        display: 'flex',
        marginTop: '10px',
    },

    title: {
        fontSize: '16px',
        color: '#fff',
        marginBottom: '10%',
        marginLeft: '40%'
    },

    button: {
        fontSize: '16px',
        width: '150px',
        borderRadius: '6px',
        height: '35px',
        alignSelf: 'center',
        backgroundColor: '#ffffffad',
        p: 5,
        color: 'rgba(0,0,0,0.5)'
    }
});