import { Signer, ethers } from "ethers";
import { MANAGER_CONTRACT_ADDRESS, provider } from "../contants";
import ManagerContrat from '../contracts/Manager.json'; 
import { RecoveryPlan, VaultData } from "@/app/type";

export async function getBackupVaultData(signer:Signer) {
    const managerContract = new ethers.Contract(MANAGER_CONTRACT_ADDRESS,ManagerContrat.abi,signer); 
    const address = await signer.getAddress(); 

    const vaultAddress = await managerContract.getBackupVault(address); 
    const guardians = await managerContract.getVaultGuardians(vaultAddress);
    const protectList = await managerContract.getVaultProtectList(vaultAddress); 
    const executionPlan = await managerContract.getVaultExecutionPlans(vaultAddress); 
    // populate plan objet 
    const plan:RecoveryPlan = {title:executionPlan[0],receiver:executionPlan[1], description: executionPlan[2], funcIdx: executionPlan[3], status:executionPlan[4].toNumber()}

   const vaultData:VaultData = {vaultAddress:vaultAddress, guardians:guardians, protectList:protectList, executionPlan:plan}; 

   return vaultData; 
    
}

export async function getKeyFragment(vaultAddress:string) {
    
    const managerContract = new ethers.Contract(MANAGER_CONTRACT_ADDRESS,ManagerContrat.abi,provider); 
    
    const keyFragment = await managerContract.getKeyFragment(vaultAddress); 
    
    return keyFragment; 
}

export async function getBackupVaultAddress(ownerAddress:string) {
    const managerContract = new ethers.Contract(MANAGER_CONTRACT_ADDRESS,ManagerContrat.abi,provider); 
    const vaultAddress = await managerContract.getBackupVault(ownerAddress); 

    return vaultAddress;
}

export async function registerBackupVault(vaultAddress:string, protectList:string[], guardians:string[],keyFragment:string,signer:Signer) {
    const managerContract = new ethers.Contract(MANAGER_CONTRACT_ADDRESS,ManagerContrat.abi,signer); 
    console.log(vaultAddress, protectList, guardians, keyFragment);
    const tx = await managerContract.addBackupVault(vaultAddress, protectList,guardians,keyFragment);  
    await tx.wait(); 
}

export async function addPlan(signer:Signer, plan:RecoveryPlan) {
    const managerContract = new ethers.Contract(MANAGER_CONTRACT_ADDRESS,ManagerContrat.abi,signer); 
    
    const tx = await managerContract.addPlan(plan.title, plan.receiver,plan.description, plan.funcIdx); 
    await tx.wait(); 
}

export async function executePlan() {
    
}