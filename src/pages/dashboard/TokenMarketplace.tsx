import { useState } from 'react';
import { Search, Heart, ShoppingCart, Clock, CheckCircle, TrendingUp, Eye, X, AlertCircle, DollarSign } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useToast } from '../../context/ToastContext';

interface TokenListing {
    id: string;
    tokenName: string;
    tokenSymbol: string;
    landLocation: string;
    tokenAmount: number;
    price: number;
    currency: string;
    seller: string;
    sellerAddress: string;
    status: 'active' | 'ending' | 'sold';
    endTime: string;
    image: string;
    views: number;
    favorites: number;
    chain: string;
    floorPrice: number;
    createdDate: string;
}

const mockListings: TokenListing[] = [
    {
        id: '1',
        tokenName: 'Gelephu Land Token',
        tokenSymbol: 'GLT-001',
        landLocation: 'Gelephu Thromde, Plot GT1-747',
        tokenAmount: 5000,
        price: 15.2,
        currency: 'BTN',
        seller: 'Yeshi G.',
        sellerAddress: '0x1234...5678',
        status: 'active',
        endTime: '2 hours left',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop',
        views: 1234,
        favorites: 45,
        chain: 'Ethereum',
        floorPrice: 14.9,
        createdDate: '2 days ago'
    },
    {
        id: '2',
        tokenName: 'Sarpang Rural Land Token',
        tokenSymbol: 'SRT-002',
        landLocation: 'Sarpang, Thram 63',
        tokenAmount: 2000,
        price: 12.5,
        currency: 'BTN',
        seller: 'Tandy W.',
        sellerAddress: '0x9876...4321',
        status: 'active',
        endTime: '5 hours left',
        image: 'https://images.unsplash.com/photo-1487573574614-e3fb3ce596d0?w=500&h=500&fit=crop',
        views: 892,
        favorites: 32,
        chain: 'Ethereum',
        floorPrice: 12.0,
        createdDate: '1 day ago'
    },
    {
        id: '3',
        tokenName: 'Samtenling Estate Token',
        tokenSymbol: 'SET-003',
        landLocation: 'Sarpang, Samtenling, Thram 120',
        tokenAmount: 3500,
        price: 18.75,
        currency: 'BTN',
        seller: 'Tashi W.',
        sellerAddress: '0x5555...6666',
        status: 'active',
        endTime: '8 hours left',
        image: 'https://images.unsplash.com/photo-1516214104703-3805bd312e43?w=500&h=500&fit=crop',
        views: 2156,
        favorites: 78,
        chain: 'Ethereum',
        floorPrice: 17.5,
        createdDate: '3 days ago'
    },
    {
        id: '4',
        tokenName: 'Dekiling Land Token',
        tokenSymbol: 'DLT-004',
        landLocation: 'Sarpang, Dekiling, Thram 863',
        tokenAmount: 4200,
        price: 16.3,
        currency: 'BTN',
        seller: 'Karma D.',
        sellerAddress: '0x7777...8888',
        status: 'ending',
        endTime: '30 minutes left',
        image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=500&h=500&fit=crop',
        views: 3421,
        favorites: 125,
        chain: 'Ethereum',
        floorPrice: 15.8,
        createdDate: '5 days ago'
    },
    {
        id: '5',
        tokenName: 'Urban Village Token',
        tokenSymbol: 'UVT-005',
        landLocation: 'Gelephu, Urban Village 2',
        tokenAmount: 6000,
        price: 20.1,
        currency: 'BTN',
        seller: 'Pema T.',
        sellerAddress: '0x9999...0000',
        status: 'sold',
        endTime: 'Sold 3 hours ago',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=500&fit=crop',
        views: 5612,
        favorites: 234,
        chain: 'Ethereum',
        floorPrice: 19.5,
        createdDate: '1 week ago'
    },
    {
        id: '6',
        tokenName: 'Commercial Land Token',
        tokenSymbol: 'CLT-006',
        landLocation: 'Thimphu, Commercial Zone',
        tokenAmount: 8000,
        price: 22.5,
        currency: 'BTN',
        seller: 'Dorji L.',
        sellerAddress: '0xaaaa...bbbb',
        status: 'active',
        endTime: '12 hours left',
        image: 'https://images.unsplash.com/photo-1460390556991-876809779e60?w=500&h=500&fit=crop',
        views: 1876,
        favorites: 92,
        chain: 'Ethereum',
        floorPrice: 21.0,
        createdDate: '4 days ago'
    },
];

