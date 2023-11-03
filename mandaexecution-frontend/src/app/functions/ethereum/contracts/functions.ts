import { Signer, ethers } from "ethers";
import { MANAGER_CONTRACT_ADDRESS } from "../contants";
import ManagerContrat from '../contracts/Manager.json'; 

interface VaultData {
    vaultAddress:string; 
    guardians:string[];
    protectList:string[]; 
    executionPlans:string[]; 

}
export async function getBackupVaultData(signer:Signer) {
    const managerContract = new ethers.Contract(MANAGER_CONTRACT_ADDRESS,ManagerContrat.abi,signer); 
    const address = await signer.getAddress(); 

    const vaultAddress = await managerContract.getBackupVault(address); 
    const guardians = await managerContract.getVaultGuardians(vaultAddress);
    const protectList = await managerContract.getVaultProtectList(vaultAddress); 
    const executionPlans = await managerContract.getExecutionPlans(vaultAddress); 

   const vaultData:VaultData = {vaultAddress, guardians, protectList, executionPlans}; 

   return vaultData; 
    
}

export async function registerBackupVault(vaultAddress:string, protectList:string[], guardians:string[],keyFragment:string,signer:Signer) {
    const managerContract = new ethers.Contract(MANAGER_CONTRACT_ADDRESS,ManagerContrat.abi,signer); 
    const address = await signer.getAddress();

    const tx = await managerContract.addBackupVault(vaultAddress, address, protectList,guardians,keyFragment);  
    await tx.wait(); 
}

export async function executePlan() {
    
}