"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalCustomers: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user || user.email !== 'admin@shoplynx.com') {
            router.push('/login');
            return;
        }
        fetchDashboardData();
    }, [user, authLoading]);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');

            // Fetch stats
            const [productsRes, ordersRes, usersRes] = await Promise.all([
                fetch('http://localhost:8000/api/products'),
                fetch('http://localhost:8000/api/admin/orders', {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }),
                fetch('http://localhost:8000/api/admin/users', {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
            ]);

            const products = await productsRes.json();
            const orders = await ordersRes.json();
            const users = await usersRes.json();

            setStats({
                totalProducts: products.length,
                totalOrders: orders.length,
                totalCustomers: users.length
            });

            // Get recent 5 orders
            setRecentOrders(orders.slice(0, 5));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    if (loading || authLoading) {
        return <div className="container mt-5"><p>Loading...</p></div>;
    }

    return (
        <div className="dashboard-container">
            <h1 className="mb-4">Dashboard</h1>
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Products</h3>
                    <p className="stat-number">{stats.totalProducts}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Orders</h3>
                    <p className="stat-number">{stats.totalOrders}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Customers</h3>
                    <p className="stat-number">{stats.totalCustomers}</p>
                </div>
            </div>

            <div className="recent-orders mt-5">
                <h2>Recent Orders</h2>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer Info</th>
                                <th>Products</th>
                                <th>Payment Method</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.length > 0 ? (
                                recentOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>
                                            <strong>{order.customer_details?.name || 'N/A'}</strong><br />
                                            <small>{order.customer_details?.email || 'N/A'}</small><br />
                                            <small>{order.customer_details?.phone || 'N/A'}</small>
                                        </td>
                                        <td>
                                            {order.items && order.items.map((item, idx) => (
                                                <div key={idx}>
                                                    {item.product?.name || 'Product'} (x{item.quantity})
                                                </div>
                                            ))}
                                        </td>
                                        <td>{order.payment_method?.replace('_', ' ')}</td>
                                        <td>₱{parseFloat(order.total_price).toFixed(2)}</td>
                                        <td>
                                            <span className={`badge badge-${order.status}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">No orders yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
