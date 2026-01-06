import { useEffect, useMemo, useState } from "react";
import {
    Search,
    Heart,
    ShoppingCart,
    Clock,
    CheckCircle,
    TrendingUp,
    Eye,
    X,
    AlertCircle,
    DollarSign,
} from "lucide-react";
import { ethers } from "ethers";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../context/ToastContext";

import type { MarketOrderWithPlot } from "../../services/TokenMarketplaceService";
import {
    fetchActiveSellOrders,
    subscribeActiveSellOrders,
    buyFromOrder,
    tokensToNumber,
    ethPerToken,
    computeTotalCostWei,
    formatArea,
} from "../../services/TokenMarketplaceService";

type ListingStatus = "active" | "ending" | "sold";

interface TokenListing {
    id: string; // order id string
    tokenName: string;
    tokenSymbol: string;
    landLocation: string;
    tokenAmount: number; // amountRemaining (human)
    priceEthPerToken: number;
    sellerAddress: string;
    status: ListingStatus;
    endTime: string;
    image: string;
    views: number;
    favorites: number;
    chain: string;
    floorPriceEth: number;
    createdDate: string;
    raw: MarketOrderWithPlot;
}

function shortAddr(a: string) {
    return a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "-";
}

function formatCreated(ts?: number): string {
    if (!ts) return "—";
    const d = new Date(ts * 1000);
    return d.toISOString().slice(0, 10);
}

function seededInt(seed: string, mod: number) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    return (h % mod) + 1;
}

const placeholderImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1487573574614-e3fb3ce596d0?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1516214104703-3805bd312e43?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1460390556991-876809779e60?w=800&h=800&fit=crop",
];

