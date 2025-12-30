'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    convertPrice: (price: number | null | undefined, fromCurrency: string) => { value: number | null, symbol: string, code: string };
    formatPrice: (price: number | null | undefined, fromCurrency: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const RATES: Record<string, number> = {
    USD: 1,
    EUR: 0.95,
    GBP: 0.79,
    CAD: 1.42
};

const SYMBOLS: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$'
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<Currency>('USD');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('selectedCurrency');
        if (saved && Object.keys(RATES).includes(saved)) {
            setCurrency(saved as Currency);
        }
        setMounted(true);
    }, []);

    const updateCurrency = (newCurrency: Currency) => {
        setCurrency(newCurrency);
        localStorage.setItem('selectedCurrency', newCurrency);
    };

    const convertPrice = (price: number | null | undefined, fromCurrency: string) => {
        if (price === null || price === undefined) return { value: null, symbol: SYMBOLS[currency], code: currency };

        // Default to USD if fromCurrency is invalid or missing
        const safeFromCurrency = (fromCurrency && RATES[fromCurrency]) ? fromCurrency : 'USD';

        const fromRate = RATES[safeFromCurrency];
        const toRate = RATES[currency];

        // Convert to USD first then to target
        const inUSD = price / fromRate;
        const converted = inUSD * toRate;

        return {
            value: converted,
            symbol: SYMBOLS[currency],
            code: currency
        };
    };

    const formatPrice = (price: number | null | undefined, fromCurrency: string) => {
        const { value, symbol } = convertPrice(price, fromCurrency);
        if (value === null) return 'N/A';
        return `${symbol}${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    };

    // return mounted ? ... : null or just render children with default to avoid mismatch?
    // Next.js hydration mismatch might occur if we render from localStorage immediately.
    // However, since we set state in useEffect, initial render is default 'USD', then updates. 
    // This is fine, but might cause a flash. For now, it's acceptable.

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency: updateCurrency, convertPrice, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
