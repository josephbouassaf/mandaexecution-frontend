import { Vault } from "intu-sdk/lib/src/models/models";
import { FEI_TOKEN_ADDRESS, SwapState, RARI_TOKEN_ADDRESS, SWAP_CONTRACT_ADDRESS } from "../constants";
import { areAllUsersRegistered, combineSignatures, completeVaultRegistration, haveUsersSignedSwap, postTransaction, preRegisterUser, registerUser, signTransaction } from "../intu/intu";
import { approveVaultAsSpender, proposeEmptySwapTransaction } from "../ethereum/contracts/functions";
import { getVaultMPK } from "intu-sdk/lib/src/services/web3";
import { provider } from "../ethereum/ethereum";

export function getProgressBarValue(swapState: string) {
    if(swapState === SwapState.PreRegistration) {
        return 10; 
    } else if(swapState === SwapState.StepOne) {
        return 20;
    } else if(swapState === SwapState.StepTwo) {
        return 30; 
    } else if(swapState === SwapState.StepThree) {
       return 40; 
    } else if(swapState === SwapState.Funding) {
        return 60;
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
 * @param wallet 
 * @returns 
 */
export function getNextAction(swapState: string, vault:Vault, wallet: any):() => Promise<void> {
    if(swapState === SwapState.PreRegistration) {
        return (async function() {await preRegisterUser(vault.vaultAddress, wallet);});
    } else if(swapState === SwapState.StepOne) {
        return (async function() {await registerUser(vault.vaultAddress, wallet,1)}); 
    } else if(swapState === SwapState.StepTwo) {
        return (async function() {await registerUser(vault.vaultAddress, wallet,2)});
    } else if(swapState === SwapState.StepThree) {
        return (async function() {
            await registerUser(vault.vaultAddress, wallet,3); 
            const areUsersRegistered = await areAllUsersRegistered(vault); 
            if(areUsersRegistered) { // complete the registration and post the swap transaction
                await completeVaultRegistration(vault.vaultAddress,wallet);
                const vaultMPK = await getVaultMPK(vault.vaultAddress,provider); 
                const emptyTx = await proposeEmptySwapTransaction(SWAP_CONTRACT_ADDRESS, vaultMPK, SWAP_CONTRACT_ADDRESS, '0', vault.transactions.length+1); 
                if(emptyTx)
                    await postTransaction(wallet,vault.vaultAddress,emptyTx);
            }
        });
    } else if(swapState === SwapState.Funding) {
        return (async function() {
            const address = await wallet.getAddress(); 
            if(vault.users[0].address === address && vault.masterPublicAddress)
                await approveVaultAsSpender(FEI_TOKEN_ADDRESS,wallet,vault.masterPublicAddress!); 
            if(vault.users[1].address === address && vault.masterPublicAddress)
                await approveVaultAsSpender(RARI_TOKEN_ADDRESS,wallet,vault.masterPublicAddress!); 
            })
        } else if(swapState === SwapState.Signing) { // sign swap transactions  
            return (async function() {
                await signTransaction(wallet,vault.transactions[-1].id,vault.vaultAddress);
                const haveUsersSigned = await haveUsersSignedSwap(vault); 
                if(haveUsersSigned) // if all users have signed, combine the signatures
                    await combineSignatures(wallet, vault.transactions[-1].id, vault.vaultAddress);  
            }); 
    } else {
        return (async function() {return;});
    }
}