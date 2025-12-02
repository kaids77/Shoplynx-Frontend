"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/products');
            const data = await res.json();
            setProducts(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:8000/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                fetchProducts(); // Refresh list
            } else {
                alert('Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('An error occurred');
        }
    };

    if (loading) {
        return <div className="container mt-5"><p>Loading...</p></div>;
    }

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Products</h1>
                <Link href="/admin/products/create" className="btn btn-primary">
                    Add New Product
                </Link>
            </div>

            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    {product.image_path ? (
                                        <img
                                            src={`http://localhost:8000/images/${product.image_path}`}
                                            width="50"
                                            height="50"
                                            alt={product.name}
                                            style={{ objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{ width: '50px', height: '50px', background: '#ddd' }}></div>
                                    )}
                                </td>
                                <td>{product.name}</td>
                                <td>₱{parseFloat(product.price).toFixed(2)}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <Link
                                        href={`/admin/products/edit/${product.id}`}
                                        className="btn btn-sm btn-outline-primary"
                                        style={{ marginRight: '5px' }}
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="btn btn-sm btn-danger"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
