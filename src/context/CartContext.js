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
            // Redirect to login or show message
            alert('Please login to add to cart');
            return;
        }

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
                alert('Added to cart!');
            } else {
                alert('Failed to add to cart');
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
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
