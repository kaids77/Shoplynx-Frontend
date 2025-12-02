"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        // Note: The backend doesn't have a transactions endpoint in the routes we saw
        // This is a placeholder implementation
        setLoading(false);
    }, [user]);

    if (loading) {
        return <div className="container mt-5 text-center">Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="section-title">Transaction History</h1>
            <div className="transactions-container">
                <div className="empty-state">
                    <h3>No transactions yet</h3>
                    <p>Your transaction history will appear here.</p>
                    <Link href="/products" className="btn btn-primary mt-3">Start Shopping</Link>
                </div>
            </div>
        </div>
    );
}
