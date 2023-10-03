import { Vault } from "intu-sdk/lib/src/models/models";
import {SwapState, SWAP_CONTRACT_ADDRESS } from "../constants";
import {combineSignatures, completeVaultRegistration, haveUsersSignedSwap, postTransaction, preRegisterUser, registerUser, signTransaction } from "../intu/intu";
import { allowVaultToSpend, buildEmptySwapTransaction } from "../ethereum/contracts/functions";
import { getVaultMPK } from "intu-sdk/lib/src/services/web3";
import { provider } from "../ethereum/ethereum";
import { Signer } from "ethers";

export function isStringNumeric(str:string) {
    return str.length !== 0 && /^[0-9]*$/.test(str) && Number(str) !== 0;
}

export function deconstructVaultName(vaultName:string|undefined) {
    if(vaultName) {
        // format {amount}-{address}//{amount}-{address}
        // 1) split on //
        const halfs = vaultName.split("//");
        // 2) plit each half on -
        const firstHalf = halfs[0].split("-");
        const secondhalf = halfs[1].split("-");
        // 3) return result
        return firstHalf.concat(secondhalf);
    }
}

export function getProgressBarValue(swapState: string) {
    if(swapState === SwapState.PreRegistration) {
        return 10; 
    } else if(swapState === SwapState.StepOne) {
        return 20;
    } else if(swapState === SwapState.StepTwo) {
        return 30; 
    } else if(swapState === SwapState.StepThree) {
       return 40; 
    } else if(swapState === SwapState.Registered) {
        return 50; 
    } else if(swapState === SwapState.Confirmed) {
        return 60; 
     } else if(swapState === SwapState.Funding) {
        return 70;
    } else if(swapState === SwapState.Signing) { // sign swap transactions
        return 95;
    } else if(swapState === SwapState.Executed) { // sign off on the fund distribution
        return 100;     
    } else {
        return 0; 
    }
}
/**
 *  returns text to be displayed to user based on swap state and user actions up to calling time
 * @param swapState 
 * @param userTurn 
 * @returns 
 */
export function getActionText(swapState:string|undefined, userTurn:boolean|undefined):string {
    if(swapState === SwapState.PreRegistration) {
        return !userTurn ? 'Pre Register' : 'Counterparty Not Pre-Registered'
    } else if(swapState === SwapState.StepOne) {
        return !userTurn ? 'Register For Step 1' : 'Counterparty Registration Step 1 Pending'
    } else if(swapState === SwapState.StepTwo) {
        return !userTurn ? 'Register For Step 2' : 'Counterparty Registration Step 2 Pending'
    } else if(swapState === SwapState.StepThree) {
        return !userTurn ? 'Register For Step 3' : 'Counterparty Registration Step 3 Pending'
    } else if(swapState === SwapState.Registered) {
        return 'Confirm Registration';
    } else if(swapState === SwapState.Confirmed) {
        return 'Propose Swap Transaction';
    } else if(swapState === SwapState.Funding) {
        return !userTurn ? 'Fund Vault' : 'Waiting for Counterparty to Fund Vault'; 
    } else if(swapState === SwapState.Signing) {
        return !userTurn ? 'Sign off on Swap' : 'Waiting for Counterparty to Sign'; 
    } else if(swapState === SwapState.Executed) {
        return 'Done'
    } else {
        return 'Unexpected Swap State'
    }
}

/**
 * get the next action to be performed by the user
 * @param swapState 
 * @param vault 
 * @param signer 
 * @returns 
 */
export function getNextAction(swapState: string, vault:Vault, signer: Signer):() => Promise<void> {
    if(swapState === SwapState.PreRegistration) {
        return (async function() {await preRegisterUser(vault.vaultAddress, signer);});
    } else if(swapState === SwapState.StepOne) {
        return (async function() {await registerUser(vault.vaultAddress, signer,1)}); 
    } else if(swapState === SwapState.StepTwo) {
        return (async function() {await registerUser(vault.vaultAddress, signer,2)});
    } else if(swapState === SwapState.StepThree) {
        return (async function() { await registerUser(vault.vaultAddress, signer,3)}); 
    } else if(swapState === SwapState.Registered) {
        return (async function() { await completeVaultRegistration(vault.vaultAddress,signer);}); 
    } else if(swapState === SwapState.Confirmed) {
        return (async function() { 
            // build the swap transaction
            const swapData = deconstructVaultName(vault.name);
            if(swapData) {
                const numeraires = [swapData[1],swapData[3]]; 
                const data = await buildEmptySwapTransaction(vault.users.map(user => user.address),numeraires, vault.transactions.length+1); 
                if(data) {
                    await postTransaction(signer,vault.vaultAddress,data,vault.transactions.length+1,0);
                }
            }
        })
    } else if(swapState === SwapState.Funding) {
        return (async function() {
            const address = await signer.getAddress(); 
            const data = deconstructVaultName(vault.name); 
            const mpk = await getVaultMPK(vault.vaultAddress,provider);
            if(vault.users[0].address === address && vault.masterPublicAddress && data)
                await allowVaultToSpend(mpk, data[1],data[0],signer); 
            if(vault.users[1].address === address && vault.masterPublicAddress && data)
                await allowVaultToSpend(mpk, data[3],data[2],signer);
            });
        } else if(swapState === SwapState.Signing) { // sign swap transactions  
            return (async function() {
                await signTransaction(signer,vault.transactions[vault.transactions.length-1].id,vault.vaultAddress);
                const haveUsersSigned = await haveUsersSignedSwap(vault); 
                if(haveUsersSigned) // if all users have signed, combine the signatures
                    await combineSignatures(signer, vault.transactions[vault.transactions.length-1].id, vault.vaultAddress);  
            }); 
    } else {
        return (async function() {return;});
    }
}