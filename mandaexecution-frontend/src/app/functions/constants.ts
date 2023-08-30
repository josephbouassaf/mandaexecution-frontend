export const SWAP_CONTRACT_ADDRESS = '0x9fdd21856bCF4ce683C99B018AEC6dA9DF952fe5'; 
export const KEY_SHARE_THRESHOLD = 99; 

export enum SwapState {
    PreRegistration = 'at-pre-registration', 
    StepOne = 'at-registration-step1', 
    StepTwo = 'at-registration-step2', 
    StepThree = 'at-registration-step3',
    Registered = 'at-vault-confirmation',
    Confirmed = 'at-transaction-post',
    Funding = 'at-funding', 
    Signing = 'at-signing', 
    Executed = 'swap-executed', 
    Unexpected = 'unexpected-state'

}



