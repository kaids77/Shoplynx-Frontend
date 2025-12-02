"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to their home page
  useEffect(() => {
    if (!authLoading && user) {
      if (user.email === 'admin@shoplynx.com') {
        router.push('/admin');
      } else {
        router.push('/home');
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('http://localhost:8000/api/products', { cache: 'no-store' });
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="container mt-5">
        <p>Loading...</p>
      </div>
    );
  }

  // Don't render landing page for authenticated users (they'll be redirected)
  if (user) {
    return null;
  }

  const featuredProducts = products.slice(0, 4);

  return (
    <>
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to Shoplynx</h1>
            <p>Your premium destination for quality products. Experience the future of shopping with us.</p>
            <div className="d-flex gap-3 justify-content-center mt-4">
              <Link href="/register" className="btn btn-primary btn-lg">Get Started</Link>
              <Link href="/login" className="btn btn-outline btn-lg">Sign In</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <h3>Premium Quality</h3>
              <p>We source only the finest materials for our products.</p>
            </div>
            <div className="feature-card">
              <h3>Fast Shipping</h3>
              <p>Get your orders delivered to your doorstep in no time.</p>
            </div>
            <div className="feature-card">
              <h3>Secure Payment</h3>
              <p>Your transactions are safe and encrypted.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <h2 className="section-title">Featured Products</h2>
        <div className="products-grid">
          {loading ? (
            <p className="text-center">Loading products...</p>
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-center">No products found.</p>
          )}
        </div>
      </div>
    </>
  );
}
