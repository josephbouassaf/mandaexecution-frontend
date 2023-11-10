import {ethers} from 'ethers'; 
import Moralis from 'moralis';

const rpcURL = "https://sepolia.infura.io/v3/9dca3d6945ad4cc4a18741bf02b4e44e";
export const MANAGER_CONTRACT_ADDRESS = '0x2693A7c29173A006c4256E7Ff77D83Cb4e895eEE'; 
export const KEY_SHARE_THRESHOLD = 99; 
export const MORALIS_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjBkZTNmMTNjLWZkZDItNDQ0Zi04YmY5LTFmNzZjNjkwZGYyYyIsIm9yZ0lkIjoiMzYyNzI4IiwidXNlcklkIjoiMzcyNzk0IiwidHlwZUlkIjoiNmRmYjk3MmQtODBkNC00M2I0LTkyODQtNWFlN2E1ZjJiZWZhIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTg2ODIwODgsImV4cCI6NDg1NDQ0MjA4OH0.ZEzZ0J64En2OjterONSfzZewWoqdQp_4GEW7AlSfPx8";
export const MASTER_KEY = 'bd8e712fc0101504598acc2bf743b2baaea173ab8e49bef62088a6514fa085c3'; 
export const provider: ethers.providers.JsonRpcProvider =  new ethers.providers.JsonRpcProvider(rpcURL); 

const runApp = async () => {
    if(!Moralis.Core.isStarted)
        await Moralis.start({
        apiKey: MORALIS_API_KEY,
        });
}

runApp(); 

