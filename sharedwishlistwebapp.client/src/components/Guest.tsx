// src/components/Guest.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { WishlistGuestViewDto, GiftItemGuestViewDto, GiftReservationCreateDto } from '../types/types';
import GiftItemListGuest from './GiftItemListGuest';
import ReserveGiftFormGuest from './ReserveGiftFormGuest';
import { getWishlistByShareCode } from '../api/guestApi';

const Guest: React.FC = () => {
    const { shareCode } = useParams<{ shareCode: string }>();
    const [wishlist, setWishlist] = useState<WishlistGuestViewDto | null>(null);
    const [error, setError] = useState('');
    const [selectedGift, setSelectedGift] = useState<GiftItemGuestViewDto | null>(null);

    useEffect(() => {
        const loadWishlist = async () => {
            try {
                if (!shareCode) throw new Error('No share code provided');
                const data = await getWishlistByShareCode(shareCode);
                setWishlist(data);
                setError('');
            } catch (err: any) {
                setError('Не вдалося завантажити список бажань: ' + err.message);
            }
        };
        loadWishlist();
    }, [shareCode]);

    const handleReserve = async (giftId: string, dto: GiftReservationCreateDto) => {
        try {
            await import('../api/guestApi').then(({ reserveGift }) => reserveGift(giftId, dto));
            setSelectedGift(null);
            setError('');
        } catch (err: any) {
            setError('Не вдалося зарезервувати подарунок: ' + err.message);
        }
    };

    const handleCancel = () => {
        setSelectedGift(null);
    };

    if (!wishlist) return <div className="text-center text-white mt-10">Завантаження...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-r from-[var(--primary-pink)] to-[var(--primary-teal)] font-['Poppins'] text-gray-800 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6 text-center bg-gradient-to-r from-[#2dd4bf] to-[#facc15] bg-clip-text">
                    Список бажань: {wishlist.title}
                </h1>

                {error && (
                    <div className="alert alert-danger text-center mb-6" role="alert">
                        {error}
                    </div>
                )}

                <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6 shadow-lg border-2 border-[var(--primary-teal)]">
                    <h2 className="text-xl font-semibold text-white mb-4">Деталі списку</h2>
                    <p><strong>Власник:</strong> {wishlist.ownerName}</p>
                    <p><strong>Дата події:</strong> {wishlist.eventDate
                        ? new Date(wishlist.eventDate).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
                        : 'Не вказано'}</p>
                </div>

                <GiftItemListGuest shareCode={shareCode!} onReserve={(gift) => setSelectedGift(gift)} />

                {selectedGift && (
                    <ReserveGiftFormGuest
                        gift={selectedGift}
                        onReserve={handleReserve}
                        onCancel={handleCancel}
                        error={error}
                    />
                )}
            </div>
        </div>
    );
};

export default Guest;