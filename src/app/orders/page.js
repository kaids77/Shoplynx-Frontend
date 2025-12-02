"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push('/login');
            return;
        }
        fetchOrders();
    }, [user, authLoading]);

    const fetchOrders = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch('http://localhost:8000/api/orders', {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (orderId) => {
        if (!confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:8000/api/orders/${orderId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                alert('Order cancelled successfully. Stock has been restored.');
                fetchOrders(); // Refresh the orders list
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to cancel order');
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert('An error occurred while cancelling the order');
        }
    };

    if (loading || authLoading) {
        return <div className="container mt-5 text-center">Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="section-title">My Orders</h1>
            <div className="orders-container">
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <div>
                                    <h3>Order #{order.id}</h3>
                                    <p className="order-date">
                                        {new Date(order.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <span className={`badge badge-${order.status}`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                            </div>
                            <div className="order-details">
                                <div className="order-info">
                                    <p><strong>Phone:</strong> {order.customer_details?.phone || 'N/A'}</p>
                                    <p><strong>Shipping Address:</strong> {typeof order.shipping_address === 'string' ? order.shipping_address : order.shipping_address?.address || 'N/A'}</p>
                                    <p><strong>Payment Method:</strong> {order.payment_method}</p>
                                </div>
                                {order.items && order.items.length > 0 && (
                                    <div className="order-items">
                                        <h4>Items:</h4>
                                        <ul>
                                            {order.items.map((item, index) => (
                                                <li key={index}>
                                                    {item.product?.name || 'Product'} - Qty: {item.quantity} - ₱{parseFloat(item.price).toFixed(2)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <div className="order-total">
                                    <h3>Total: ₱{parseFloat(order.total_price).toFixed(2)}</h3>
                                </div>

                                {/* Cancel Order Button for Pending Orders */}
                                {order.status === 'pending' && (
                                    <div className="order-actions mt-3">
                                        <button
                                            onClick={() => cancelOrder(order.id)}
                                            className="btn btn-danger"
                                        >
                                            Cancel Order
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <h3>No orders yet</h3>
                        <p>Start shopping to create your first order!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
