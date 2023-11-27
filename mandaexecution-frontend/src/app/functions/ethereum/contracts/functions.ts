import { Signer, ethers } from "ethers";
import { MANAGER_CONTRACT_ADDRESS, provider } from "../contants";
import ManagerContratABI from '../contracts/Manager.json'; 
import { RecoveryPlan, VaultData } from "@/app/type";

export async function getBackupVaultData(signer:Signer) {
    const managerContract = new ethers.Contract(MANAGER_CONTRACT_ADDRESS,ManagerContratABI,signer); 
    const address = await signer.getAddress(); 
    const vaultAddress = await managerContract.getBackupVault(address); 
    const guardians = await managerContract.getVaultGuardians(vaultAddress);
    const protectList = await managerContract.getVaultProtectList(vaultAddress); 
    const executionPlan = await managerContract.getVaultExecutionPlans(vaultAddress); 
    // populate plan objet 
    let plan = undefined; 
    if(executionPlan)
        plan = {title:executionPlan[0],receiver:executionPlan[1], description: executionPlan[2], status:executionPlan[3].toNumber()}

   const vaultData:VaultData = {vaultAddress:vaultAddress, guardians:guardians, protectList:protectList, executionPlan:plan}; 

   return vaultData; 
    
}

export async function getKeyFragment(vaultAddress:string) {
    
    const managerContract = new ethers.Contract(MANAGER_CONTRACT_ADDRESS,ManagerContratABI,provider); 
    
    const keyFragment = await managerContract.getKeyFragment(vaultAddress); 
    
    return keyFragment; 
}

export async function getBackupVaultMPK(ownerAddress:string) {
    const managerContract = new ethers.Contract(MANAGER_CONTRACT_ADDRESS,ManagerContratABI,provider); 
    const vaultAddress = await managerContract.getBackupVault(ownerAddress); 

    return vaultAddress;
}

export async function registerBackupVault(vaultAddress:string, protectList:string[], guardians:string[],keyFragment:string,signer:Signer) {
    const managerContract = new ethers.Contract(MANAGER_CONTRACT_ADDRESS,ManagerContratABI,signer); 
    console.log(vaultAddress, protectList, guardians, keyFragment);
    const tx = await managerContract.addBackupVault(vaultAddress, protectList,guardians,keyFragment);  
    await tx.wait(); 
}

export async function addPlan(signer:Signer, plan:RecoveryPlan) {
    const managerContract = new ethers.Contract(MANAGER_CONTRACT_ADDRESS,ManagerContratABI,signer); 

    console.log(plan); 
   
    const tx = await managerContract.addPlan(plan.title, plan.receiver,plan.description); 
    await tx.wait(); 
}

export async function executePlan() {
    
}