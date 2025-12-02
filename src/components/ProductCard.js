"use client";

import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    return (
        <div className="product-card">
            <div className="product-image">
                {product.stock <= 0 && (
                    <div className="out-of-stock-badge">Out of Stock</div>
                )}
                {product.stock > 0 && product.stock < 5 && (
                    <div className="low-stock-badge">Only {product.stock} left!</div>
                )}
                {product.image_path ? (
                    <img src={`http://localhost:8000/images/${product.image_path}`} alt={product.name} />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0' }}>
                        No Image
                    </div>
                )}
            </div>
            <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-price">₱{parseFloat(product.price).toFixed(2)}</p>
                <p className="product-stock">Stock: {product.stock || 0}</p>
                <div className="product-actions">
                    <Link href={`/products/${product.id}`} className="btn btn-outline btn-sm">View</Link>
                    {product.stock && product.stock > 0 ? (
                        <button onClick={() => addToCart(product.id)} className="btn btn-primary btn-sm">
                            Add to Cart
                        </button>
                    ) : (
                        <button className="btn btn-secondary btn-sm" disabled>Out of Stock</button>
                    )}
                </div>
            </div>
        </div>
    );
}
