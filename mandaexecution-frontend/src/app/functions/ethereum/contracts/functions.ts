import { Signer, ethers } from "ethers";
import { provider } from "../ethereum";
import Mytoken from './abi/MyToken.json'

export async function getUserBalanceERC20(contractAddress:string, userAddress: string) {
    const contract = new ethers.Contract(contractAddress, Mytoken.abi,provider); 
    const balance = await contract.balanceOf(userAddress); 
    return balance; 
}

export async function approveVaultAsSpender(contractAddress:string, signer: Signer, vaultPublicKey:string) {
    const contract = new ethers.Contract(contractAddress, Mytoken.abi,signer); 
    const userAddress = await signer.getAddress(); 
    const balance = await getUserBalanceERC20(contractAddress, userAddress); 
    
    await contract.approve(vaultPublicKey,balance); 

}

export async function hasAllowance(contractAddress:string, userAddress:string,vaultPublicKey:string) {
    const contract = new ethers.Contract(contractAddress, Mytoken.abi,provider); 
    const allowance = await contract.allowance(userAddress,vaultPublicKey); 
    return Boolean(allowance); 
}


export async function proposeEmptyTransaction(contractAddress:string, from:string, to:string,amount:string, nonce:number) {
    const contract = new ethers.Contract(contractAddress, Mytoken.abi,provider); 
    const estimatedGasLimit = await contract.estimateGas.transferFrom(from,to,amount); // approves 1 USDT
    const approveTxUnsigned = await contract.populateTransaction.transferFrom(from,to,amount);
    approveTxUnsigned.chainId = (await provider.getNetwork()).chainId; // chainId 1 for Ethereum mainnet
    approveTxUnsigned.gasLimit = estimatedGasLimit;
    approveTxUnsigned.gasPrice = await provider.getGasPrice();
    approveTxUnsigned.nonce = nonce;

    return approveTxUnsigned; 
}