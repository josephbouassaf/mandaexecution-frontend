import { 
    ContractTransaction, 
    Signer } from "ethers";
import { 
    vaultCreation, 
    preRegistration, 
    registerStep1, 
    registerStep2, 
    registerStep3,
    completeVault,
    signTx,
    combineSignedTx,
    submitTransaction,
    getVaults
} from "@intuweb3/web/lib/services";
import {
    getUserPreRegisterInfos,
    getUserRegistrationStep1Infos,
    getUserRegistrationStep2Infos,
    getUserRegistrationStep3Infos
} from "@intuweb3/web/lib/services/web3/utils"
import { KEY_SHARE_THRESHOLD, provider} from '../ethereum/contants'

/**
 * returns all vaults for a given user
 * @param signerAddress 
 * @param provider 
 * @returns 
 */
export async function getUserVaults(signerAddress:string) {
    const userVaults = await getVaults(signerAddress,provider);    
    return userVaults; 
}

/**
 * initialize, an "empty" vault
 * @param signer 
 * @param participants 
 */
export async function instantiateVault(signer: Signer,participants: string[], vaultName:string) {
    const tx:ContractTransaction|undefined = await vaultCreation(participants, vaultName, KEY_SHARE_THRESHOLD,KEY_SHARE_THRESHOLD,KEY_SHARE_THRESHOLD,signer); 
    if(tx)
        await tx.wait(); 
};

/**
 * perform pregistration step for a user // check if this is what needs to be signed
 * @param vaultAddress 
 * @param signer 
 */
export async function preRegisterUser(vaultAddress: string, vaultName:string, signer: Signer) {
    const tx:ContractTransaction = await preRegistration(vaultAddress,signer, await signer.signMessage(vaultName));
    await tx.wait(); 
}

/**
 * perform registration steps for a user
 * @param vaultAddress 
 * @param signer 
 */
export async function registerUser(vaultAddress:string, signer: Signer, step:number, vaultName:string) {
    let receipt; 
    if(step === 1) {
        receipt = await registerStep1(vaultAddress, signer); 
    }
    if(step === 2) {
        receipt = await registerStep2(vaultAddress, signer,await signer.signMessage(vaultName));
    }
    if(step === 3) {
        receipt = await registerStep3(vaultAddress, signer,await signer.signMessage(vaultName)); 
    }

    if(receipt)
        await receipt.wait(); 
}
     
export async function completeVaultRegistration(vaultAddress: string, signer: Signer) {
    const receipt = await completeVault(vaultAddress, signer);
    await receipt.wait();
}

export async function isUserPreregistered(vaultAddress:string, signerAddress:string):Promise<boolean> {
    return await getUserPreRegisterInfos(vaultAddress,signerAddress,provider)
    .then((registrationObj) => registrationObj.registered)
    .catch((err) => false); 
}

export async function isUserRegisteredStep1(vaultAddress:string, signerAddress:string):Promise<boolean> {
    return await getUserRegistrationStep1Infos(vaultAddress,signerAddress,provider)
    .then((registrationObj) => registrationObj.registered)
    .catch((err) => false); 
}

export async function isUserRegisteredStep2(vaultAddress:string, signerAddress:string):Promise<boolean> {
    return await getUserRegistrationStep2Infos(vaultAddress,signerAddress,provider)
    .then((registrationObj) => registrationObj.registered)
    .catch((err) => false); 
}

export async function isUserRegisteredStep3(vaultAddress:string, signerAddress:string):Promise<boolean> {
    return await getUserRegistrationStep3Infos(vaultAddress,signerAddress,provider)
    .then((registrationObj) => registrationObj.registered)
    .catch((err) => false); 
}

/**
 * register transaction proposal in the vault
 * @param signer 
 * @param vaultName 
 * @param emptyTx 
 */
export async function postTransaction(to:string, signer: Signer, vaultAddress:string, data:string, nonce:number, value:number) {
    const tx = await submitTransaction(to, value, provider._network.chainId, nonce, data,"","",vaultAddress, signer); 
    console.log(tx); 
    await tx.wait()
}
/**
 * sign a transaction with signer's private key
 * @param signer 
 * @param txId 
 * @param vaultAddress 
 */
export async function signTransaction(signer:Signer, txId:number, vaultAddress:string) {
    const receipt = await signTx(vaultAddress,txId,signer); 
    await receipt.wait(); 
}

/**
 * combine signatures to broadcast transaction on the network
 * @param signer 
 * @param txId 
 * @param vaultAddress 
 */
export async function combineSignatures(signer:Signer, txId:number, vaultAddress:string) {
    const signedTx = await combineSignedTx(vaultAddress,txId,signer); 
    return signedTx; 
}

