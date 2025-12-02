"use client";

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function HeroButtons() {
    const { user } = useAuth();

    return (
        <div className="d-flex gap-3 justify-content-center mt-4">
            {user ? (
                <Link href="/home" className="btn btn-primary btn-lg">Go to Shop</Link>
            ) : (
                <>
                    <Link href="/register" className="btn btn-primary btn-lg">Get Started</Link>
                    <Link href="/login" className="btn btn-outline btn-lg">Sign In</Link>
                </>
            )}
        </div>
    );
}
