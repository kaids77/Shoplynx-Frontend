"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCartItems([]);
        }
    }, [user]);

    const fetchCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch('http://localhost:8000/api/cart', {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setCartItems(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.dispatchEvent(new CustomEvent('show-notification', {
                detail: { type: 'error', message: 'Please login to add to cart' }
            }));
            return;
        }

        try {
            const body = { product_id: productId };
            // Only include quantity if explicitly provided (for cart page updates)
            if (quantity > 1) {
                body.quantity = quantity;
            }

            const res = await fetch('http://localhost:8000/api/cart', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (res.ok) {
                fetchCart();
                window.dispatchEvent(new CustomEvent('show-notification', {
                    detail: { type: 'success', message: 'Added to cart!' }
                }));
            } else {
                const errorMessage = data.error || 'Failed to add to cart';
                window.dispatchEvent(new CustomEvent('show-notification', {
                    detail: { type: 'error', message: errorMessage }
                }));
            }
        } catch (error) {
            console.error(error);
            window.dispatchEvent(new CustomEvent('show-notification', {
                detail: { type: 'error', message: 'An error occurred' }
            }));
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (quantity < 1) return;
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch('http://localhost:8000/api/cart', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ product_id: productId, quantity })
            });

            if (res.ok) {
                fetchCart();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const removeFromCart = async (cartItemId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch(`http://localhost:8000/api/cart/${cartItemId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                fetchCart();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const clearCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch('http://localhost:8000/api/cart', {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                setCartItems([]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