export default function TokenMarketplace() {
    const { showSuccess, showInfo, showError } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'ending' | 'sold'>('all');
    const [sortBy, setSortBy] = useState<'recent' | 'pricelow' | 'pricehigh' | 'popular'>('recent');
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    // Modal states
    const [buyModal, setBuyModal] = useState<{ isOpen: boolean; listing: TokenListing | null }>({
        isOpen: false,
        listing: null,
    });
    const [offerModal, setOfferModal] = useState<{ isOpen: boolean; listing: TokenListing | null }>({
        isOpen: false,
        listing: null,
    });
    const [offerForm, setOfferForm] = useState({
        price: '',
        message: '',
    });
    const [buyConfirming, setBuyConfirming] = useState(false);
    const [offerSubmitting, setOfferSubmitting] = useState(false);

    const filteredListings = mockListings.filter(listing => {
        const matchesSearch = listing.tokenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listing.landLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listing.tokenSymbol.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesFilter = selectedFilter === 'all' || listing.status === selectedFilter;
        
        return matchesSearch && matchesFilter;
    });

    const sortedListings = [...filteredListings].sort((a, b) => {
        switch (sortBy) {
            case 'pricelow':
                return a.price - b.price;
            case 'pricehigh':
                return b.price - a.price;
            case 'popular':
                return b.views - a.views;
            case 'recent':
            default:
                return 0;
        }
    });

    const toggleFavorite = (id: string) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(id)) {
            newFavorites.delete(id);
        } else {
            newFavorites.add(id);
        }
        setFavorites(newFavorites);
    };

    const handleBuyNow = (listing: TokenListing) => {
        setBuyModal({ isOpen: true, listing });
    };

    const handleConfirmPurchase = async () => {
        if (!buyModal.listing) return;
        
        setBuyConfirming(true);
        showInfo(`Processing purchase of ${buyModal.listing.tokenName}...`);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        showSuccess(
            `🎉 Successfully purchased ${buyModal.listing.tokenAmount} tokens of ${buyModal.listing.tokenSymbol}! Transaction confirmed.`
        );
        setBuyConfirming(false);
        setBuyModal({ isOpen: false, listing: null });
    };

    const handleMakeOffer = (listing: TokenListing) => {
        setOfferForm({ price: '', message: '' });
        setOfferModal({ isOpen: true, listing });
    };

    const handleSubmitOffer = async () => {
        if (!offerModal.listing || !offerForm.price) {
            showError('Please enter an offer price');
            return;
        }

        const offerPrice = parseFloat(offerForm.price);
        if (isNaN(offerPrice) || offerPrice <= 0) {
            showError('Please enter a valid price');
            return;
        }

        setOfferSubmitting(true);
        showInfo(`Submitting offer of ${offerPrice} BTN for ${offerModal.listing.tokenName}...`);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        showSuccess(
            `Offer submitted! Your offer of ${offerPrice} BTN for ${offerModal.listing.tokenSymbol} has been sent to the seller. Waiting for response...`
        );
        setOfferSubmitting(false);
        setOfferForm({ price: '', message: '' });
        setOfferModal({ isOpen: false, listing: null });
    };

    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Token Marketplace</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Buy and sell land-backed tokens. All transactions are simulated for demo purposes.
                </p>
            </div>

            {/* STATS BANNER */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg border border-border/40 bg-background/20 backdrop-blur p-4">
                    <p className="text-xs text-muted-foreground font-medium">Total Volume</p>
                    <p className="text-xl font-bold text-foreground mt-1">2,450 BTN</p>
                    <p className="text-xs text-emerald-400 mt-1">+12.5% today</p>
                </div>
                <div className="rounded-lg border border-border/40 bg-background/20 backdrop-blur p-4">
                    <p className="text-xs text-muted-foreground font-medium">Floor Price</p>
                    <p className="text-xl font-bold text-foreground mt-1">12.0 BTN</p>
                    <p className="text-xs text-red-400 mt-1">-2.3% last 24h</p>
                </div>
                <div className="rounded-lg border border-border/40 bg-background/20 backdrop-blur p-4">
                    <p className="text-xs text-muted-foreground font-medium">Active Listings</p>
                    <p className="text-xl font-bold text-foreground mt-1">128</p>
                    <p className="text-xs text-muted-foreground mt-1">5 new today</p>
                </div>
                <div className="rounded-lg border border-border/40 bg-background/20 backdrop-blur p-4">
                    <p className="text-xs text-muted-foreground font-medium">Unique Holders</p>
                    <p className="text-xl font-bold text-foreground mt-1">342</p>
                    <p className="text-xs text-emerald-400 mt-1">+8 this week</p>
                </div>
            </div>

            {/* SEARCH & FILTERS */}
            <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search tokens, locations, or land IDs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-border/40 bg-background/30 backdrop-blur text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition"
                    />
                </div>

                {/* Filter & Sort Controls */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Status Filter */}
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setSelectedFilter('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                selectedFilter === 'all'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'border border-border/40 text-foreground hover:bg-background/30'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setSelectedFilter('active')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                selectedFilter === 'active'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'border border-border/40 text-foreground hover:bg-background/30'
                            }`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setSelectedFilter('ending')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                selectedFilter === 'ending'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'border border-border/40 text-foreground hover:bg-background/30'
                            }`}
                        >
                            Ending Soon
                        </button>
                        <button
                            onClick={() => setSelectedFilter('sold')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                selectedFilter === 'sold'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'border border-border/40 text-foreground hover:bg-background/30'
                            }`}
                        >
                            Sold
                        </button>
                    </div>

                    {/* Sort Dropdown */}
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
                    {sortedListings.map((listing) => (
                        <div
                            key={listing.id}
                            className="group rounded-xl overflow-hidden border border-border/40 bg-background/20 backdrop-blur hover:bg-background/30 transition shadow-sm hover:shadow-md"
                        >
                            {/* CARD IMAGE */}
                            <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                                <img
                                    src={listing.image}
                                    alt={listing.tokenName}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                                
                                {/* STATUS BADGE */}
                                <div className="absolute top-3 left-3">
                                    {listing.status === 'active' && (
                                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                            Active
                                        </span>
                                    )}
                                    {listing.status === 'ending' && (
                                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            Ending
                                        </span>
                                    )}
                                    {listing.status === 'sold' && (
                                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-300 border border-slate-500/30 flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" />
                                            Sold
                                        </span>
                                    )}
                                </div>

                                {/* FAVORITE BUTTON */}
                                <button
                                    onClick={() => toggleFavorite(listing.id)}
                                    className="absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background transition"
                                >
                                    <Heart
                                        className={`w-5 h-5 transition ${
                                            favorites.has(listing.id)
                                                ? 'fill-red-500 text-red-500'
                                                : 'text-muted-foreground hover:text-red-500'
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

                            {/* CARD CONTENT */}
                            <div className="p-4 space-y-4">
                                {/* TOKEN INFO */}
                                <div>
                                    <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition">
                                        {listing.tokenName}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {listing.landLocation}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">
                                            {listing.tokenSymbol}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {listing.tokenAmount.toLocaleString()} tokens
                                        </span>
                                    </div>
                                </div>

                                {/* PRICE INFO */}
                                <div className="space-y-2 pt-2 border-t border-border/20">
                                    <div className="flex items-baseline justify-between">
                                        <span className="text-xs text-muted-foreground">Current Price</span>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-foreground">
                                                {listing.price} {listing.currency}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Floor: {listing.floorPrice} {listing.currency}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* TIME LEFT */}
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {listing.endTime}
                                </div>

                                {/* SELLER INFO */}
                                <div className="text-xs text-muted-foreground px-3 py-2 rounded bg-background/30 border border-border/20">
                                    Seller: {listing.seller} • {listing.sellerAddress}
                                </div>

                                {/* ACTION BUTTONS */}
                                <div className="flex gap-2 pt-2">
                                    {listing.status !== 'sold' ? (
                                        <>
                                            <Button
                                                onClick={() => handleBuyNow(listing)}
                                                className="flex-1 gap-2 py-2 text-sm"
                                            >
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
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <TrendingUp className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">No listings found matching your criteria.</p>
                </div>
            )}

            {/* PAGINATION PLACEHOLDER */}
            <div className="flex justify-center gap-2 pt-8">
                <button className="px-3 py-2 rounded-lg border border-border/40 text-muted-foreground hover:bg-background/30 transition disabled:opacity-50" disabled>
                    Previous
                </button>
                <button className="px-3 py-2 rounded-lg bg-primary text-primary-foreground">1</button>
                <button className="px-3 py-2 rounded-lg border border-border/40 text-foreground hover:bg-background/30 transition">2</button>
                <button className="px-3 py-2 rounded-lg border border-border/40 text-foreground hover:bg-background/30 transition">3</button>
                <button className="px-3 py-2 rounded-lg border border-border/40 text-foreground hover:bg-background/30 transition">
                    Next
                </button>
            </div>

            {/* BUY NOW MODAL */}
            {buyModal.isOpen && buyModal.listing && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-background border border-border/40 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">
                        {/* Header */}
                        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border/20 bg-background">
                            <h2 className="text-lg font-bold text-foreground">Purchase Token</h2>
                            <button
                                onClick={() => setBuyModal({ isOpen: false, listing: null })}
                                className="p-1 hover:bg-background/30 rounded-md transition"
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Token Image */}
                            <div className="relative h-48 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                                <img
                                    src={buyModal.listing.image}
                                    alt={buyModal.listing.tokenName}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Token Details */}
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-muted-foreground">Token Name</p>
                                    <p className="text-lg font-semibold text-foreground">{buyModal.listing.tokenName}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">Land Location</p>
                                    <p className="text-sm text-foreground">{buyModal.listing.landLocation}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/20">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Token Symbol</p>
                                        <p className="text-sm font-medium text-foreground">{buyModal.listing.tokenSymbol}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Amount</p>
                                        <p className="text-sm font-medium text-foreground">
                                            {buyModal.listing.tokenAmount.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-2 p-4 rounded-lg bg-background/30 border border-border/20">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Price per Token:</span>
                                    <span className="text-foreground font-medium">
                                        {buyModal.listing.price} {buyModal.listing.currency}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Total Tokens:</span>
                                    <span className="text-foreground font-medium">
                                        {buyModal.listing.tokenAmount.toLocaleString()}
                                    </span>
                                </div>
                                <div className="h-px bg-border/20 my-2"></div>
                                <div className="flex items-center justify-between">
                                    <span className="text-foreground font-semibold">Total Cost:</span>
                                    <span className="text-xl font-bold text-primary">
                                        {(buyModal.listing.price * buyModal.listing.tokenAmount).toLocaleString()} {buyModal.listing.currency}
                                    </span>
                                </div>
                            </div>

                            {/* Floor Price Info */}
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                                <div className="text-xs">
                                    <p className="text-blue-300 font-medium">Market Info</p>
                                    <p className="text-blue-200 mt-1">
                                        Floor price: {buyModal.listing.floorPrice} {buyModal.listing.currency}
                                    </p>
                                </div>
                            </div>

                            {/* Seller Info */}
                            <div className="text-xs text-muted-foreground px-3 py-2 rounded bg-background/30 border border-border/20">
                                <p className="font-medium">Seller</p>
                                <p className="mt-1">{buyModal.listing.seller}</p>
                                <p className="text-xs opacity-75">{buyModal.listing.sellerAddress}</p>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="sticky bottom-0 flex gap-2 p-6 border-t border-border/20 bg-background">
                            <button
                                onClick={() => setBuyModal({ isOpen: false, listing: null })}
                                className="flex-1 px-4 py-2 rounded-lg border border-border/40 text-foreground hover:bg-background/30 transition font-medium"
                            >
                                Cancel
                            </button>
                            <Button
                                onClick={handleConfirmPurchase}
                                isLoading={buyConfirming}
                                className="flex-1 gap-2"
                            >
                                <DollarSign className="w-4 h-4" />
                                Confirm Purchase
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* MAKE OFFER MODAL */}
            {offerModal.isOpen && offerModal.listing && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-background border border-border/40 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">
                        {/* Header */}
                        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border/20 bg-background">
                            <h2 className="text-lg font-bold text-foreground">Make an Offer</h2>
                            <button
                                onClick={() => setOfferModal({ isOpen: false, listing: null })}
                                className="p-1 hover:bg-background/30 rounded-md transition"
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-5">
                            {/* Token Summary */}
                            <div className="flex items-center gap-3 p-4 rounded-lg bg-background/30 border border-border/20">
                                <img
                                    src={offerModal.listing.image}
                                    alt={offerModal.listing.tokenName}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div>
                                    <h3 className="font-semibold text-foreground text-sm">
                                        {offerModal.listing.tokenName}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">{offerModal.listing.tokenSymbol}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {offerModal.listing.tokenAmount.toLocaleString()} tokens
                                    </p>
                                </div>
                            </div>

                            {/* Current Price Info */}
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Current Listing Price</p>
                                <div className="p-3 rounded-lg bg-background/30 border border-border/20">
                                    <p className="text-2xl font-bold text-foreground">
                                        {offerModal.listing.price} {offerModal.listing.currency}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Floor: {offerModal.listing.floorPrice} {offerModal.listing.currency}
                                    </p>
                                </div>
                            </div>

                            {/* Your Offer */}
                            <div className="space-y-2">
                                <Label htmlFor="offer-price" className="text-sm font-semibold">
                                    Your Offer Price
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="offer-price"
                                        type="number"
                                        placeholder="Enter your offer price"
                                        value={offerForm.price}
                                        onChange={(e) =>
                                            setOfferForm({ ...offerForm, price: e.target.value })
                                        }
                                        step="0.1"
                                        min="0"
                                        className="pr-12"
                                    />
                                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground font-medium">
                                        {offerModal.listing.currency}
                                    </span>
                                </div>
                                {offerForm.price && (
                                    <div className="text-xs text-muted-foreground space-y-1 pt-1">
                                        <div className="flex justify-between">
                                            <span>
                                                {parseFloat(offerForm.price) > offerModal.listing.price
                                                    ? '✓ Above listing price'
                                                    : parseFloat(offerForm.price) === offerModal.listing.price
                                                    ? 'Equal to listing price'
                                                    : `${Math.round(((parseFloat(offerForm.price) / offerModal.listing.price - 1) * 100))}% below`}
                                            </span>
                                            <span className="font-medium">
                                                {(parseFloat(offerForm.price) * offerModal.listing.tokenAmount).toLocaleString()} {offerModal.listing.currency}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <Label htmlFor="offer-message" className="text-sm font-semibold">
                                    Message (Optional)
                                </Label>
                                <textarea
                                    id="offer-message"
                                    placeholder="Add a message to the seller..."
                                    value={offerForm.message}
                                    onChange={(e) =>
                                        setOfferForm({ ...offerForm, message: e.target.value })
                                    }
                                    rows={3}
                                    maxLength={300}
                                    className="w-full px-3 py-2 rounded-lg border border-border/40 bg-background/30 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition text-sm resize-none"
                                />
                                <p className="text-xs text-muted-foreground text-right">
                                    {offerForm.message.length}/300
                                </p>
                            </div>

                            {/* Seller Info */}
                            <div className="text-xs text-muted-foreground px-3 py-2 rounded bg-background/30 border border-border/20">
                                <p className="font-medium">Seller</p>
                                <p className="mt-1">{offerModal.listing.seller}</p>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="sticky bottom-0 flex gap-2 p-6 border-t border-border/20 bg-background">
                            <button
                                onClick={() => setOfferModal({ isOpen: false, listing: null })}
                                className="flex-1 px-4 py-2 rounded-lg border border-border/40 text-foreground hover:bg-background/30 transition font-medium"
                            >
                                Cancel
                            </button>
                            <Button
                                onClick={handleSubmitOffer}
                                isLoading={offerSubmitting}
                                className="flex-1"
                            >
                                Submit Offer
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
