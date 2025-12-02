"use client";

import { useCart } from '../../context/CartContext';
import Link from 'next/link';

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

    const total = cartItems.reduce((sum, item) => {
        // Ensure product exists and has price
        if (item.product && item.product.price) {
            return sum + (parseFloat(item.product.price) * item.quantity);
        }
        return sum;
    }, 0);

    return (
        <div className="container mt-5">
            <h1 className="section-title">Your Cart</h1>
            {cartItems.length > 0 ? (
                <>
                    <table className="cart-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            {item.product && item.product.image_path ? (
                                                <img src={`http://localhost:8000/images/${item.product.image_path}`} alt={item.product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '1rem' }} />
                                            ) : (
                                                <div style={{ width: '50px', height: '50px', background: '#ddd', marginRight: '1rem' }}></div>
                                            )}
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '1rem' }}>{item.product ? item.product.name : 'Unknown Product'}</h4>
                                                {item.product && (
                                                    <>
                                                        <p className="text-muted" style={{ fontSize: '0.9rem', margin: 0 }}>Stock: {item.product.stock}</p>
                                                        {item.product.stock < item.quantity && (
                                                            <p className="text-danger" style={{ fontSize: '0.8rem', margin: 0 }}>Only {item.product.stock} available!</p>
                                                        )}
                                                        {item.product.stock >= item.quantity && item.product.stock < 5 && (
                                                            <p className="text-warning" style={{ fontSize: '0.8rem', margin: 0 }}>Low Stock!</p>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td>₱{item.product ? parseFloat(item.product.price).toFixed(2) : '0.00'}</td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="mx-2">{item.quantity}</span>
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td>₱{item.product ? (parseFloat(item.product.price) * item.quantity).toFixed(2) : '0.00'}</td>
                                    <td>
                                        <button onClick={() => removeFromCart(item.id)} className="btn btn-danger btn-sm">Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="cart-summary mt-4 text-right">
                        <h3>Total: ₱{total.toFixed(2)}</h3>
                        <div className="mt-3" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <Link href="/products" className="btn btn-outline">Continue Shopping</Link>
                            <button onClick={clearCart} className="btn btn-outline">Clear Cart</button>
                            <Link href="/checkout" className="btn btn-primary">Proceed to Checkout</Link>
                        </div>
                    </div>
                </>
            ) : (
                <div className="empty-state">
                    <p>Your cart is empty.</p>
                    <Link href="/products" className="btn btn-primary">Start Shopping</Link>
                </div>
            )}
        </div>
    );
}
