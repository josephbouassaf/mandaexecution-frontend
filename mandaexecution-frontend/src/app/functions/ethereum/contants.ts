import {ethers} from 'ethers'; 
import Moralis from 'moralis';

const rpcURL = "https://sepolia.infura.io/v3/9dca3d6945ad4cc4a18741bf02b4e44e";
export const MANAGER_CONTRACT_ADDRESS = '0xc5B0aE6Af51Aa0401a8c49657fe34a77f6Fb7A49'; 
export const KEY_SHARE_THRESHOLD = 99; 
export const MORALIS_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjBkZTNmMTNjLWZkZDItNDQ0Zi04YmY5LTFmNzZjNjkwZGYyYyIsIm9yZ0lkIjoiMzYyNzI4IiwidXNlcklkIjoiMzcyNzk0IiwidHlwZUlkIjoiNmRmYjk3MmQtODBkNC00M2I0LTkyODQtNWFlN2E1ZjJiZWZhIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTg2ODIwODgsImV4cCI6NDg1NDQ0MjA4OH0.ZEzZ0J64En2OjterONSfzZewWoqdQp_4GEW7AlSfPx8";

export const provider: ethers.providers.JsonRpcProvider =  new ethers.providers.JsonRpcProvider(rpcURL); 

const runApp = async () => {
    if(!Moralis.Core.isStarted)
        await Moralis.start({
        apiKey: MORALIS_API_KEY,
        });
}

runApp(); 

