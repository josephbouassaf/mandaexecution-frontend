import { Signer } from "ethers";
import { 
    vaultCreation, 
    preRegistration, 
    registerStep1, 
    registerStep2, 
    registerStep3,
    completeVault,
    signTx,
    combineSignedTx
} from "intu-sdk/lib/src/services";
import {getVaults, 
    proposeTransaction
} from "intu-sdk/lib/src/services/web3"
import {
    getUserPreRegisterInfos,
    getUserStep1Infos,
    getUserStep2Infos,
    getUserStep3Infos
} from "intu-sdk/lib/src/services/web3/utils"
import { provider} from '../ethereum/ethereum'
import { Vault } from "intu-sdk/lib/src/models/models";
import { hasAllowance } from "../ethereum/contracts/functions";
import { 
    ExecutionState,
    FEI_TOKEN_ADDRESS, 
    RARI_TOKEN_ADDRESS, 
    RegistrationState
} from "../constants";

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
export async function instantiateVault(signer: Signer,participants: string[]) {
    const vaultName = "newVault-"+ Math.ceil(100000*Math.random());
    // create the vault
    await vaultCreation(participants, vaultName, 99,99,99,signer)  
};

/**
 * perform pregistration step for a user
 * @param vaultAddress 
 * @param signer 
 */
export async function preRegisterUser(vaultAddress: string, signer: Signer) {
    await preRegistration(vaultAddress, signer);
}

/**
 * perform registration steps for a user
 * @param vaultAddress 
 * @param signer 
 */
export async function registerUser(vaultAddress:string, signer: Signer, step:number) {
    if(step === 1)
        await registerStep1(vaultAddress, signer);
    if(step === 2) 
        await registerStep2(vaultAddress, signer);
    if(step === 3) {
        await registerStep3(vaultAddress, signer); 
    }
}

export async function completeVaultRegistration(vaultAddress: string, signer: Signer) {
    await completeVault(vaultAddress, signer);
}

export async function isUserPreregistered(vaultAddress:string, signerAddress:string):Promise<boolean> {
    return await getUserPreRegisterInfos(vaultAddress,signerAddress,provider)
    .then((obj) => true)
    .catch((err) => false); 
}

export async function isUserRegisteredStep1(vaultAddress:string, signerAddress:string):Promise<boolean> {
    return await getUserStep1Infos(vaultAddress,signerAddress,provider)
    .then((obj) => true)
    .catch((err) => false); 
}

export async function isUserRegisteredStep2(vaultAddress:string, signerAddress:string):Promise<boolean> {
    return await getUserStep2Infos(vaultAddress,signerAddress,provider)
    .then((obj) => true)
    .catch((err) => false); 
}

export async function isUserRegisteredStep3(vaultAddress:string, signerAddress:string):Promise<boolean> {
    return await getUserStep3Infos(vaultAddress,signerAddress,provider)
    .then((obj) => true)
    .catch((err) => false); 
}

export async function getUserStatus(swapState:string, vaultAddress:string,signerAddress:string) {
    let userStatus = false; 
    if(swapState === RegistrationState.PreRegistration) {
        userStatus = await isUserPreregistered(vaultAddress,signerAddress);
    } 
    else if(swapState === RegistrationState.StepOne) {
        userStatus = await isUserRegisteredStep1(vaultAddress,signerAddress);
    } 
    else if (swapState === RegistrationState.StepTwo) {
        userStatus = await isUserRegisteredStep2(vaultAddress,signerAddress);
    } 
    else if (swapState === RegistrationState.StepThree) {
        userStatus = await isUserRegisteredStep3(vaultAddress,signerAddress);
    } else if (swapState === RegistrationState.Confirmation) { // at confirmation
            // do nothing
    } else {
        //TODO: set error Message
        console.log('I get here because there is an error'); 
        return;
    }
    // TODO: add post registration user statuses. 
    return userStatus; 
}

export async function hasUserSigned(vault:Vault, txId:number, signerAddress:string) {
    const tx = vault.transactions.find(tx => tx.id === txId); 
    if(tx) {
        const userSignedTx = tx?.userSignedTransactions.find(userTx => userTx.address === signerAddress); 
        return Boolean(userSignedTx); 
    } 
    return false; 
}

export async function getPostRegState(vault:Vault) {
    if(!haveUsersFunded(vault)) {
        return 'at-funding'; 
    }
     
    if(!haveUsersSigned(vault)) {
        return 'at-signing'
    }

    return 'at-combining'
}

export async function getSwapState(vault:Vault) {
    // check if vault registration is complete
    if(vault.masterPublicAddress) {
        const postRegistrationState = await getPostRegState(vault);
        return postRegistrationState; 
    } else {
         
        let users = vault.users;
        for(let i = 0; i < users.length;i++) {
        const result = await isUserPreregistered(vault.vaultAddress,vault.users[i].address); 
            if(result === false) {
                return RegistrationState.PreRegistration;
            }
        }

        for(let i = 0; i < users.length;i++) {
            const result = await isUserRegisteredStep1(vault.vaultAddress,vault.users[i].address); 
            if(result === false) {
                return RegistrationState.StepOne;

            }
        }
        
        for(let i = 0; i < users.length;i++) {
            const result = await isUserRegisteredStep2(vault.vaultAddress,vault.users[i].address); 
            if(result === false) {
                return RegistrationState.StepTwo;
            }
        }

        for(let i = 0; i < users.length;i++) {
            const result = await isUserRegisteredStep3(vault.vaultAddress,vault.users[i].address); 
            if(result === false) {
                return RegistrationState.StepThree;
            }
        }
        // is all registration steps have been completed, 
        //but the public key has not been created yet, 
        //then the vault needs to be completed
        return RegistrationState.Confirmation
    }
}

export async function haveUsersFundedSwap(vault:Vault) {
    let fundingState = false; 
    if(vault.masterPublicAddress) {
        fundingState = (await hasAllowance(FEI_TOKEN_ADDRESS,vault.masterPublicAddress,vault.users[0].address)) || (await hasAllowance(RARI_TOKEN_ADDRESS,vault.masterPublicAddress,vault.users[0].address));
        fundingState = (await hasAllowance(FEI_TOKEN_ADDRESS,vault.masterPublicAddress,vault.users[1].address)) || (await hasAllowance(RARI_TOKEN_ADDRESS,vault.masterPublicAddress,vault.users[1].address));
    }
    return fundingState; 
}

export async function haveUsersSignedSwap(vault:Vault) {
   let signingState = false; 
   signingState =  (await hasUserSigned(vault,vault.transactions[-1].id,vault.users[0].address)) && (await hasUserSigned(vault,vault.transactions[-2].id,vault.users[0].address));
   signingState =  (await hasUserSigned(vault,vault.transactions[-1].id,vault.users[1].address)) && (await hasUserSigned(vault,vault.transactions[-2].id,vault.users[1].address));
}

/**
 * register transaction proposal in the vault
 * @param signer 
 * @param vaultName 
 * @param emptyTx 
 */
export async function postTransaction(signer: Signer, vaultAddress:string, emptyTx:string) {
    await proposeTransaction(vaultAddress, emptyTx,signer); 
}

export async function signTransaction(signer:Signer, txId:number, vaultAddress:string) {
    await signTx(vaultAddress,txId,signer); 
}

export async function combineSignatures(signer:Signer, txId:number, vaultAddress:string) {
    await combineSignedTx(vaultAddress,txId,signer); 
}

