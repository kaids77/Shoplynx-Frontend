"use client";

import { useState, useEffect } from 'react';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8000/api/admin/orders', {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:8000/api/admin/orders/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                fetchOrders(); // Refresh list
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('An error occurred');
        }
    };

    if (loading) return <div className="container mt-5"><p>Loading...</p></div>;

    return (
        <div className="container">
            <h1 className="mb-4">Orders</h1>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td>
                                    <strong>{order.customer_details?.name || 'N/A'}</strong><br />
                                    <small>{order.customer_details?.email || 'N/A'}</small>
                                </td>
                                <td>
                                    {order.items && order.items.map((item, idx) => (
                                        <div key={idx}>
                                            {item.product?.name || 'Product'} (x{item.quantity})
                                        </div>
                                    ))}
                                </td>
                                <td>₱{parseFloat(order.total_price).toFixed(2)}</td>
                                <td>
                                    <span className={`badge badge-${order.status}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                <td>
                                    <select
                                        className="form-select form-select-sm"
                                        value={order.status}
                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
