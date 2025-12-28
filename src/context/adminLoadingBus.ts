type Listener = (state: { isLoading: boolean; message?: string }) => void;

let pending = 0;
let message: string | undefined;
const listeners = new Set<Listener>();

function emit() {
    const isLoading = pending > 0;
    for (const l of listeners) l({ isLoading, message });
}

export const adminLoadingBus = {
    subscribe(fn: Listener) {
        listeners.add(fn);
        // push current state immediately
        fn({ isLoading: pending > 0, message });
        return () => listeners.delete(fn);
    },

    start(msg?: string) {
        pending += 1;
        if (msg) message = msg;
        emit();
    },

    stop() {
        pending = Math.max(0, pending - 1);
        if (pending === 0) message = undefined;
        emit();
    },
};
