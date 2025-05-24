// src/components/ReserveGiftFormGuest.tsx
import React, { useState } from 'react';
import type { GiftItemGuestViewDto, GiftReservationCreateDto } from '../types/types';
import { reserveGift } from '../api/guestApi';

const ReserveGiftFormGuest: React.FC<{
    gift: GiftItemGuestViewDto;
    onReserve: (giftId: string, dto: GiftReservationCreateDto) => void;
    onCancel: () => void;
    error?: string;
}> = ({ gift, onReserve, onCancel, error }) => {
    const [contributionAmount, setContributionAmount] = useState<number | undefined>(undefined);
    const [guestName, setGuestName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!guestName.trim()) {
            alert('Будь ласка, введіть ваше ім’я.');
            return;
        }
        const dto: GiftReservationCreateDto = {
            contributionAmount,
            name: guestName,
        };
        onReserve(gift.id, dto);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="card p-6 m-4 fade-in bg-white/10 backdrop-blur-md rounded-lg shadow-xl border-2 border-[var(--primary-teal)] max-w-md w-full">
                <div className="card-header bg-[var(--primary-pink)] text-white rounded-t-lg p-4">
                    <h2 className="text-xl font-bold mb-0 flex items-center">
                        <i className="fas fa-gift mr-2"></i>Reserve Gift: {gift.title}
                    </h2>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="alert alert-danger text-center" role="alert">
                                {error}
                            </div>
                        )}
                        <div className="mb-4">
                            <label className="block text-white mb-2 font-semibold">Ваше ім’я</label>
                            <input
                                type="text"
                                className="form-control w-full p-2 rounded-lg border-gray-300 focus:border-[var(--primary-teal)] focus:ring focus:ring-[var(--primary-teal)] focus:ring-opacity-50"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                                placeholder="Введіть ваше ім’я"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white mb-2 font-semibold">Contribution Amount (₴)</label>
                            <input
                                type="number"
                                className="form-control w-full p-2 rounded-lg border-gray-300 focus:border-[var(--primary-teal)] focus:ring focus:ring-[var(--primary-teal)] focus:ring-opacity-50"
                                min="0"
                                step="0.01"
                                value={contributionAmount ?? ''}
                                onChange={(e) => setContributionAmount(parseFloat(e.target.value) || undefined)}
                                placeholder="Введіть суму внеску (опціонально)"
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="btn btn-primary rounded-full px-4 py-2 hover:bg-[#26a69a] hover:scale-105 transition-transform flex-1"
                                disabled={!guestName.trim()}
                            >
                                <i className="fas fa-check mr-2"></i>Reserve
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary rounded-full px-4 py-2 hover:bg-gray-500 hover:scale-105 transition-transform flex-1"
                                onClick={onCancel}
                            >
                                <i className="fas fa-times mr-2"></i>Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReserveGiftFormGuest;