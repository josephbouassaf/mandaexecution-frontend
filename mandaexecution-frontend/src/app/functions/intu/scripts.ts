import { createRandomWallet, fundWallet } from "../ethereum/contracts/helpers"
import { combineSignatures, completeVaultRegistration, getUserVaults, instantiateVault, postTransaction, preRegisterUser, registerUser, signTransaction } from "./intu";
import { _getProposal, _getTransaction, getVault } from "@intuweb3/web/lib/services/web3";
import { MANAGER_CONTRACT_ADDRESS, MASTER_KEY, provider } from "../ethereum/contants";
import { VaultWithKeys } from "@/app/type";
import { Signer, Wallet, ethers } from "ethers";
import { getBackupVaultMPK, getKeyFragment } from "../ethereum/contracts/functions";
import ManagerJSONABI from '../ethereum/contracts/Manager.json'
import { Vault } from "@intuweb3/web/lib/services/web3/models/vault";
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
    const vaults:Vault[] = await getUserVaults(keys[0].address); 
    const vault = vaults.find(v => v.name === name); 

    console.log(vault); 
    // pre-regiser everyone
    for(let owner of keys) {
        await fundWallet(signer,owner.address); 
        await preRegisterUser(vault!.vaultAddress,name,owner);
    }
    console.log('preregistration done')
    // register all keys for step 1
    for(let owner of keys) {
        await registerUser(vault!.vaultAddress,owner,1,name)
    }
    console.log('step 1 done')
    // register all keys for step 2
    for(let owner of keys) {
        await registerUser(vault!.vaultAddress,owner,2,name)
    }
    console.log('step 2 done')
    // register all keys for step 3
    for(let owner of keys) {
        await registerUser(vault!.vaultAddress,owner,3,name)
    }
    //create polibaseKey
    console.log('step 3 done');
    // complete vault
    await completeVaultRegistration(vault!.vaultAddress, keys[0]); 
    console.log('complete done');
    // get the vault MPK
    const v = await getVault(vault!.vaultAddress,provider); 

    console.log(keys); 
    // return values to save in the manager contract
    return {vaultMPK:v.masterPublicAddress!, keys:keys}
}
/**
 *
 * @param keys 
 * @param ownerAddress 
 */
export async function executePlan(keys:string[], ownerAddress:string) {

    // get the vault addrss
    const vaultMPK = await getBackupVaultMPK(ownerAddress); 
    console.log('vault address:'+vaultMPK); 
    // get the key fragment from the smart contract 
    const smartContractKey = await getKeyFragment(vaultMPK);
    console.log('last key:'+smartContractKey)
    // get wallets
    const walletSigners = [new ethers.Wallet(keys[0]).connect(provider),new ethers.Wallet(keys[1]).connect(provider),new ethers.Wallet(smartContractKey).connect(provider)]
    
    console.log(
        ethers.utils.formatEther(await provider.getBalance(walletSigners[0].address)),
        ethers.utils.formatEther(await provider.getBalance(walletSigners[1].address)),
        ethers.utils.formatEther(await provider.getBalance(walletSigners[2].address))
        );
    console.log(walletSigners[0].address); 
    // form tx
    const contractInterface = new ethers.utils.Interface(ManagerJSONABI); 
    const data = contractInterface.encodeFunctionData('executePlan',[ownerAddress]); 
    
    const vaultNonce = await provider.getTransactionCount(vaultMPK);
    
    let intuVaults:Vault[]  = await getUserVaults(walletSigners[0].address); 

    //asset: 0x6477a64321b80ca695cc91cddaffa133d722afa7
    //owner:0xa40993BD601cBbAc1212b5b79FEC62cDf603ccD9
    // receiver:0xB534760Fb6e9FB4d328D228871B9E39FeA456f34
 
    await postTransaction(MANAGER_CONTRACT_ADDRESS,walletSigners[0],intuVaults[0].vaultAddress,data,vaultNonce,0);
    // refetch the vault for the updated transaction count
    console.log('transaction posted')
    intuVaults = await getUserVaults(walletSigners[0].address); 
    console.log(intuVaults[0])
    //sign
    for(let wallet of walletSigners) {
        await signTransaction(wallet,intuVaults[0].transactionCount,intuVaults[0].vaultAddress,await wallet.signMessage(intuVaults[0].name)); 
        console.log('transaction signed by: '+wallet.address); 
    }
    //combine
    const signedTx = await combineSignatures(walletSigners[0],intuVaults[0].transactionCount,intuVaults[0].vaultAddress); 
    // broadcast transaction
    const tx = await provider.sendTransaction(signedTx.combinedTxHash.finalSignedTransaction); 
    await tx.wait(); 
}



