import { createRandomWallet, createRandomWalletWithFunds, fundWallet } from "../ethereum/contracts/helpers"
import { combineSignatures, completeVaultRegistration, getUserVaults, instantiateVault, postTransaction, preRegisterUser, registerUser, signTransaction } from "./intu";
import { getVaultMPK } from "intu-sdk/lib/src/services/web3";
import { MANAGER_CONTRACT_ADDRESS, MASTER_KEY, provider } from "../ethereum/contants";
import { VaultWithKeys } from "@/app/type";
import { ethers } from "ethers";
import { getBackupVaultAddress, getKeyFragment } from "../ethereum/contracts/functions";
import ManagerJSON from '../ethereum/contracts/Manager.json'
import { Vault } from "intu-sdk/lib/src/models/models";
/**
 * script to create a vault with three signers
 */
export async function createVaultScript(signer: ethers.Signer):Promise<VaultWithKeys> {
    // create random wallets
    const keys = [createRandomWallet(),createRandomWallet(),createRandomWallet()];
    console.log(keys);
    //random valt name
    const name = `vault-${10000*Math.random()}`;
    // instantiate the vault
    await instantiateVault(signer,keys.map(wallet => wallet.address),name)
    // get the vault
    const vaults = await getUserVaults(keys[0].address); 
    const vault = vaults.find(v => v.name === name); 

    console.log(vault); 
    // pre-regiser everyone
    for(let owner of keys) {
        await fundWallet(signer,owner.address); 
        await preRegisterUser(vault!.vaultAddress,owner);
    }
    console.log('preregistration done')
    // register all keys for step 1
    for(let owner of keys) {
        await registerUser(vault!.vaultAddress,owner,1)
    }
    console.log('step 1 done')
    // register all keys for step 2
    for(let owner of keys) {
        await registerUser(vault!.vaultAddress,owner,2)
    }
    console.log('step 2 done')
    // register all keys for step 3
    for(let owner of keys) {
        await registerUser(vault!.vaultAddress,owner,3)
    }
    console.log('step 3 done');
    // complete vault
    await completeVaultRegistration(vault!.vaultAddress, keys[0]); 
    console.log('complete done');
    // get the vault MPK
    const vaultMPK = await getVaultMPK(vault!.vaultAddress,provider); 

    console.log(keys); 
    // return values to save in the manager contract
    return {vaultMPK:vaultMPK, keys:keys}
}

/**
 *
 * @param keys 
 * @param ownerAddress 
 */
export async function executePlan(keys:string[], ownerAddress:string) {

    // get the vault addrss
    const vaultAddress = await getBackupVaultAddress(ownerAddress); 
    console.log('vault address:'+vaultAddress); 
    // get the key fragment from the smart contract 
    const smartContractKey = await getKeyFragment(vaultAddress);
    console.log('last key:'+smartContractKey)
    // get wallets
    const walletSigners = [new ethers.Wallet(keys[0]),new ethers.Wallet(keys[1]),new ethers.Wallet(smartContractKey)]
    console.log(walletSigners);
    // get intu vault
    let intuVaults:Vault[] = await getUserVaults(walletSigners[0].address); 

    console.log(intuVaults); 

    // form tx
    const contractInterface = new ethers.utils.Interface(ManagerJSON.abi); 
    const data = contractInterface.encodeFunctionData('executePlan',[ownerAddress]); 
    
    // get paymaster
    const signer = new ethers.Wallet(MASTER_KEY); 
    // post tx
    await postTransaction(MANAGER_CONTRACT_ADDRESS,signer,vaultAddress,data,intuVaults[0].transactions.length+1,0);
    // refetch the vault for the txId
    intuVaults = await getUserVaults(walletSigners[0].address); 
    // get the txid
    const txId = intuVaults[0].transactions[intuVaults[0].transactions.length-1].id;
    //sign
    for(let wallet of walletSigners) {
        await signTransaction(wallet,txId,vaultAddress); 
    }
    //combine
    await combineSignatures(walletSigners[0],txId,vaultAddress); 
}

