"use client";

import { useCart } from '../context/CartContext';

export default function AddToCartButton({ productId, className, disabled }) {
    const { addToCart } = useCart();

    return (
        <button onClick={() => addToCart(productId)} className={className} disabled={disabled}>
            {disabled ? 'Out of Stock' : 'Add to Cart'}
        </button>
    );
}
