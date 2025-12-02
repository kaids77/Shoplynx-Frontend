"use client";

import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { cartItems, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('gcash');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const total = cartItems.reduce((sum, item) => {
        if (item.product && item.product.price) {
            return sum + (parseFloat(item.product.price) * item.quantity);
        }
        return sum;
    }, 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const res = await fetch('http://localhost:8000/api/orders', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    customer_phone: phone,
                    shipping_address: address,
                    payment_method: paymentMethod
                })
            });

            const data = await res.json();

            if (res.ok) {
                clearCart();
                router.push(`/orders`);
            } else {
                setError(data.message || 'Failed to place order');
            }
        } catch (err) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        router.push('/login');
        return null;
    }

    if (cartItems.length === 0) {
        return (
            <div className="container mt-5 text-center">
                <h1>Your cart is empty</h1>
                <p>Add some items to your cart before checking out.</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2 className="section-title">Checkout</h2>
            <div className="checkout-container">
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name:</label>
                        <p className="form-control-plaintext" style={{ fontWeight: 500, fontSize: '1.1rem', padding: '0.375rem 0', border: '1px solid #dee2e6', paddingLeft: '1rem' }}>
                            {user.name}
                        </p>
                    </div>
                    <div className="form-group">
                        <label>Email Address:</label>
                        <p className="form-control-plaintext" style={{ fontWeight: 500, fontSize: '1.1rem', padding: '0.375rem 0', border: '1px solid #dee2e6', paddingLeft: '1rem' }}>
                            {user.email}
                        </p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="customer_phone">Phone Number (11 digits)</label>
                        <input
                            type="tel"
                            name="customer_phone"
                            id="customer_phone"
                            className="form-control"
                            maxLength="11"
                            pattern="[0-9]{11}"
                            placeholder="09XXXXXXXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="shipping_address">Shipping Address</label>
                        <textarea
                            name="shipping_address"
                            id="shipping_address"
                            className="form-control"
                            rows="3"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="payment_method">Payment Method</label>
                        <select
                            name="payment_method"
                            id="payment_method"
                            className="form-control"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            required
                        >
                            <option value="gcash">GCash</option>
                            <option value="paypal">PayPal</option>
                            <option value="cod">Cash on Delivery</option>
                            <option value="bank_transfer">Bank Transfer</option>
                        </select>
                    </div>
                    <div className="checkout-summary">
                        <h3>Order Summary</h3>
                        {cartItems.map((item) => (
                            <div key={item.id} className="summary-item">
                                <span>{item.product?.name} x {item.quantity}</span>
                                <span>₱{item.product ? (parseFloat(item.product.price) * item.quantity).toFixed(2) : '0.00'}</span>
                            </div>
                        ))}
                        <div className="summary-total">
                            <strong>Total: ₱{total.toFixed(2)}</strong>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block mt-4" disabled={loading}>
                        {loading ? 'Processing...' : 'Place Order'}
                    </button>
                </form>
            </div>
        </div>
    );
}
