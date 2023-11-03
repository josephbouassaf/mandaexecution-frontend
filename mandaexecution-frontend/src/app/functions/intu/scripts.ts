import { createRandomWallet, createRandomWalletWithFunds, fundWallet } from "../ethereum/contracts/helpers"
import { completeVaultRegistration, getUserVaults, instantiateVault, preRegisterUser, registerUser } from "./intu";
import { getVaultMPK } from "intu-sdk/lib/src/services/web3";
import { provider } from "../ethereum/contants";
import { VaultWithKeys } from "@/app/type";
import { ethers } from "ethers";

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

async function onboardingScript(protectList:string[]) {
    // create the vault
    //const resultArr = await createVaultScript();
    // add vault data to the Manager contract

    // NB: ALLOWANCES FOR THE PROTECT LIST MUST BE GIVEN IN PARALLEL

    //return resultArr; 
}

async function executePlan() {

}
