export const FEI_TOKEN_ADDRESS = ''; 
export const RARI_TOKEN_ADDRESS = '';
export const SWAP_CONTRACT_ADDRESS = ''; 

export enum SwapState {
    PreRegistration = 'at-pre-registration', 
    StepOne = 'at-registration-step1', 
    StepTwo = 'at-registration-step2', 
    StepThree = 'at-registration-step3',
    Funding = 'at-funding', 
    Signing = 'at-signing', 
    Executed = 'swap-executed', 
    Unexpected = 'unexpected-state'

}



