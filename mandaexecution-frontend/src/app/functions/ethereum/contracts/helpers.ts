import { BigNumber, Signer, ethers } from "ethers";
import { MORALIS_API_KEY, provider } from "../contants";
import ERC20 from './ERC20.json';
import { Asset } from "../../../type";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import { useSigner } from "@thirdweb-dev/react";

export async function getUserBalanceERC20(contractAddress:string, userAddress: string) {
    const erc20 = new ethers.Contract(contractAddress, ERC20.abi,provider); 
    const balance = await erc20.balanceOf(userAddress); 
    return balance; 
}

export async function getTokenSymbol(tokenAddress: string) {
    const erc20 = new ethers.Contract(tokenAddress, ERC20.abi, provider); 
    const symbol = await erc20.symbol();
    return symbol; 
}

export async function hasAllowance(contractAddress:string, userAddress:string,spender:string) {
    const contract = new ethers.Contract(contractAddress, ERC20.abi,provider); 
    const allowance:BigNumber = (await contract.allowance(userAddress,spender)); 
    return allowance.isZero() ? false : true; 
}


/**
 * transaction to allow the vault to spend token on behalf of user
 */
export async function allowVaultToSpend(vaultAddress:string, tokenAddress:string, amount:string, signer: Signer) {
    const erc20 = new ethers.Contract(tokenAddress, ERC20.abi, signer); 
    const tx = await erc20.approve(vaultAddress, amount); 
    await tx.wait(); 
}

export async function allowVaultToSpendMultiple(vaultAddress:string, tokenAddresses:string[],amounts:string[],signer:Signer) {
    for(let i = 0; i < tokenAddresses.length;i++) {
        await allowVaultToSpend(vaultAddress,tokenAddresses[i], amounts[i],signer); 
    }
}

export async function formTxRequest(
  from:string,
  to:string, 
  value:string,
  data:string, 
  gasLimit:string, 
) {

  const nonce = await provider.getTransactionCount(from, 'latest'); 

  const txRequest:ethers.providers.TransactionRequest = {
    to:to,
    from:from,
    nonce:nonce,
    data:data,
    value:BigNumber.from(value),
    gasLimit:BigNumber.from(gasLimit),
    maxFeePerGas:undefined,
    maxPriorityFeePerGas:undefined,
    chainId:provider._network.chainId,
    type:undefined, 
    accessList:undefined
  }

  return txRequest
}

export async function fundWallet(signer:ethers.Signer, address:string) {
  if(signer) {
    const tx = await formTxRequest(
      await signer.getAddress(),
      address,
      ethers.utils.parseUnits("0.05","ether").toString(),
      '0x',
      '63000'
    );
    const txReceipt = await signer.sendTransaction(tx); 
    await txReceipt.wait(); 
  }
}

export function createRandomWallet() {
  return ethers.Wallet.createRandom(provider).connect(provider); 
    
}

export async function createRandomWalletWithFunds(signer:ethers.Signer) {
  const wallet = ethers.Wallet.createRandom(provider).connect(provider); 
  await fundWallet(signer,wallet.address); 
  return wallet; 
    
}
/**
 * return all the erc20 held by a given address
 */
export async function scanWallet(address:string):Promise<Asset[]> {
    const chain = EvmChain.SEPOLIA;

    const response = await Moralis.EvmApi.token.getWalletTokenBalances({address,chain});

    let jsonResponse = response.toJSON(); 
    
    let assets: Asset[] = []; 

    jsonResponse.map(el => {
        assets.push({address: el.token_address, symbol: el.symbol, amount:el.balance.substring(0,el.balance.length-el.decimals)})
    })

    return assets; 
};

