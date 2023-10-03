import { BigNumber, Signer, ethers } from "ethers";
import { provider } from "../ethereum";
import ERC20ABI from '../contracts/abi/ERC20.json';
import SwapContractFactoryABI from '../contracts/abi/SwapContractFactory.json' 
import { SWAP_CONTRACT_ADDRESS } from "../../constants";

export async function getUserBalanceERC20(contractAddress:string, userAddress: string) {
    const erc20 = new ethers.Contract(contractAddress, ERC20ABI,provider); 
    const balance = await erc20.balanceOf(userAddress); 
    return balance; 
}

export async function getTokenSymbol(tokenAddress: string) {
    const erc20 = new ethers.Contract(tokenAddress, ERC20ABI, provider); 
    const symbol = await erc20.symbol();
    return symbol; 
}

export async function hasAllowance(contractAddress:string, userAddress:string,vaultPublicKey:string) {
    const contract = new ethers.Contract(contractAddress, ERC20ABI,provider); 
    const allowance:BigNumber = (await contract.allowance(userAddress,vaultPublicKey)); 
    return allowance.isZero() ? false : true; 
}


/**
 * transaction to allow the vault to spend token on behalf of the participant
 */
export async function allowVaultToSpend(vaultAddress:string, tokenAddress:string, amount:string, signer: Signer) {
    const erc20 = new ethers.Contract(tokenAddress, ERC20ABI, signer); 
    const tx = await erc20.approve(vaultAddress, amount); 
    tx.wait(); 
}


export async function buildEmptySwapTransaction(participants:string[],numeraires:string[], nonce:number) {
    const SwapContractFactoryInterface = new ethers.utils.Interface(SwapContractFactoryABI); 
    const data = SwapContractFactoryInterface.encodeFunctionData('swapAssets',[numeraires[0], numeraires[1],participants[0],participants[1]])
    console.log(data); 
    return data;
}