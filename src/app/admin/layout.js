"use client";

import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }) {
    const { user, logout, loading } = useAuth();
    const router = useRouter();
    const ADMIN_EMAIL = 'admin@shoplynx.com';

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (user.email !== ADMIN_EMAIL) {
                router.push('/');
            }
        }
    }, [user, loading, router]);

    if (loading) {
        return <div className="container mt-5"><p>Loading...</p></div>;
    }

    if (!user || user.email !== ADMIN_EMAIL) {
        return null;
    }

    return (
        <>
            <header>
                <div className="container">
                    <nav>
                        <Link href="/admin" className="logo">
                            <img src="/images/logo.png" alt="ShopLynx Admin" className="logo-img" />
                        </Link>
                        <ul className="nav-links">
                            <li><Link href="/admin">Dashboard</Link></li>
                            <li><Link href="/admin/products">Products</Link></li>
                            <li><Link href="/admin/orders">Orders</Link></li>
                            <li><Link href="/admin/customers">Customers</Link></li>
                        </ul>
                        <div className="nav-actions">
                            <button onClick={logout} className="btn btn-primary">Logout</button>
                        </div>
                    </nav>
                </div>
            </header>

            <main className="container mt-4">
                {children}
            </main>
        </>
    );
}
