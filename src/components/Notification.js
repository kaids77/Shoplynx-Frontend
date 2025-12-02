"use client";

import { useNotification } from '../context/NotificationContext';

export default function Notification() {
    const { notification, clearNotification } = useNotification();

    if (!notification || !notification.message) return null;

    // Double check that message is a string
    const message = typeof notification.message === 'object'
        ? JSON.stringify(notification.message)
        : String(notification.message);

    return (
        <div className="container mt-4">
            <div className={`alert ${notification.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                {message}
                <button
                    onClick={clearNotification}
                    style={{
                        float: 'right',
                        background: 'none',
                        border: 'none',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        marginLeft: '1rem'
                    }}
                >
                    ×
                </button>
            </div>
        </div>
    );
}
