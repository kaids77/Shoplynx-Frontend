"use client";

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const { user } = useAuth();
    const { cartItems } = useCart();
    const pathname = usePathname();
    const cartCount = cartItems.length;

    // Don't render navbar on admin pages
    if (pathname && pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <header>
            <div className="container">
                <nav>
                    <Link href={user ? "/home" : "/"} className="logo">
                        <img src="/images/logo.png" alt="ShopLynx" className="logo-img" />
                    </Link>
                    <ul className="nav-links">
                        <li><Link href={user ? "/home" : "/"}>Home</Link></li>
                        <li><Link href="/products">Products</Link></li>
                        <li><Link href="/about">About</Link></li>
                        <li><Link href="/contact">Contact</Link></li>
                    </ul>
                    <div className="nav-actions">
                        {user ? (
                            <>
                                <Link href="/cart" className="btn btn-outline cart-btn">
                                    🛒 Cart
                                    {cartCount > 0 && (
                                        <span className="cart-badge">{cartCount}</span>
                                    )}
                                </Link>
                                <Link href="/orders" className="btn btn-outline">My Orders</Link>
                                <Link href="/transactions" className="btn btn-outline">Transactions</Link>
                                <Link href="/profile" className="btn btn-primary">Settings</Link>
                            </>
                        ) : (
                            <>
                                <Link href="/register" className="btn btn-primary">Get Started</Link>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}
