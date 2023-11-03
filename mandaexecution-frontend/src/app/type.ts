import { Wallet } from "ethers";

export interface ModalProps {
    onClose: () => void; 
    isOpen: boolean; 
    onOpen?: () => void; 
    errorMessage?: string|null;
}

export interface Asset {
    address:string; 
    symbol:string; 
    amount:string; 
}

export interface VaultWithKeys {
    vaultMPK:string; 
    keys:Wallet[]; 
}