// src/web3/gmclt.js
import { BrowserProvider, Contract } from "ethers";
import abiJson from "../abi/GMCLandCompensation.json";
import { GMCLT_CONTRACT_ADDRESS } from "../config";

// Get ethers Contract instance connected to the user's wallet (MetaMask)
export async function getGMCLTContract() {
    if (!window.ethereum) {
        throw new Error("No wallet detected. Install MetaMask.");
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    return new Contract(GMCLT_CONTRACT_ADDRESS, abiJson.abi, signer);
}

// Utility to get provider & signer separately if needed
export async function getProviderAndSigner() {
    if (!window.ethereum) {
        throw new Error("No wallet detected. Install MetaMask.");
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    return { provider, signer };
}
