import { ContractTransaction, Signer } from "ethers";
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
    FEI_TOKEN_ADDRESS, 
    RARI_TOKEN_ADDRESS,
    SwapState
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
    const tx:ContractTransaction = await vaultCreation(participants, vaultName, 99,99,99,signer); 
    await tx.wait(); 
};

/**
 * perform pregistration step for a user
 * @param vaultAddress 
 * @param signer 
 */
export async function preRegisterUser(vaultAddress: string, signer: Signer) {
    const tx:ContractTransaction = await preRegistration(vaultAddress, signer);
    await tx.wait(); 
}

/**
 * perform registration steps for a user
 * @param vaultAddress 
 * @param signer 
 */
export async function registerUser(vaultAddress:string, signer: Signer, step:number) {
    if(step === 1) {
        await registerStep1(vaultAddress, signer); 
    }
    if(step === 2) {
        await registerStep2(vaultAddress, signer);
    }
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

export async function areAllUsersRegistered(vault:Vault):Promise<boolean> {
    let areUsersRegistered = false; 
    for(var i = 0; i < vault.users.length; i++)
        areUsersRegistered = await isUserRegisteredStep3(vault.vaultAddress, vault.users[i].address); 
    return areUsersRegistered; 
}

export async function getUserStatus(swapState:string, vault:Vault,signerAddress:string) {
    let userStatus = true; 
    if(swapState === SwapState.PreRegistration) {
        userStatus = await isUserPreregistered(vault.vaultAddress,signerAddress);
    } else if(swapState === SwapState.StepOne) {
        userStatus = await isUserRegisteredStep1(vault.vaultAddress,signerAddress);
    } else if (swapState === SwapState.StepTwo) {
        userStatus = await isUserRegisteredStep2(vault.vaultAddress,signerAddress);
    } else if (swapState === SwapState.StepThree) {
        userStatus = await isUserRegisteredStep3(vault.vaultAddress,signerAddress);
    } else if (swapState === SwapState.Funding) {
        userStatus = await hasUserFundedSwap(vault,signerAddress); 
    } else if (swapState === SwapState.Signing) { 
        userStatus = await hasUserSignedSwap(vault,signerAddress); 
    } else {
        return userStatus; // i.e. if done or unexpected state => do nothing
    }
    return userStatus; 
}

function hasUserSigned(vault:Vault, txId:number, signerAddress:string) {
    const tx = vault.transactions.find(tx => tx.id === txId); 
    if(tx) {
        const userSignedTx = tx?.userSignedTransactions.find(userTx => userTx.address === signerAddress); 
        return Boolean(userSignedTx); 
    } 
    return false; 
}

export async function getPostRegState(vault:Vault) {
    if(!haveUsersFundedSwap(vault)) {
        return SwapState.Funding; 
    }
     
    if(!haveUsersSignedSwap(vault)) {
        return SwapState.Signing; 
    }

    return SwapState.Executed;
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
            if(!result) {
                return SwapState.PreRegistration;
            }
        }

        for(let i = 0; i < users.length;i++) {
            const result = await isUserRegisteredStep1(vault.vaultAddress,vault.users[i].address); 
            if(!result) {
                return SwapState.StepOne;
            }
        }
        
        for(let i = 0; i < users.length;i++) {
            const result = await isUserRegisteredStep2(vault.vaultAddress,vault.users[i].address); 
            if(!result) {
                return SwapState.StepTwo;
            }
        }

        for(let i = 0; i < users.length;i++) {
            const result = await isUserRegisteredStep3(vault.vaultAddress,vault.users[i].address); 
            if(!result) {
                return SwapState.StepThree;
            }
        }
        return SwapState.Unexpected;
    }
}

/**
 * returns true if the swap has been funded by the calling user, otherwise returns false
 * @param vault 
 * @returns 
 */
export async function hasUserFundedSwap(vault:Vault, signerAddress: string) {
    let fundingState = false; 
    if(vault.masterPublicAddress)
        fundingState = (await hasAllowance(FEI_TOKEN_ADDRESS,vault.masterPublicAddress,signerAddress)) || (await hasAllowance(RARI_TOKEN_ADDRESS,vault.masterPublicAddress,signerAddress));
    return fundingState; 
}

/**
 * returns true if the swap has been funded, otherwise returns false
 * @param vault 
 * @returns 
 */
export async function haveUsersFundedSwap(vault:Vault) {
    let fundingState = false; 
    if(vault.masterPublicAddress) {
        for(var i = 0; i<vault.users.length; i++)
            fundingState = (await hasAllowance(FEI_TOKEN_ADDRESS,vault.masterPublicAddress,vault.users[i].address)) || (await hasAllowance(RARI_TOKEN_ADDRESS,vault.masterPublicAddress,vault.users[i].address));
    }
    return fundingState; 
}

/**
 * returns true if the swap transaction has been signed by the calling user, returns false otherwise
 * @param vault 
 */
export async function hasUserSignedSwap(vault:Vault, signerAddress:string) {
    let signingState = false; 
    signingState =  (await hasUserSigned(vault,vault.transactions[-1].id,signerAddress)); 
    return signingState; 
}

/**
 * returns true if the swap transaction has been signed, returns false otherwise
 * @param vault 
 */
export async function haveUsersSignedSwap(vault:Vault) {
    let signingState = false; 
    for(var i = 0; i<vault.users.length; i++)
        signingState =  (await hasUserSigned(vault,vault.transactions[-1].id,vault.users[i].address)); 
    return signingState; 
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
/**
 * sign a transaction with signer's private key
 * @param signer 
 * @param txId 
 * @param vaultAddress 
 */
export async function signTransaction(signer:Signer, txId:number, vaultAddress:string) {
    await signTx(vaultAddress,txId,signer); 
}

/**
 * combine signatures to broadcast transaction on the network
 * @param signer 
 * @param txId 
 * @param vaultAddress 
 */
export async function combineSignatures(signer:Signer, txId:number, vaultAddress:string) {
    await combineSignedTx(vaultAddress,txId,signer); 
}

