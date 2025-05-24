import React, { useState } from 'react';
import { createGiftItem } from '../api/giftItemApi';
import type { GiftItemCreateDto } from '../types/types';
import { getOrCreateOwnerId } from '../utils/ownerutils';

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
        if (!wishlistId) {
            setGiftError('Спочатку створіть або завантажте список');
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
        <div className="card p-4 mb-4 fade-in border-2 border-[var(--primary-teal)]">
            <div className="card-header bg-[var(--primary-pink)] text-white rounded-t-lg">
                <h2 className="text-xl font-bold mb-0">
                    <i className="fas fa-gift mr-2"></i>Додати подарунок
                </h2>
            </div>
            <div className="card-body">
                {giftError && (
                    <div className="alert alert-danger" role="alert">
                        {giftError}
                    </div>
                )}
                <form>
                    <div className="mb-3">
                        <label className="form-label fw-semibold text-white">Назва подарунка</label>
                        <input
                            type="text"
                            className="form-control rounded-lg border-gray-300 focus:border-[var(--primary-teal)] focus:ring focus:ring-[var(--primary-teal)] focus:ring-opacity-50"
                            value={giftTitle}
                            onChange={(e) => setGiftTitle(e.target.value)}
                            placeholder="Назва подарунка"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold text-white">Опис</label>
                        <textarea
                            className="form-control rounded-lg border-gray-300 focus:border-[var(--primary-teal)] focus:ring focus:ring-[var(--primary-teal)] focus:ring-opacity-50"
                            rows={4}
                            value={giftDescription}
                            onChange={(e) => setGiftDescription(e.target.value)}
                            placeholder="Опис подарунка"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold text-white">Посилання на покупку</label>
                        <input
                            type="url"
                            className="form-control rounded-lg border-gray-300 focus:border-[var(--primary-teal)] focus:ring focus:ring-[var(--primary-teal)] focus:ring-opacity-50"
                            value={giftLink}
                            onChange={(e) => setGiftLink(e.target.value)}
                            placeholder="Посилання на покупку"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold text-white">Ціна (₴)</label>
                        <input
                            type="number"
                            className="form-control rounded-lg border-gray-300 focus:border-[var(--primary-teal)] focus:ring focus:ring-[var(--primary-teal)] focus:ring-opacity-50"
                            value={giftPrice ?? ''}
                            onChange={(e) => setGiftPrice(e.target.value ? Number(e.target.value) : undefined)}
                            placeholder="Ціна подарунка"
                            step="0.01"
                        />
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary rounded-full px-4 py-2 hover:bg-[#26a69a] hover:scale-105 transition-transform"
                        onClick={handleAddGiftItem}
                    >
                        <i className="fas fa-plus mr-2"></i>Додати подарунок
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GiftItemForm; 