export default function TokenMarketplace() {
    const { showSuccess, showInfo, showError } = useToast();

    const [account, setAccount] = useState<string>("");
    const [orders, setOrders] = useState<MarketOrderWithPlot[]>([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [totalOrders, setTotalOrders] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState<"all" | "active" | "ending" | "sold">("all");
    const [sortBy, setSortBy] = useState<"recent" | "pricelow" | "pricehigh" | "popular">("recent");
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    // Buy modal (real on-chain)
    const [buyModal, setBuyModal] = useState<{ isOpen: boolean; listing: TokenListing | null }>({
        isOpen: false,
        listing: null,
    });
    const [buyAmount, setBuyAmount] = useState(""); // tokens to buy (human)
    const [buyConfirming, setBuyConfirming] = useState(false);

    // Offer modal (simulated)
    const [offerModal, setOfferModal] = useState<{ isOpen: boolean; listing: TokenListing | null }>({
        isOpen: false,
        listing: null,
    });
    const [offerForm, setOfferForm] = useState({ price: "", message: "" });
    const [offerSubmitting, setOfferSubmitting] = useState(false);

    // OPTIONAL: toggle to show ONLY current wallet listings
    const [onlyMine, setOnlyMine] = useState(false);

    useEffect(() => {
        let off: (() => void) | null = null;

        (async () => {
            setLoading(true);
            setErr(null);
            try {
                const data = await fetchActiveSellOrders({
                    maxOrders: 150,
                    includeInactive: true,
                    onlyMine,
                    limit: 50,
                    offset: currentPage * 50,
                });

                setAccount(data.account);
                setOrders(data.orders);
                setTotalOrders(data.total);

                off = await subscribeActiveSellOrders(
                    (next) => {
                        setAccount(next.account);
                        setOrders(next.orders);
                    },
                    { maxOrders: 150, includeInactive: true, onlyMine, limit: 50 }
                );
            } catch (e: any) {
                setErr(e?.message ?? "Failed to load marketplace.");
            } finally {
                setLoading(false);
            }
        })();

        return () => off?.();
    }, [onlyMine, currentPage]);

    const listings: TokenListing[] = useMemo(() => {
        const activeOrders = orders.filter((o) => o.active && o.amountRemaining > 0n);
        const floor =
            activeOrders.length > 0 ? Math.min(...activeOrders.map((o) => ethPerToken(o.pricePerTokenWei))) : 0;

        return orders
            .filter(() => {
                // if inactive, treat as "sold" only when remaining is 0
                // keep both for the filters UI
                return true;
            })
            .map((o) => {
                const price = ethPerToken(o.pricePerTokenWei);
                const remaining = tokensToNumber(o.amountRemaining);

                const seed = `${o.id.toString()}-${o.seller}`;
                const img =
                    placeholderImages[(seededInt(seed, placeholderImages.length) - 1) % placeholderImages.length];

                const plot = o.plot;
                const landLocation = plot
                    ? `${plot.dzongkhag}, ${plot.gewog} • Thram ${plot.thram} • Plot ${plot.plotId}`
                    : "Legacy order (no plot attached)";

                const status: ListingStatus = o.active && o.amountRemaining > 0n ? (remaining < 100 ? "ending" : "active") : "sold";

                return {
                    id: o.id.toString(),
                    tokenName: plot ? `Land Token • ${plot.plotId}` : "GMC Land Token",
                    tokenSymbol: plot ? plot.plotId : "GMCLT",
                    landLocation,
                    tokenAmount: remaining,
                    priceEthPerToken: price,
                    sellerAddress: o.seller,
                    status,
                    endTime: status === "ending" ? "Ending soon" : status === "active" ? "Active" : "Sold",
                    image: img,
                    views: 800 + seededInt(seed, 5000),
                    favorites: 10 + seededInt(seed, 300),
                    chain: "Ethereum",
                    floorPriceEth: Number.isFinite(floor) ? floor : 0,
                    createdDate: formatCreated(o.createdAt),
                    raw: o,
                };
            });
    }, [orders]);

    const filteredListings = useMemo(() => {
        return listings.filter((listing) => {
            const q = searchQuery.toLowerCase().trim();

            const matchesSearch =
                !q ||
                listing.tokenName.toLowerCase().includes(q) ||
                listing.landLocation.toLowerCase().includes(q) ||
                listing.tokenSymbol.toLowerCase().includes(q) ||
                listing.sellerAddress.toLowerCase().includes(q) ||
                (listing.raw.plot?.ownerName?.toLowerCase?.().includes?.(q) ?? false) ||
                (listing.raw.plot?.ownerCid?.toLowerCase?.().includes?.(q) ?? false);

            const matchesFilter = selectedFilter === "all" || listing.status === selectedFilter;
            return matchesSearch && matchesFilter;
        });
    }, [listings, searchQuery, selectedFilter]);

    const sortedListings = useMemo(() => {
        const arr = [...filteredListings];
        switch (sortBy) {
            case "pricelow":
                arr.sort((a, b) => a.priceEthPerToken - b.priceEthPerToken);
                break;
            case "pricehigh":
                arr.sort((a, b) => b.priceEthPerToken - a.priceEthPerToken);
                break;
            case "popular":
                arr.sort((a, b) => b.views - a.views);
                break;
            case "recent":
            default:
                arr.sort((a, b) => Number(b.id) - Number(a.id));
                break;
        }
        return arr;
    }, [filteredListings, sortBy]);

    const toggleFavorite = (id: string) => {
        const next = new Set(favorites);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setFavorites(next);
    };

    const handleBuyNow = (listing: TokenListing) => {
        setBuyAmount("");
        setBuyModal({ isOpen: true, listing });
    };

    const estimatedTotalEth = useMemo(() => {
        const l = buyModal.listing;
        if (!l || !buyAmount) return "0";
        try {
            const amtWei = ethers.parseUnits(buyAmount, 18);
            const totalWei = computeTotalCostWei(BigInt(amtWei), l.raw.pricePerTokenWei);
            return ethers.formatEther(totalWei);
        } catch {
            return "0";
        }
    }, [buyAmount, buyModal.listing]);

    const handleConfirmPurchase = async () => {
        const listing = buyModal.listing;
        if (!listing) return;

        try {
            if (!buyAmount || Number(buyAmount) <= 0) throw new Error("Enter amount to buy > 0");
            if (Number(buyAmount) > listing.tokenAmount) throw new Error("Amount exceeds remaining tokens in this order.");

            setBuyConfirming(true);
            showInfo(`Submitting on-chain buy for ${buyAmount} GMCLT...`);

            const txHash = await buyFromOrder({
                orderId: BigInt(listing.id),
                amountTokens: buyAmount,
            });

            showSuccess(`✅ Purchase complete. Tx: ${txHash}`);
            setBuyModal({ isOpen: false, listing: null });
            setBuyAmount("");
        } catch (e: any) {
            showError(e?.message ?? "Buy failed.");
        } finally {
            setBuyConfirming(false);
        }
    };

    const handleMakeOffer = (listing: TokenListing) => {
        setOfferForm({ price: "", message: "" });
        setOfferModal({ isOpen: true, listing });
    };

    const handleSubmitOffer = async () => {
        if (!offerModal.listing || !offerForm.price) {
            showError("Please enter an offer price");
            return;
        }

        const offerPrice = parseFloat(offerForm.price);
        if (isNaN(offerPrice) || offerPrice <= 0) {
            showError("Please enter a valid price");
            return;
        }

        setOfferSubmitting(true);
        showInfo(`Submitting offer (simulated) of ${offerPrice} ETH...`);

        await new Promise((resolve) => setTimeout(resolve, 900));

        showSuccess("Offer submitted (simulated). Contract has no bid/offer function yet.");
        setOfferSubmitting(false);
        setOfferForm({ price: "", message: "" });
        setOfferModal({ isOpen: false, listing: null });
    };

    const stats = useMemo(() => {
        const active = listings.filter((l) => l.status !== "sold").length;
        const floor = listings.length ? listings.reduce((m, l) => Math.min(m, l.priceEthPerToken), Infinity) : 0;
        const uniqueSellers = new Set(listings.map((l) => l.sellerAddress.toLowerCase())).size;
        return { active, floor, uniqueSellers };
    }, [listings]);

    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Token Marketplace</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        On-chain marketplace (Sell Orders) with plot metadata attached.
                        <br />
                        <span className="text-xs opacity-80">
                            Wallet: {account ? account : "Not connected"} {loading ? " • Loading…" : ""}{" "}
                            {err ? <span className="text-red-400"> • {err}</span> : null}
                        </span>
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setOnlyMine((v) => !v)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${onlyMine ? "bg-primary text-primary-foreground" : "border border-border/40 text-foreground hover:bg-background/30"
                            }`}
                    >
                        {onlyMine ? "My Listings" : "All Listings"}
                    </button>

                    <button
                        onClick={async () => {
                            setLoading(true);
                            setErr(null);
                            try {
                                const data = await fetchActiveSellOrders({
                                    maxOrders: 300,
                                    includeInactive: true,
                                    onlyMine,
                                });
                                setAccount(data.account);
                                setOrders(data.orders);
                            } catch (e: any) {
                                setErr(e?.message ?? "Refresh failed.");
                            } finally {
                                setLoading(false);
                            }
                        }}
                        className="text-primary hover:text-primary/80 font-medium transition-all hover:scale-[1.02] cursor-pointer bg-primary/10 px-4 py-2 rounded-md"
                    >
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {/* STATS BANNER */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg border border-border/40 bg-background/20 backdrop-blur p-4">
                    <p className="text-xs text-muted-foreground font-medium">Active Listings</p>
                    <p className="text-xl font-bold text-foreground mt-1">{stats.active}</p>
                    <p className="text-xs text-muted-foreground mt-1">On-chain active orders</p>
                </div>
                <div className="rounded-lg border border-border/40 bg-background/20 backdrop-blur p-4">
                    <p className="text-xs text-muted-foreground font-medium">Floor Price</p>
                    <p className="text-xl font-bold text-foreground mt-1">
                        {Number.isFinite(stats.floor) && stats.floor !== Infinity ? stats.floor.toFixed(6) : "—"} ETH
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Cheapest active order</p>
                </div>
                <div className="rounded-lg border border-border/40 bg-background/20 backdrop-blur p-4">
                    <p className="text-xs text-muted-foreground font-medium">Unique Sellers</p>
                    <p className="text-xl font-bold text-foreground mt-1">{stats.uniqueSellers}</p>
                    <p className="text-xs text-muted-foreground mt-1">Derived from orders</p>
                </div>
                <div className="rounded-lg border border-border/40 bg-background/20 backdrop-blur p-4">
                    <p className="text-xs text-muted-foreground font-medium">Mode</p>
                    <p className="text-xl font-bold text-foreground mt-1">{onlyMine ? "Mine" : "Public"}</p>
                    <p className="text-xs text-muted-foreground mt-1">Toggle top right</p>
                </div>
            </div>

            {/* SEARCH & FILTERS */}
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search plotId, dzongkhag, owner, seller…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-border/40 bg-background/30 backdrop-blur text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition"
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex gap-2 flex-wrap">
                        {(["all", "active", "ending", "sold"] as const).map((k) => (
                            <button
                                key={k}
                                onClick={() => setSelectedFilter(k)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${selectedFilter === k
                                        ? "bg-primary text-primary-foreground"
                                        : "border border-border/40 text-foreground hover:bg-background/30"
                                    }`}
                            >
                                {k === "all" ? "All" : k === "ending" ? "Ending Soon" : k.charAt(0).toUpperCase() + k.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="ml-auto">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-4 py-2 rounded-lg border border-border/40 bg-background/30 backdrop-blur text-foreground text-sm font-medium focus:outline-none focus:border-primary/50 transition cursor-pointer"
                        >
                            <option value="recent">Recently Listed</option>
                            <option value="pricelow">Price: Low to High</option>
                            <option value="pricehigh">Price: High to Low</option>
                            <option value="popular">Most Viewed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* LISTINGS GRID */}
            {sortedListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedListings.map((listing) => {
                        const plot = listing.raw.plot;

                        return (
                            <div
                                key={listing.id}
                                className="group rounded-xl overflow-hidden border border-border/40 bg-background/20 backdrop-blur hover:bg-background/30 transition shadow-sm hover:shadow-md"
                            >
                                {/* IMAGE */}
                                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                                    <img
                                        src={listing.image}
                                        alt={listing.tokenName}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    />

                                    {/* STATUS BADGE */}
                                    <div className="absolute top-3 left-3">
                                        {listing.status === "active" && (
                                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                                Active
                                            </span>
                                        )}
                                        {listing.status === "ending" && (
                                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                Ending
                                            </span>
                                        )}
                                        {listing.status === "sold" && (
                                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-300 border border-slate-500/30 flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" />
                                                Sold
                                            </span>
                                        )}
                                    </div>

                                    {/* FAVORITE */}
                                    <button
                                        onClick={() => toggleFavorite(listing.id)}
                                        className="absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background transition"
                                    >
                                        <Heart
                                            className={`w-5 h-5 transition ${favorites.has(listing.id) ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-500"
                                                }`}
                                        />
                                    </button>

                                    {/* STATS OVERLAY */}
                                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex gap-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Eye className="w-4 h-4" />
                                            {listing.views.toLocaleString()}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Heart className="w-4 h-4" />
                                            {listing.favorites}
                                        </div>
                                    </div>
                                </div>

                                {/* CONTENT */}
                                <div className="p-4 space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition">
                                            {listing.tokenName}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-1">{listing.landLocation}</p>

                                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                                            <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">
                                                {listing.tokenSymbol}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {listing.tokenAmount.toLocaleString()} tokens remaining
                                            </span>
                                            {plot?.exists ? (
                                                <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                                                    Plot verified
                                                </span>
                                            ) : (
                                                <span className="text-xs px-2 py-1 rounded bg-orange-500/10 text-orange-300 border border-orange-500/20">
                                                    Legacy / No-plot
                                                </span>
                                            )}
                                        </div>

                                        {/* PLOT DETAILS (NOW REAL) */}
                                        {plot?.exists ? (
                                            <div className="text-xs text-muted-foreground mt-3 space-y-1 rounded-lg border border-border/20 bg-background/30 p-3">
                                                <div className="flex justify-between gap-3">
                                                    <span>Owner</span>
                                                    <span className="text-foreground/90 truncate" title={plot.ownerName}>
                                                        {plot.ownerName || "—"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between gap-3">
                                                    <span>CID</span>
                                                    <span className="text-foreground/90">{plot.ownerCid || "—"}</span>
                                                </div>
                                                <div className="flex justify-between gap-3">
                                                    <span>Ownership</span>
                                                    <span className="text-foreground/90">{plot.ownType || "—"}</span>
                                                </div>
                                                <div className="flex justify-between gap-3">
                                                    <span>Category</span>
                                                    <span className="text-foreground/90">{plot.majorCategory || "—"}</span>
                                                </div>
                                                <div className="flex justify-between gap-3">
                                                    <span>Land Type</span>
                                                    <span className="text-foreground/90">{plot.landType || "—"}</span>
                                                </div>
                                                <div className="flex justify-between gap-3">
                                                    <span>Plot Class</span>
                                                    <span className="text-foreground/90">{plot.plotClass || "—"}</span>
                                                </div>
                                                <div className="flex justify-between gap-3">
                                                    <span>Area</span>
                                                    <span className="text-foreground/90">{formatArea(plot)}</span>
                                                </div>
                                                <div className="flex justify-between gap-3">
                                                    <span>Per Decimal</span>
                                                    <span className="text-foreground/90">{plot.landValue.toString()}</span>
                                                </div>
                                                <div className="flex justify-between gap-3">
                                                    <span>Allocated</span>
                                                    <span className="text-foreground/90">
                                                        {tokensToNumber(plot.allocatedTokens).toLocaleString()} GMCLT
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-xs text-muted-foreground mt-3 rounded-lg border border-border/20 bg-background/30 p-3">
                                                This sell order was created without plotId (older order). Create new ones using{" "}
                                                <span className="font-semibold">createSellOrderForPlot(plotId, amount, priceWei)</span>.
                                            </div>
                                        )}
                                    </div>

                                    {/* PRICE */}
                                    <div className="space-y-2 pt-2 border-t border-border/20">
                                        <div className="flex items-baseline justify-between">
                                            <span className="text-xs text-muted-foreground">Price per token</span>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-foreground">{listing.priceEthPerToken.toFixed(6)} TER</p>
                                                <p className="text-xs text-muted-foreground">Floor: {listing.floorPriceEth.toFixed(6)} TER</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* TIME + META */}
                                    <div className="text-xs text-muted-foreground flex items-center justify-between">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {listing.endTime}
                                        </span>
                                        <span>Listed: {listing.createdDate}</span>
                                    </div>

                                    {/* SELLER */}
                                    <div className="text-xs text-muted-foreground px-3 py-2 rounded bg-background/30 border border-border/20">
                                        Seller: {shortAddr(listing.sellerAddress)}
                                    </div>

                                    {/* ACTIONS */}
                                    <div className="flex gap-2 pt-2">
                                        {listing.status !== "sold" ? (
                                            <>
                                                <Button onClick={() => handleBuyNow(listing)} className="flex-1 gap-2 py-2 text-sm">
                                                    <ShoppingCart className="w-4 h-4" />
                                                    Buy Now
                                                </Button>

                                                <button
                                                    onClick={() => handleMakeOffer(listing)}
                                                    className="flex-1 px-3 py-2 text-sm border border-border/40 rounded-md text-foreground hover:bg-background/30 transition"
                                                >
                                                    Make Offer
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                className="w-full px-4 py-2 text-sm border border-border/40 rounded-md text-foreground hover:bg-background/30 transition cursor-not-allowed opacity-50"
                                                disabled
                                            >
                                                Sold Out
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-16">
                    <TrendingUp className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">{loading ? "Loading listings…" : "No listings found."}</p>
                </div>
            )}

            {/* PAGINATION */}
            {sortedListings.length > 0 && (
                <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-border/40">
                    <p className="text-sm text-muted-foreground">
                        Showing {currentPage * 50 + 1} - {Math.min((currentPage + 1) * 50, totalOrders)} of {totalOrders} orders
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                            disabled={currentPage === 0 || loading}
                            className="px-4 py-2 rounded-lg text-sm font-medium border border-border/40 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background/30 transition"
                        >
                            ← Previous
                        </button>
                        <span className="px-4 py-2 text-sm text-muted-foreground">
                            Page {currentPage + 1} of {Math.ceil(totalOrders / 50) || 1}
                        </span>
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={(currentPage + 1) * 50 >= totalOrders || loading}
                            className="px-4 py-2 rounded-lg text-sm font-medium border border-border/40 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background/30 transition"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            )}

            {/* BUY NOW MODAL (REAL BUY) */}
            {buyModal.isOpen && buyModal.listing && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-background border border-border/40 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">
                        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border/20 bg-background">
                            <h2 className="text-lg font-bold text-foreground">Buy GMCLT</h2>
                            <button
                                onClick={() => setBuyModal({ isOpen: false, listing: null })}
                                className="p-1 hover:bg-background/30 rounded-md transition"
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="relative h-40 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                                <img src={buyModal.listing.image} alt={buyModal.listing.tokenName} className="w-full h-full object-cover" />
                            </div>

                            {/* PLOT DETAILS IN MODAL */}
                            {buyModal.listing.raw.plot?.exists ? (
                                <div className="rounded-lg border border-border/20 bg-background/30 p-4 space-y-2">
                                    <p className="text-sm font-semibold text-foreground">
                                        Plot {buyModal.listing.raw.plot.plotId}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {buyModal.listing.raw.plot.dzongkhag}, {buyModal.listing.raw.plot.gewog} • Thram{" "}
                                        {buyModal.listing.raw.plot.thram}
                                    </p>
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Land Type</span>
                                        <span className="text-foreground/90">{buyModal.listing.raw.plot.landType}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Plot Class</span>
                                        <span className="text-foreground/90">{buyModal.listing.raw.plot.plotClass}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Area</span>
                                        <span className="text-foreground/90">{formatArea(buyModal.listing.raw.plot)}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-lg border border-border/20 bg-background/30 p-4 text-xs text-muted-foreground">
                                    Legacy order: no plot attached.
                                </div>
                            )}

                            <div className="space-y-2">
                                <p className="text-sm font-semibold text-foreground">{buyModal.listing.tokenName}</p>
                                <p className="text-xs text-muted-foreground">Order #{buyModal.listing.id}</p>

                                <div className="rounded-lg border border-border/20 bg-background/30 p-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Seller</span>
                                        <span className="font-semibold">{shortAddr(buyModal.listing.sellerAddress)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Price / token</span>
                                        <span className="font-semibold">{buyModal.listing.priceEthPerToken.toFixed(6)} TER</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Remaining</span>
                                        <span className="font-semibold">{buyModal.listing.tokenAmount.toLocaleString()} GMCLT</span>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <Label className="text-sm font-semibold">Amount to buy (GMCLT)</Label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 10"
                                        value={buyAmount}
                                        onChange={(e) => setBuyAmount(e.target.value)}
                                        min="0"
                                    />
                                    <div className="text-xs text-muted-foreground flex justify-between">
                                        <span>Estimated total</span>
                                        <span className="font-semibold">{estimatedTotalEth} TER</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                                <div className="text-xs">
                                    <p className="text-blue-300 font-medium">On-chain purchase</p>
                                    <p className="text-blue-200 mt-1">
                                        Calls <span className="font-semibold">buyFromOrder(orderId, amountToBuy)</span> with ETH value.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 flex gap-2 p-6 border-t border-border/20 bg-background">
                            <button
                                onClick={() => setBuyModal({ isOpen: false, listing: null })}
                                className="flex-1 px-4 py-2 rounded-lg border border-border/40 text-foreground hover:bg-background/30 transition font-medium"
                            >
                                Cancel
                            </button>
                            <Button onClick={handleConfirmPurchase} isLoading={buyConfirming} className="flex-1 gap-2">
                                <DollarSign className="w-4 h-4" />
                                Confirm Buy
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* MAKE OFFER MODAL (SIMULATED) */}
            {offerModal.isOpen && offerModal.listing && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-background border border-border/40 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">
                        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border/20 bg-background">
                            <h2 className="text-lg font-bold text-foreground">Make an Offer (Simulated)</h2>
                            <button
                                onClick={() => setOfferModal({ isOpen: false, listing: null })}
                                className="p-1 hover:bg-background/30 rounded-md transition"
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="flex items-center gap-3 p-4 rounded-lg bg-background/30 border border-border/20">
                                <img src={offerModal.listing.image} alt={offerModal.listing.tokenName} className="w-16 h-16 rounded-lg object-cover" />
                                <div>
                                    <h3 className="font-semibold text-foreground text-sm">{offerModal.listing.tokenName}</h3>
                                    <p className="text-xs text-muted-foreground">{offerModal.listing.tokenSymbol}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Order #{offerModal.listing.id}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Listed Price</p>
                                <div className="p-3 rounded-lg bg-background/30 border border-border/20">
                                    <p className="text-2xl font-bold text-foreground">{offerModal.listing.priceEthPerToken.toFixed(6)} ETH</p>
                                    <p className="text-xs text-muted-foreground mt-1">Floor: {offerModal.listing.floorPriceEth.toFixed(6)} ETH</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="offer-price" className="text-sm font-semibold">
                                    Your Offer Price (ETH per token)
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="offer-price"
                                        type="number"
                                        placeholder="Enter offer price"
                                        value={offerForm.price}
                                        onChange={(e) => setOfferForm({ ...offerForm, price: e.target.value })}
                                        step="0.000001"
                                        min="0"
                                        className="pr-12"
                                    />
                                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground font-medium">
                                        ETH
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="offer-message" className="text-sm font-semibold">
                                    Message (Optional)
                                </Label>
                                <textarea
                                    id="offer-message"
                                    placeholder="Add a message to the seller..."
                                    value={offerForm.message}
                                    onChange={(e) => setOfferForm({ ...offerForm, message: e.target.value })}
                                    rows={3}
                                    maxLength={300}
                                    className="w-full px-3 py-2 rounded-lg border border-border/40 bg-background/30 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition text-sm resize-none"
                                />
                                <p className="text-xs text-muted-foreground text-right">{offerForm.message.length}/300</p>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                                <AlertCircle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                                <div className="text-xs">
                                    <p className="text-orange-300 font-medium">Note</p>
                                    <p className="text-orange-200 mt-1">Your contract does not support bids/offers yet. This is UI-only.</p>
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 flex gap-2 p-6 border-t border-border/20 bg-background">
                            <button
                                onClick={() => setOfferModal({ isOpen: false, listing: null })}
                                className="flex-1 px-4 py-2 rounded-lg border border-border/40 text-foreground hover:bg-background/30 transition font-medium"
                            >
                                Cancel
                            </button>
                            <Button onClick={handleSubmitOffer} isLoading={offerSubmitting} className="flex-1">
                                Submit Offer
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
