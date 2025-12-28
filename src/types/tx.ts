// src/types/tx.ts

export type TxType =
    | "BUY"
    | "SELL_ORDER_CREATED"
    | "SELL_ORDER_FILLED"
    | "SELL_ORDER_CANCELLED"
    | "TRANSFER"
    | "PLOT_REGISTERED"
    | "PLOT_UPDATED"
    | "TOKENS_ALLOCATED"
    | "TOKENS_PER_UNIT_UPDATED"
    | "NOMINEE_SET"
    | "NOMINEE_CLEARED"
    | "DECLARED_DECEASED"
    | "PLOT_CLAIMED";

export type TxRow = {
    id: string;            // unique key: `${txHash}-${logIndex}`
    blockNumber: number;
    txHash: string;
    logIndex: number;
    date: string;          // formatted
    type: TxType;

    from: string;
    to: string;

    amount: string;        // formatted (token units)
    price: string;         // formatted (eth/btn peg etc)
    meta?: Record<string, any>; // optional extra info (plotId, nominee, etc)
};

export function shortAddr(addr: string, size = 4) {
    if (!addr) return "—";
    if (addr.length < 10) return addr;
    return `${addr.slice(0, 2 + size)}…${addr.slice(-size)}`;
}
