"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { user, logout, setUser } = useAuth(); // Need setUser to update context after profile update
    const router = useRouter();

    // Profile Info State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

    // Profile Image State
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageMessage, setImageMessage] = useState({ type: '', text: '' });

    // Password State
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        setName(user.name);
        setEmail(user.email);
    }, [user, router]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleImageUpload = async (e) => {
        e.preventDefault();
        if (!imageFile) return;

        const formData = new FormData();
        formData.append('profile_image', imageFile);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8000/api/user/profile-image', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                setUser(data.user);
                setImageMessage({ type: 'success', text: 'Profile picture updated successfully!' });
                setImageFile(null);
            } else {
                setImageMessage({ type: 'error', text: data.message || 'Failed to update image' });
            }
        } catch (error) {
            setImageMessage({ type: 'error', text: 'An error occurred' });
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setProfileMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8000/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, email })
            });

            const data = await res.json();

            if (res.ok) {
                setUser(data.user);
                setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
            } else {
                setProfileMessage({ type: 'error', text: data.message || 'Failed to update profile' });
            }
        } catch (error) {
            setProfileMessage({ type: 'error', text: 'An error occurred' });
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordMessage({ type: '', text: '' });

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (newPassword.length < 8) {
            setPasswordMessage({ type: 'error', text: 'Password must be at least 8 characters' });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8000/api/user/password', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    password: newPassword,
                    password_confirmation: confirmPassword
                })
            });

            const data = await res.json();

            if (res.ok) {
                setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setShowPasswordForm(false);
            } else {
                setPasswordMessage({ type: 'error', text: data.message || 'Failed to change password' });
            }
        } catch (error) {
            setPasswordMessage({ type: 'error', text: 'An error occurred' });
        }
    };

    if (!user) return null;

    const profileImageUrl = user.profile_image
        ? `http://localhost:8000/images/profiles/${user.profile_image}`
        : '/images/default-avatar.png';

    return (
        <div className="container mt-5">
            <h1 className="section-title">Account Settings</h1>
            <div className="profile-container">

                {/* Profile Image Section */}
                <div className="settings-card">
                    <div className="profile-image-container">
                        <img
                            src={imagePreview || profileImageUrl}
                            alt="Profile"
                            className="profile-image"
                            style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }}
                        />
                    </div>
                    <h3>Profile Picture</h3>
                    {imageMessage.text && (
                        <div className={`alert ${imageMessage.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                            {imageMessage.text}
                        </div>
                    )}
                    <form onSubmit={handleImageUpload}>
                        <div className="form-group">
                            <label htmlFor="profile_image">Upload New Picture</label>
                            <input
                                type="file"
                                id="profile_image"
                                className="form-control"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={!imageFile}>
                            Update Picture
                        </button>
                    </form>
                </div>

                {/* Profile Information Section */}
                <div className="settings-card mt-4">
                    <h3>Profile Information</h3>
                    {profileMessage.text && (
                        <div className={`alert ${profileMessage.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                            {profileMessage.text}
                        </div>
                    )}
                    <form onSubmit={handleProfileUpdate}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Update Profile
                        </button>
                    </form>
                </div>

                {/* Security Section */}
                <div className="settings-card mt-4">
                    <h3>Security</h3>
                    {passwordMessage.text && (
                        <div className={`alert ${passwordMessage.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                            {passwordMessage.text}
                        </div>
                    )}

                    {!showPasswordForm ? (
                        <button
                            onClick={() => setShowPasswordForm(true)}
                            className="btn btn-outline"
                        >
                            Change Password
                        </button>
                    ) : (
                        <div className="mt-3">
                            <form onSubmit={handlePasswordChange}>
                                <div className="form-group">
                                    <label>Current Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength="8"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength="8"
                                    />
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-primary">
                                        Update Password
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={() => {
                                            setShowPasswordForm(false);
                                            setPasswordMessage({ type: '', text: '' });
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Logout Section */}
                <div className="settings-card mt-4">
                    <button onClick={logout} className="btn btn-danger">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
