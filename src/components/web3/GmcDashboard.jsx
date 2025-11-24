// src/components/GmcDashboard.jsx
import React, { useEffect, useState } from "react";
import { formatEther, formatUnits, parseEther, parseUnits } from "ethers";
import { getGMCLTContract } from "../web3/gmclt";

export default function GmcDashboard({ account }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [info, setInfo] = useState(null);

    // Sell order form
    const [sellAmount, setSellAmount] = useState("100");
    const [sellPriceEth, setSellPriceEth] = useState("0.01");

    // Buy form
    const [orderIdToBuy, setOrderIdToBuy] = useState("1");
    const [buyAmount, setBuyAmount] = useState("100");

    const [txStatus, setTxStatus] = useState("");

    useEffect(() => {
        if (!account) return;
        loadInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account]);

    async function loadInfo() {
        try {
            setLoading(true);
            setError("");
            const contract = await getGMCLTContract();
            const result = await contract.getMyInfo();

            const tokenBalance = result[0];
            const totalEarned = result[1];
            const plotIds = result[2];
            const plots = result[3];

            setInfo({
                tokenBalance,
                totalEarned,
                plotIds,
                plots
            });
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to load info");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateSellOrder(e) {
        e.preventDefault();
        try {
            setTxStatus("Creating sell order...");
            const contract = await getGMCLTContract();

            const amount = parseUnits(sellAmount, 18);
            const pricePerTokenWei = parseEther(sellPriceEth); // 0.01 ETH per token, etc.

            const tx = await contract.createSellOrder(amount, pricePerTokenWei);
            await tx.wait();

            setTxStatus("Sell order created.");
            await loadInfo();
        } catch (err) {
            console.error(err);
            setTxStatus(`Error: ${err.message || "Failed to create order"}`);
        }
    }

    async function handleBuyFromOrder(e) {
        e.preventDefault();
        try {
            setTxStatus("Buying from order...");
            const contract = await getGMCLTContract();

            const amount = parseUnits(buyAmount, 18);

            // TOTAL COST = amount * pricePerTokenWei / 1e18
            const order = await contract.sellOrders(orderIdToBuy);
            const pricePerTokenWei = order.pricePerTokenWei;

            const totalCostWei = (amount * pricePerTokenWei) / 10n ** 18n;

            const tx = await contract.buyFromOrder(orderIdToBuy, amount, {
                value: totalCostWei
            });
            await tx.wait();

            setTxStatus("Buy completed.");
            await loadInfo();
        } catch (err) {
            console.error(err);
            setTxStatus(`Error: ${err.message || "Failed to buy"}`);
        }
    }

    if (!account) {
        return <p>Please connect your wallet to view your GMC dashboard.</p>;
    }

    return (
        <div className="dashboard">
            <h2>GMC Land Token Dashboard</h2>

            {loading && <p>Loading your data...</p>}
            {error && <p className="error">{error}</p>}

            {info && (
                <>
                    <section className="card">
                        <h3>Your Token Summary</h3>
                        <p>
                            <strong>GMCLT Balance:</strong>{" "}
                            {formatUnits(info.tokenBalance, 18)} GMCLT
                        </p>
                        <p>
                            <strong>Total Earned from Sales:</strong>{" "}
                            {formatEther(info.totalEarned)} ETH
                        </p>
                    </section>

                    <section className="card">
                        <h3>Your Land Plots</h3>
                        {info.plots.length === 0 ? (
                            <p>No plots registered for this wallet.</p>
                        ) : (
                            <table className="plots-table">
                                <thead>
                                    <tr>
                                        <th>Plot ID</th>
                                        <th>Dzongkhag</th>
                                        <th>Gewog</th>
                                        <th>Thram</th>
                                        <th>Owner</th>
                                        <th>Area (ac * 1e4)</th>
                                        <th>Allocated GMCLT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {info.plots.map((p, idx) => (
                                        <tr key={idx}>
                                            <td>{p.plotId}</td>
                                            <td>{p.dzongkhag}</td>
                                            <td>{p.gewog}</td>
                                            <td>{p.thram}</td>
                                            <td>{p.ownerName}</td>
                                            <td>{p.areaAc.toString()}</td>
                                            <td>{formatUnits(p.allocatedTokens, 18)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </section>
                </>
            )}

            <section className="card">
                <h3>Create Sell Order</h3>
                <form onSubmit={handleCreateSellOrder} className="form-grid">
                    <label>
                        Amount (GMCLT)
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={sellAmount}
                            onChange={(e) => setSellAmount(e.target.value)}
                        />
                    </label>
                    <label>
                        Price per token (ETH)
                        <input
                            type="number"
                            min="0"
                            step="0.0001"
                            value={sellPriceEth}
                            onChange={(e) => setSellPriceEth(e.target.value)}
                        />
                    </label>
                    <button type="submit">Create Sell Order</button>
                </form>
            </section>

            <section className="card">
                <h3>Buy from Sell Order</h3>
                <form onSubmit={handleBuyFromOrder} className="form-grid">
                    <label>
                        Order ID
                        <input
                            type="number"
                            min="1"
                            value={orderIdToBuy}
                            onChange={(e) => setOrderIdToBuy(e.target.value)}
                        />
                    </label>
                    <label>
                        Amount to Buy (GMCLT)
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={buyAmount}
                            onChange={(e) => setBuyAmount(e.target.value)}
                        />
                    </label>
                    <button type="submit">Buy</button>
                </form>
            </section>

            {txStatus && <p className="status">{txStatus}</p>}
        </div>
    );
}
