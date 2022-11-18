import { Card, Text } from "@rneui/base";
import { useEffect, useState } from "react";
import { StyleSheet,  } from 'react-native';
import { ethers } from 'ethers';

const INFURA_API_URL = 'https://eth-goerli.g.alchemy.com/v2/bRcj-i-w9MfyDJObmalXA817e1N58fWr'; 
const WALLET_ADDRESS = '0xf1509703333e0AB155F5d55ad773f93a91422B41';
const WALLET_PRIVATE_KEY = '6054ac87f700e3f3b680ed7ca8c0c6ffc0db90499f82e8869aabb525b4797fd6';

export default function userBalance(){
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
            let balance = await provider.getBalance('0xf1509703333e0AB155F5d55ad773f93a91422B41');

            setUserDetails(previousState => {
                return {...previousState, 'balance': ethers.utils.formatEther(balance),};
            });

            setBtnTransferAttrs(previousState => {
                return {...previousState, 'disabled': false};
            });
        }
        catch (error) {
            console.error(error);
        }
    };

    const transferTokens = async() => {
        try {
            setBtnTransferAttrs(previousState => {
                return {...previousState, 'text': 'Sending...', 'disabled': true};
            });
            let receivingAddress = document.getElementById('txtReceiverAddress').value;
            let tokensToSend = document.getElementById('txtAmount').value;
    
            if (receivingAddress && tokensToSend) {
                if (userDetails.balance >= tokensToSend) {
                    let wallet = new ethers.Wallet(WALLET_PRIVATE_KEY);
                    let walletSigner = wallet.connect(provider);
    
                    let transaction = {
                        to: receivingAddress,
                        value: ethers.utils.parseEther(tokensToSend),
                        gasPrice: ethers.utils.hexlify(await provider.getGasPrice()),
                        nonce: provider.getTransactionCount(WALLET_ADDRESS, 'latest'),
                    };
                    let response;

                    try {
                        response = await walletSigner.sendTransaction(transaction);
                    } catch(tfrErr) {
                        console.error(tfrErr);
                    }

                    if (response) {
                        if (response.hash) {
                            alert('Transaction is successful. Hash : ' + response.hash);
                        }
                    }
                    else{
                        alert('Transaction failed')
                        setBtnTransferAttrs(previousState => {
                            return {...previousState,'text': 'Send ETH', 'disabled': false};
                        });
                    }
                } else {
                    // invalid balance
                }
            } else {
                // receiving address and amount to send should not be empty
            }
        } catch(err) {
            console.error(err);
        }
    };

    useEffect(()=>{
        showData();
    }, []);

    return(
        <>
            <Card>
                <Text style={styles.container}>Address : { userDetails.address }</Text>
                <br />
                <Text style={styles.container}>Balance : { userDetails.balance } ETH</Text>
            </Card>
            <Card>
                <Text style={styles.container}><b>Transfer</b></Text>
                <br />
                <Text style={styles.container}>
                    <label>Receiving Address</label>
                    <br />
                    <input type="text" id="txtReceiverAddress" />
                </Text>
                <br />
                <Text style={styles.container}>
                    <label>Amount</label>
                    <br />
                    <input type="number" id="txtAmount" />
                </Text>
                <br />
                <button onClick={transferTokens} disabled={btnTransferAttrs.disabled}>{ btnTransferAttrs.text }</button>
            </Card>
        </>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      width:'450px',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });