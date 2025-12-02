"use client";

import { useState, useEffect } from 'react';

export default function AdminCustomers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8000/api/admin/users', {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    if (loading) return <div className="container mt-5"><p>Loading...</p></div>;

    return (
        <div className="container">
            <h1 className="mb-4">Customers</h1>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Joined Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        {user.profile_image ? (
                                            <img
                                                src={`http://localhost:8000/images/profiles/${user.profile_image}`}
                                                alt={user.name}
                                                style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#ddd', marginRight: '10px' }}></div>
                                        )}
                                        {user.name}
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
