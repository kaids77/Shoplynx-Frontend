"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateProduct() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: 0
    });
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('stock', formData.stock);
            if (image) {
                data.append('image', image);
            }

            const res = await fetch('http://localhost:8000/api/products', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            if (res.ok) {
                router.push('/admin/products');
            } else {
                const result = await res.json();
                setError(result.message || 'Failed to create product');
            }
        } catch (error) {
            console.error('Error creating product:', error);
            setError('An error occurred');
        }
    };

    return (
        <div className="container">
            <h1>Add New Product</h1>
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        name="description"
                        id="description"
                        className="form-control"
                        rows="4"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        name="price"
                        id="price"
                        className="form-control"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="stock">Stock Quantity</label>
                    <input
                        type="number"
                        name="stock"
                        id="stock"
                        className="form-control"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="image">Product Image</label>
                    <input
                        type="file"
                        name="image"
                        id="image"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>

                <button type="submit" className="btn btn-primary mt-3">Create Product</button>
            </form>
        </div>
    );
}
