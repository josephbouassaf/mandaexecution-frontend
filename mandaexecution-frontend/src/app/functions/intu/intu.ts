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
    submitTransaction
} from "intu-sdk/lib/src/services";
import {
    getVaultMPK, 
    getVaults, 
} from "intu-sdk/lib/src/services/web3"
import {
    getUserPreRegisterInfos,
    getUserRegistrationStep1Infos,
    getUserRegistrationStep2Infos,
    getUserRegistrationStep3Infos
} from "intu-sdk/lib/src/services/web3/utils"
import { provider} from '../ethereum/ethereum'
import { Vault } from "intu-sdk/lib/src/models/models";
import { hasAllowance } from "../ethereum/contracts/functions";
import { 
    KEY_SHARE_THRESHOLD,
    SWAP_CONTRACT_ADDRESS,
    SwapState
} from "../constants";
import { deconstructVaultName } from "../utils/utils";

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
    const tx:ContractTransaction = await vaultCreation(participants, vaultName, KEY_SHARE_THRESHOLD,KEY_SHARE_THRESHOLD,KEY_SHARE_THRESHOLD,signer); 
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
    let receipt; 
    if(step === 1) {
        receipt = await registerStep1(vaultAddress, signer); 
    }
    if(step === 2) {
        receipt = await registerStep2(vaultAddress, signer);
    }
    if(step === 3) {
        receipt = await registerStep3(vaultAddress, signer); 
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
    } else if (swapState === SwapState.Registered) {
        userStatus = false;
    } else if (swapState === SwapState.Confirmed) {
        userStatus = false; 
    } else if (swapState === SwapState.Funding) {
        userStatus = await hasUserFundedSwap(vault,signerAddress); 
    } else if (swapState === SwapState.Signing) { 
        userStatus = await hasUserSignedSwap(vault,signerAddress); 
    } else {
        return userStatus; // i.e. if done or unexpected state => do nothing
    }
    return userStatus; 
}

export async function getPostRegState(vault:Vault) {
    const txs = vault.transactions; 

    if(txs.length === 0) {
        return SwapState.Confirmed; 
    }
    const funded = await haveUsersFundedSwap(vault);
    if(!funded) {
        return SwapState.Funding; 
    }
    const signed = await haveUsersSignedSwap(vault); 
    if(!signed) {
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

        return SwapState.Registered; 
    }
}

/**
 * returns true if the swap has been funded by the calling user, otherwise returns false
 * @param vault 
 * @returns 
 */
export async function hasUserFundedSwap(vault:Vault, signerAddress: string) {
    let fundingState = false; 
    const swapData = deconstructVaultName(vault.name);
    const mpk = await getVaultMPK(vault.vaultAddress,provider);
    if(swapData) {
        const numeraires = [swapData[1], swapData[3]]; 
        if(vault.masterPublicAddress && numeraires)
            fundingState = (await hasAllowance(numeraires[0],signerAddress,mpk)) || (await hasAllowance(numeraires[1],signerAddress,mpk));
    } 
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
        const swapData = deconstructVaultName(vault.name);
        if(swapData) {
            const numeraires = [swapData[1], swapData[3]]; 
            for(var i = 0; i<vault.users.length; i++) {
                fundingState = (await hasAllowance(numeraires[0],vault.users[i].address,vault.masterPublicAddress)) || (await hasAllowance(numeraires[1],vault.users[i].address,vault.masterPublicAddress));
                if(!fundingState) {
                    return fundingState;
                }
            }
        }
    }
    return fundingState; 
}

/**
 * returns true if the swap transaction has been signed by the calling user, returns false otherwise
 * @param vault 
 */
export async function hasUserSignedSwap(vault:Vault, signerAddress:string) {
    return vault.transactions[vault.transactions.length-1].userSignedTransactions.map(tx => tx.address === signerAddress).length > 0 ? true : false;  
}

/**
 * returns true if the swap transaction has been signed, returns false otherwise
 * @param vault 
 */
export async function haveUsersSignedSwap(vault:Vault) {
    return vault.transactions[vault.transactions.length-1].signedTransactionsNeeded >= 1 ? false : true;  
}

/**
 * register transaction proposal in the vault
 * @param signer 
 * @param vaultName 
 * @param emptyTx 
 */
export async function postTransaction(signer: Signer, vaultAddress:string, data:string, nonce:number, value:number) {
    const chainId = (await provider.getNetwork()).chainId;
    await submitTransaction(SWAP_CONTRACT_ADDRESS, value, chainId, nonce, data,"","",vaultAddress, signer); 
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
    await combineSignedTx(vaultAddress,txId,signer); 
}

