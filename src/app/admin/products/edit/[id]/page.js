"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function EditProduct({ params }) {
    const router = useRouter();
    const { id } = use(params);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: 0
    });
    const [image, setImage] = useState(null);
    const [currentImage, setCurrentImage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await fetch(`http://localhost:8000/api/products/${id}`);
            if (!res.ok) throw new Error('Failed to fetch product');
            const product = await res.json();
            setFormData({
                name: product.name,
                description: product.description || '',
                price: product.price,
                stock: product.stock
            });
            setCurrentImage(product.image_path);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching product:', error);
            setError('Failed to load product');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('token');
            // For file uploads with PUT/PATCH in Laravel, it's often better to use POST with _method=PUT
            const data = new FormData();
            data.append('_method', 'PUT');
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('stock', formData.stock);
            if (image) {
                data.append('image', image);
            }

            const res = await fetch(`http://localhost:8000/api/products/${id}`, {
                method: 'POST', // Using POST with _method=PUT for FormData
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
                setError(result.message || 'Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            setError('An error occurred');
        }
    };

    if (loading) return <div className="container mt-5"><p>Loading...</p></div>;

    return (
        <div className="container">
            <h1>Edit Product</h1>
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
                    {currentImage && (
                        <div className="mb-2">
                            <img
                                src={`http://localhost:8000/images/${currentImage}`}
                                alt="Current"
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            />
                        </div>
                    )}
                    <input
                        type="file"
                        name="image"
                        id="image"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                    <small className="text-muted">Leave empty to keep current image</small>
                </div>

                <button type="submit" className="btn btn-primary mt-3">Update Product</button>
            </form>
        </div>
    );
}
