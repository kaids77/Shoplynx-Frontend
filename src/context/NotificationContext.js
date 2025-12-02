"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext({
    notification: null,
    showSuccess: () => { },
    showError: () => { },
    clearNotification: () => { }
});

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const safeMessage = (msg) => {
        if (typeof msg === 'string') return msg;
        if (typeof msg === 'number') return String(msg);
        if (typeof msg === 'object' && msg !== null) {
            // If it's an error object from Laravel validation
            if (msg.message) return msg.message;
            if (msg.error) return msg.error;
            return JSON.stringify(msg);
        }
        return String(msg);
    };

    const showSuccess = (message) => {
        setNotification({ type: 'success', message: safeMessage(message) });
    };

    const showError = (message) => {
        setNotification({ type: 'error', message: safeMessage(message) });
    };

    const clearNotification = () => {
        setNotification(null);
    };

    // Listen for custom notification events
    useEffect(() => {
        const handleNotification = (event) => {
            const { type, message } = event.detail;
            if (type === 'success') {
                showSuccess(message);
            } else if (type === 'error') {
                showError(message);
            }
        };

        window.addEventListener('show-notification', handleNotification);
        return () => window.removeEventListener('show-notification', handleNotification);
    }, []);

    // Auto-clear notification after 5 seconds
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                clearNotification();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    return (
        <NotificationContext.Provider value={{ notification, showSuccess, showError, clearNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};
