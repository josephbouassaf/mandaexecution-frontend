import { Vault } from "intu-sdk/lib/src/models/models";
import { SwapState, FEI_TOKEN_ADDRESS, SwapState } from "../constants";
import { completeVaultRegistration, preRegisterUser, registerUser } from "../intu/intu";
import { approveVaultAsSpender, hasAllowance, hasAllowance } from "../ethereum/contracts/functions";

export const getProgressBarValue = (swapState: string) => {
    console.log(swapState); 
    if(swapState === SwapState.PreRegistration) {
        return 10; 
    } else if(swapState === SwapState.StepOne) {
        return 20;
    } else if(swapState === SwapState.StepTwo) {
        return 30; 
    } else if(swapState === SwapState.StepThree) {
       return 40; 
    } else if(swapState === SwapState.Confirmation) {
        return 50; 
    } else if(swapState === SwapState.Completed) {
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

export const getActionText = (swapState:string|undefined, userTurn:boolean|undefined):string => {
    if(swapState === undefined || userTurn === undefined)
        return 'Unexpected Swap State'
    if(swapState === SwapState.PreRegistration) {
        return !userTurn ? 'Pre Register' : 'Counterparty Not Pre-Registered'
    } else if(swapState === SwapState.StepOne) {
        return !userTurn ? 'Register For Step 1' : 'Counterparty Registration Step 1 Pending'
    } else if(swapState === SwapState.StepTwo) {
        return !userTurn ? 'Register For Step 2' : 'Counterparty Registration Step 2 Pending'
    } else if(swapState === SwapState.StepThree) {
        return !userTurn ? 'Register For Step 3' : 'Counterparty Registration Step 3 Pending'
    } else if(swapState === SwapState.Confirmation) {
        return 'Complete Registration';
    } else if(swapState === SwapState.Completed) {
        return 'Fund Vault'
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

export const getNextAction = async (swapState: string, vault:Vault, wallet: any):(() => Promise<void>) => {
    if(swapState === SwapState.PreRegistration) {
        return async () => preRegisterUser(vault.vaultAddress, wallet);
    } else if(swapState === SwapState.StepOne) {
        return async () => registerUser(vault.vaultAddress, wallet,1); 
    } else if(swapState === SwapState.StepTwo) {
        return async () => registerUser(vault.vaultAddress, wallet,2);
    } else if(swapState === SwapState.StepThree) {
        return async () => registerUser(vault.vaultAddress, wallet,3);
    } else if(swapState === SwapState.Confirmation) {
        return async () => completeVaultRegistration(vault.vaultAddress,wallet);
    }  else if(swapState === SwapState.Funding || swapState === SwapState.Completed) {
        const address = await wallet.getAddress(); 
        if(vault.users[0].address === address && vault.masterPublicAddress)
            return async () => approveVaultAsSpender(FEI_TOKEN_ADDRESS,wallet,vault.masterPublicAddress); 
        if(vault.users[1].address === address && vault.masterPublicAddress)
            return async () => approveVaultAsSpender(RARI_TOKEN_ADDRESS,wallet,vault.masterPublicAddress); 
    } else if(swapState === 'at-signing') { // sign swap transactions
            //await signTransaction(wallet,vault.transactions[-2].id,vault.vaultAddress); 
            //await signTransaction(wallet,vault.transactions[-1].id,vault.vaultAddress);   
            return async () => {}
    } else if(swapState === 'at-combining') { // sign off on the fund distribution
            //await combineSignatures(wallet,vault.transactions[-2].id,vault.vaultAddress); 
            //await combineSignatures(wallet,vault.transactions[-1].id,vault.vaultAddress);   
            return async () => {}
    } else {
        return async () => {}
    }
}