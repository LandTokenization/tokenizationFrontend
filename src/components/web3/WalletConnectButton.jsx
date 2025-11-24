// src/components/WalletConnectButton.jsx

export default function WalletConnectButton({ account, isConnecting, onConnect }) {
    if (account) {
        return (
            <button
                className="wallet-btn"
                type="button"
                disabled
            >
                Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </button>
        );
    }

    return (
        <button
            className="wallet-btn"
            type="button"
            onClick={onConnect}
            disabled={isConnecting}
        >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
    );
}
