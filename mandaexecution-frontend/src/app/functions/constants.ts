export const FEI_TOKEN_ADDRESS = ''; 
export const RARI_TOKEN_ADDRESS = '';

export enum SwapState {
    PreRegistration = 'at-pre-registration', 
    StepOne = 'at-registration-step1', 
    StepTwo = 'at-registration-step2', 
    StepThree = 'at-registration-step3',
    Confirmation = 'complete-registration',
    Funding = 'at-funding', 
    Signing = 'at-signing', 
    Executed = 'swap-executed'
}



