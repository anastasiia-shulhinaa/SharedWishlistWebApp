import React, { useState } from 'react';
import { createGiftItem } from '../api/giftItemApi';
import type { GiftItemCreateDto } from '../types/types';
import { getOrCreateOwnerId } from '../utils/ownerutils';
import '../styles/gifts-form.css';

const GiftItemForm: React.FC<{ wishlistId: string; onGiftAdded: () => void }> = ({
    wishlistId,
    onGiftAdded,
}) => {
    const [giftTitle, setGiftTitle] = useState('');
    const [giftDescription, setGiftDescription] = useState('');
    const [giftLink, setGiftLink] = useState('');
    const [giftPrice, setGiftPrice] = useState<number | undefined>(undefined);
    const [giftError, setGiftError] = useState('');
    const ownerId = getOrCreateOwnerId();

    const handleAddGiftItem = async () => {
        // Validation checks
        if (!wishlistId) {
            setGiftError('Спочатку створіть або завантажте список');
            return;
        }

        if (!giftTitle) {
            setGiftError('Назва подарунка є обов’язковою');
            return;
        }

        if (giftPrice !== undefined && giftPrice < 0) {
            setGiftError('Ціна не може бути від’ємною');
            return;
        }

        const dto: GiftItemCreateDto = {
            title: giftTitle,
            description: giftDescription || undefined,
            link: giftLink || undefined,
            price: giftPrice,
        };
        try {
            await createGiftItem(wishlistId, ownerId, dto);
            setGiftTitle('');
            setGiftDescription('');
            setGiftLink('');
            setGiftPrice(undefined);
            setGiftError('');
            onGiftAdded();
        } catch (err: any) {
            setGiftError('Не вдалося додати подарунок: ' + err.message);
        }
    };

    return (
        <div className="gift-item-form">
            <div className="gift-item-form__header">
                <h2>
                    <i className="fas fa-gift"></i> Додати подарунок
                </h2>
            </div>
            <div className="gift-item-form__body">
                {giftError && (
                    <div className="gift-item-form__error" role="alert">
                        {giftError}
                    </div>
                )}
                <form>
                    <div className="gift-item-form__field">
                        <label className="gift-item-form__label">
                            Назва подарунка <span>*</span>
                        </label>
                        <input
                            type="text"
                            className="gift-item-form__input"
                            value={giftTitle}
                            onChange={(e) => setGiftTitle(e.target.value)}
                            placeholder="Назва подарунка"
                            required
                        />
                    </div>
                    <div className="gift-item-form__field">
                        <label className="gift-item-form__label">Опис</label>
                        <textarea
                            className="gift-item-form__input"
                            rows={4}
                            value={giftDescription}
                            onChange={(e) => setGiftDescription(e.target.value)}
                            placeholder="Опис подарунка (необов’язково)"
                        />
                    </div>
                    <div className="gift-item-form__field">
                        <label className="gift-item-form__label">Посилання на покупку</label>
                        <input
                            type="url"
                            className="gift-item-form__input"
                            value={giftLink}
                            onChange={(e) => setGiftLink(e.target.value)}
                            placeholder="Посилання на покупку (необов’язково)"
                        />
                    </div>
                    <div className="gift-item-form__field">
                        <label className="gift-item-form__label">Ціна (гривні, ₴)</label>
                        <input
                            type="number"
                            className="gift-item-form__input"
                            value={giftPrice ?? ''}
                            onChange={(e) => setGiftPrice(e.target.value ? Number(e.target.value) : undefined)}
                            placeholder="Ціна подарунка (необов’язково)"
                            step="0.01"
                            min="0"
                        />
                    </div>
                    <button
                        type="button"
                        className="gift-item-form__button"
                        onClick={handleAddGiftItem}
                    >
                        <i className="fas fa-plus"></i> Додати подарунок
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GiftItemForm; 