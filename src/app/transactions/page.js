"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({
        total_spent: 0,
        total_refunded: 0,
        pending_amount: 0,
        total_transactions: 0
    });
    const [filters, setFilters] = useState({
        type: 'all',
        status: 'all',
        date_from: '',
        date_to: ''
    });
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0
    });
    const [loading, setLoading] = useState(true);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push('/login');
            return;
        }
        fetchTransactions();
    }, [user, authLoading]);

    const fetchTransactions = async (filterParams = filters, page = 1) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const queryParams = new URLSearchParams();
            queryParams.append('page', page);
            if (filterParams.type && filterParams.type !== 'all') queryParams.append('type', filterParams.type);
            if (filterParams.status && filterParams.status !== 'all') queryParams.append('status', filterParams.status);
            if (filterParams.date_from) queryParams.append('date_from', filterParams.date_from);
            if (filterParams.date_to) queryParams.append('date_to', filterParams.date_to);

            const url = `http://localhost:8000/api/transactions${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

            const res = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setTransactions(data.transactions || []);
                setStats(data.stats || stats);
                setPagination(data.pagination || pagination);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = (e) => {
        e.preventDefault();
        setLoading(true);
        fetchTransactions(filters);
    };

    const clearFilters = () => {
        const resetFilters = {
            type: 'all',
            status: 'all',
            date_from: '',
            date_to: ''
        };
        setFilters(resetFilters);
        setLoading(true);
        fetchTransactions(resetFilters);
    };

    if (loading || authLoading) {
        return <div className="container mt-5 text-center">Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h2 className="section-title">Transaction History</h2>

            {/* Statistics Cards */}
            <div className="transaction-stats">
                <div className="stat-card stat-primary">
                    <div className="stat-content">
                        <h3>₱{parseFloat(stats.total_spent).toFixed(2)}</h3>
                        <p>Total Spent</p>
                    </div>
                </div>
                <div className="stat-card stat-success">
                    <div className="stat-content">
                        <h3>{stats.total_transactions}</h3>
                        <p>Total Transactions</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="transaction-filters">
                <form onSubmit={applyFilters} className="filter-form">
                    <div className="filter-group">
                        <label htmlFor="type">Type</label>
                        <select name="type" id="type" className="filter-select" value={filters.type} onChange={handleFilterChange}>
                            <option value="all">All Types</option>
                            <option value="payment">Payment</option>
                            <option value="refund">Refund</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="status">Status</label>
                        <select name="status" id="status" className="filter-select" value={filters.status} onChange={handleFilterChange}>
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="date_from">From Date</label>
                        <input type="date" name="date_from" id="date_from" value={filters.date_from} onChange={handleFilterChange} className="filter-input" />
                    </div>

                    <div className="filter-group">
                        <label htmlFor="date_to">To Date</label>
                        <input type="date" name="date_to" id="date_to" value={filters.date_to} onChange={handleFilterChange} className="filter-input" />
                    </div>

                    <div className="filter-actions">
                        <button type="submit" className="btn btn-primary">Apply Filters</button>
                        <button type="button" onClick={clearFilters} className="btn btn-outline">Clear</button>
                    </div>
                </form>
            </div>

            {/* Transactions List */}
            {transactions.length > 0 ? (
                <>
                    <div className="transactions-container">
                        {transactions.map((transaction) => (
                            <div key={transaction.id} className="transaction-card">
                                <div className="transaction-header">
                                    <div className="transaction-info">
                                        <h3>{transaction.reference_number}</h3>
                                        <p className="transaction-date">
                                            {new Date(transaction.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="transaction-details">
                                    <div className="detail-row">
                                        <span className="detail-label">Order ID:</span>
                                        <span className="detail-value">
                                            <Link href="/orders" className="order-link">
                                                #{transaction.order_id}
                                            </Link>
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Payment Method:</span>
                                        <span className="detail-value">{transaction.payment_method.replace('_', ' ').toUpperCase()}</span>
                                    </div>
                                    {transaction.description && (
                                        <div className="detail-row">
                                            <span className="detail-label">Description:</span>
                                            <span className="detail-value" style={{
                                                color: transaction.description.includes('Completed') ? '#28a745' :
                                                    transaction.description.includes('Cancelled') ? '#dc3545' : 'inherit',
                                                fontWeight: (transaction.description.includes('Completed') || transaction.description.includes('Cancelled')) ? 'bold' : 'normal'
                                            }}>
                                                {transaction.description}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Products List */}
                                {transaction.order && transaction.order.items && transaction.order.items.length > 0 && (
                                    <div className="transaction-products">
                                        <h4>Products:</h4>
                                        <ul className="products-list">
                                            {transaction.order.items.map((item, idx) => (
                                                <li key={idx} className="product-item">
                                                    <span className="product-name">{item.product?.name || 'Product'}</span>
                                                    <span className="product-quantity">x{item.quantity}</span>
                                                    <span className="product-price">₱{parseFloat(item.price * item.quantity).toFixed(2)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className={`transaction-amount ${transaction.transaction_type === 'refund' ? 'refund-amount' : ''}`}>
                                    <span className="amount-label">Amount:</span>
                                    <span className="amount-value">
                                        {transaction.transaction_type === 'refund' ? '+' : '-'}₱{parseFloat(transaction.amount).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.last_page > 1 && (
                        <div className="pagination-container">
                            <div className="pagination">
                                <button
                                    onClick={() => fetchTransactions(filters, pagination.current_page - 1)}
                                    disabled={pagination.current_page === 1}
                                    className="pagination-btn"
                                >
                                    Previous
                                </button>

                                {[...Array(pagination.last_page)].map((_, index) => {
                                    const page = index + 1;
                                    // Show first page, last page, current page, and pages around current
                                    if (
                                        page === 1 ||
                                        page === pagination.last_page ||
                                        (page >= pagination.current_page - 1 && page <= pagination.current_page + 1)
                                    ) {
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => fetchTransactions(filters, page)}
                                                className={`pagination-btn ${page === pagination.current_page ? 'active' : ''}`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    } else if (
                                        page === pagination.current_page - 2 ||
                                        page === pagination.current_page + 2
                                    ) {
                                        return <span key={page} className="pagination-ellipsis">...</span>;
                                    }
                                    return null;
                                })}

                                <button
                                    onClick={() => fetchTransactions(filters, pagination.current_page + 1)}
                                    disabled={pagination.current_page === pagination.last_page}
                                    className="pagination-btn"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="pagination-info">
                                Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total || 0} transactions
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="empty-state">
                    <h3>No Transactions Found</h3>
                    <p>You don't have any transactions yet or no transactions match your filters.</p>
                    <Link href="/products" className="btn btn-primary mt-3">Start Shopping</Link>
                </div>
            )}
        </div>
    );
}
