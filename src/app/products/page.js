"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '../../components/ProductCard';
import Link from 'next/link';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const router = useRouter();
    const searchTerm = searchParams.get('search') || '';
    const [searchInput, setSearchInput] = useState(searchTerm);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        setSearchInput(searchTerm);
    }, [searchTerm]);

    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/products');
            if (!res.ok) throw new Error('Failed to fetch products');
            const data = await res.json();
            setProducts(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchInput.trim())}`);
        } else {
            router.push('/products');
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <div className="container mt-5"><p className="text-center">Loading...</p></div>;

    return (
        <div className="container mt-5">
            {/* Search Bar */}
            <div className="products-search-container">
                <form onSubmit={handleSearch} className="products-search-wrapper">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="products-search-input"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <button type="submit" className="products-search-btn">Search</button>
                </form>
            </div>

            {searchTerm ? (
                <>
                    <h2 className="section-title">Search Results for "{searchTerm}"</h2>
                    {filteredProducts.length > 0 && (
                        <p className="search-count">Found {filteredProducts.length} product(s)</p>
                    )}
                </>
            ) : (
                <h2 className="section-title">Our Products</h2>
            )}

            <div className="products-grid">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                        <p>No products found{searchTerm ? ' matching your search' : ''}.</p>
                        {searchTerm && (
                            <Link href="/products" className="btn btn-primary mt-3">View All Products</Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
