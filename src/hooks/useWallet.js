// src/hooks/useWallet.js
import { useEffect, useState } from "react";

export function useWallet() {
    const [account, setAccount] = useState(null);
    const [chainId, setChainId] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);

    useEffect(() => {
        if (!window.ethereum) return;

        const handleAccountsChanged = (accounts) => {
            setAccount(accounts.length > 0 ? accounts[0] : null);
        };

        const handleChainChanged = (chainIdHex) => {
            setChainId(parseInt(chainIdHex, 16));
        };

        window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
            if (accounts.length > 0) setAccount(accounts[0]);
        });

        window.ethereum.request({ method: "eth_chainId" }).then((chainIdHex) => {
            setChainId(parseInt(chainIdHex, 16));
        });

        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);

        return () => {
            if (!window.ethereum) return;
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
            window.ethereum.removeListener("chainChanged", handleChainChanged);
        };
    }, []);

    const connect = async () => {
        if (!window.ethereum) {
            alert("No wallet found. Please install MetaMask.");
            return;
        }
        try {
            setIsConnecting(true);
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
            });
            setAccount(accounts[0] || null);
        } finally {
            setIsConnecting(false);
        }
    };

    return { account, chainId, isConnecting, connect };
}
