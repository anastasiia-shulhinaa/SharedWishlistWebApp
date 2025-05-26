import React, { useState } from 'react';
import { createWishlist } from '../api/wishlistApi';
import type { WishlistCreateDto } from '../types/types';
import { getOrCreateOwnerId } from '../utils/ownerutils';
import '../styles/wishlisst-create.css';

const WishlistCreateForm: React.FC<{ onWishlistCreated: () => void }> = ({ onWishlistCreated }) => {
    const [title, setTitle] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [error, setError] = useState('');
    const ownerId = getOrCreateOwnerId();

    // Restrict event date to future dates (today is May 26, 2025)
    const today = new Date('2025-05-26');
    const minDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    const handleCreate = async () => {
        // Validate event date
        const selectedDate = new Date(eventDate);
        if (selectedDate < today) {
            setError('Дата події має бути в майбутньому.');
            return;
        }

        // Validate title and ownerName
        if (!title.trim()) {
            setError('Назва списку бажань є обов’язковою.');
            return;
        }
        if (!ownerName.trim()) {
            setError('Ім’я власника є обов’язковим.');
            return;
        }

        const dto: WishlistCreateDto = { title, ownerName, eventDate, ownerId };
        try {
            const newWishlist = await createWishlist(dto);
            localStorage.setItem('lastCreatedWishlist', JSON.stringify(newWishlist));
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
        <div className="wishlist-create-form">
            <div className="wishlist-create-form__header">
                <h2>
                    <i className="fas fa-list-ul"></i>Створити список бажань
                </h2>
            </div>
            <div className="wishlist-create-form__body">
                {error && (
                    <div className="wishlist-create-form__error" role="alert">
                        {error}
                    </div>
                )}
                <form>
                    <div className="wishlist-create-form__field">
                        <label className="wishlist-create-form__label">
                            Назва списку бажань <span>*</span>
                        </label>
                        <input
                            type="text"
                            className="wishlist-create-form__input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="День народження"
                            required
                        />
                    </div>
                    <div className="wishlist-create-form__field">
                        <label className="wishlist-create-form__label">
                            Ім’я власника <span>*</span>
                        </label>
                        <input
                            type="text"
                            className="wishlist-create-form__input"
                            value={ownerName}
                            onChange={(e) => setOwnerName(e.target.value)}
                            placeholder="Ваше ім’я"
                            required
                        />
                    </div>
                    <div className="wishlist-create-form__field">
                        <label className="wishlist-create-form__label">
                            Дата події <span>*</span>
                        </label>
                        <input
                            type="date"
                            className="wishlist-create-form__input"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            min={minDate}
                            required
                        />
                        <small className="wishlist-create-form__hint">
                            Оберіть дату в майбутньому 
                        </small>
                    </div>
                    <button
                        type="button"
                        className="wishlist-create-form__button"
                        onClick={handleCreate}
                    >
                        <i className="fas fa-plus"></i>Створити список
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WishlistCreateForm;
