import React, { useState } from 'react';
import { createWishlist } from '../api/wishlistApi';
import type { WishlistCreateDto } from '../types/types';
import { getOrCreateOwnerId } from '../utils/ownerutils';

const WishlistCreateForm: React.FC<{ onWishlistCreated: () => void }> = ({ onWishlistCreated }) => {
    const [title, setTitle] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [error, setError] = useState('');
    const ownerId = getOrCreateOwnerId();

    const handleCreate = async () => {
        const dto: WishlistCreateDto = { title, ownerName, eventDate, ownerId };
        try {
            const newWishlist = await createWishlist(dto);
            localStorage.setItem('lastCreatedWishlist', JSON.stringify(newWishlist)); // Store temporarily
            setTitle('');
            setOwnerName('');
            setEventDate('');
            setError('');
            onWishlistCreated();
        } catch (err: any) {
            setError('Помилка створення списку бажань: ' + err.message);
        }
    };

    return (
        <div className="card p-4 fade-in">
            <div className="card-header bg-[var(--primary-pink)] text-white rounded-t-lg">
                <h2 className="text-xl font-bold mb-0">
                    <i className="fas fa-list-ul mr-2"></i>Створити список бажань
                </h2>
            </div>
            <div className="card-body">
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                <form>
                    <div className="mb-3">
                        <label className="form-label fw-semibold text-white">Назва списку бажань</label>
                        <input
                            type="text"
                            className="form-control rounded-lg border-gray-300 focus:border-[var(--primary-teal)] focus:ring focus:ring-[var(--primary-teal)] focus:ring-opacity-50"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Назва списку бажань"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold text-white">Ім’я власника</label>
                        <input
                            type="text"
                            className="form-control rounded-lg border-gray-300 focus:border-[var(--primary-teal)] focus:ring focus:ring-[var(--primary-teal)] focus:ring-opacity-50"
                            value={ownerName}
                            onChange={(e) => setOwnerName(e.target.value)}
                            placeholder="Ім’я власника"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold text-white">Дата події</label>
                        <input
                            type="date"
                            className="form-control rounded-lg border-gray-300 focus:border-[var(--primary-teal)] focus:ring focus:ring-[var(--primary-teal)] focus:ring-opacity-50"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary rounded-full px-4 py-2 hover:bg-[#26a69a] hover:scale-105 transition-transform"
                        onClick={handleCreate}
                    >
                        <i className="fas fa-plus mr-2"></i>Створити список
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WishlistCreateForm; 