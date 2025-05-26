// Guest.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { WishlistGuestViewDto, GiftItemGuestViewDto, GiftReservationCreateDto, GuestCreateDto, GuestDto } from '../types/types';
import GiftItemListGuest from './GiftItemListGuest';
import ReserveGiftFormGuest from './ReserveGiftFormGuest';
import GuestForm from './GuestForm';
import { getOrCreateGuestId, setGuestId } from '../utils/guestUtils';
import { getWishlistByShareCode, reserveGift, cancelReservation } from '../api/guestApi';
import '../styles/guest.css';

const backendUrl = 'https://localhost:7209/api';

const Guest: React.FC = () => {
    const { shareCode } = useParams<{ shareCode: string }>();
    const [wishlist, setWishlist] = useState<WishlistGuestViewDto | null>(null);
    const [error, setError] = useState('');
    const [selectedGift, setSelectedGift] = useState<GiftItemGuestViewDto | null>(null);
    const [showGuestForm, setShowGuestForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const guestId = getOrCreateGuestId();

    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            console.log('Loading data, guestId:', guestId, 'shareCode:', shareCode);
            if (!shareCode) {
                console.log('No shareCode, setting error');
                if (isMounted) {
                    setError('Share code is missing');
                    setShowGuestForm(true);
                    setIsLoading(false);
                }
                return;
            }

            try {
                if (guestId && !isNaN(parseInt(guestId))) {
                    console.log('Checking guest existence for guestId:', guestId);
                    const response = await fetch(`${backendUrl}/guests/${guestId}`, { method: 'HEAD' });
                    console.log('HEAD request response status:', response.status);
                    if (response.ok) {
                        console.log('Guest exists, fetching wishlist...');
                        const wishlistData = await getWishlistByShareCode(shareCode);
                        if (isMounted) {
                            setWishlist(wishlistData);
                            setIsLoading(false);
                        }
                        return;
                    } else {
                        console.log('Guest does not exist or invalid response:', response.statusText);
                    }
                } else {
                    console.log('No valid guestId, showing guest form');
                }
                if (isMounted) {
                    setShowGuestForm(true);
                    setIsLoading(false);
                }
            } catch (err: any) {
                console.error('Error during loadData:', err.message);
                if (isMounted) {
                    setError('Не вдалося завантажити список: ' + err.message);
                    setShowGuestForm(true);
                    setIsLoading(false);
                }
            }
        };

        loadData();
        return () => { isMounted = false; };
    }, [shareCode]);

    const handleGuestSubmit = async (guest: GuestCreateDto, _guestId: string) => {
        try {
            console.log('Submitting guest:', guest);
            setIsLoading(true);
            const response = await fetch(`${backendUrl}/guests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(guest),
            });
            if (!response.ok) throw new Error(await response.text() || 'Failed to register guest');

            const createdGuest: GuestDto = await response.json();
            console.log('Guest created, new ID:', createdGuest.id);
            setGuestId(createdGuest.id);

            const wishlistData = await getWishlistByShareCode(shareCode!);
            setWishlist(wishlistData);
            setShowGuestForm(false);
            setIsLoading(false);
        } catch (err: any) {
            console.error('Error during guest submission:', err.message);
            setError('Не вдалося зареєструвати гостя: ' + err.message);
            setIsLoading(false);
        }
    };

    const handleReservationSuccess = async (updatedGiftItem: GiftItemGuestViewDto) => {
        try {
            setIsLoading(true);
            // Update the wishlist with the new gift item state
            if (wishlist) {
                const updatedGiftItems = wishlist.giftItems.map(gift =>
                    gift.id === updatedGiftItem.id ? updatedGiftItem : gift
                );
                setWishlist({ ...wishlist, giftItems: updatedGiftItems });
            }
            setSelectedGift(null);
            setError('');
            setIsLoading(false);
        } catch (err: any) {
            setError('Не вдалося оновити список після резервування: ' + err.message);
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setSelectedGift(null);
    };

    if (error.includes('Sorry, your wishlists can view only guests')) {
        return (
            <div className="guest-error-modal">
                <div className="guest-error-modal__content">
                    <div className="guest-error-modal__header">
                        <h2>Помилка</h2>
                    </div>
                    <div className="guest-error-modal__body">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) return <div className="guest-loading">Завантаження...</div>;

    if (showGuestForm) {
        return (
            <div className="guest-container">
                <div className="guest-content">
                    {error && <div className="guest-error">{error}</div>}
                    <GuestForm
                        onSubmit={handleGuestSubmit}
                        onCancel={() => setShowGuestForm(false)}
                        error={error}
                    />
                </div>
            </div>
        );
    }

    if (!wishlist) return <div className="guest-not-found">Список не знайдено</div>;

    return (
        <div className="guest-container">
            <div className="guest-content">
                <h1 className="guest-title">Список бажань: {wishlist.title}</h1>
                {error && <div className="guest-error">{error}</div>}
                <div className="guest-wishlist-details">
                    <h2 className="guest-wishlist-details__header">Деталі списку</h2>
                    <p><strong>Власник:</strong> {wishlist.ownerName}</p>
                    <p><strong>Дата події:</strong> {wishlist.eventDate
                        ? new Date(wishlist.eventDate).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
                        : 'Не вказано'}</p>
                </div>
                <GiftItemListGuest giftItems={wishlist.giftItems} onReserve={(gift) => setSelectedGift(gift)} />
                {selectedGift && (
                    <ReserveGiftFormGuest
                        giftItem={selectedGift}
                        onReservationSuccess={handleReservationSuccess}
                        onCancel={handleCancel}
                    />
                )}
            </div>
        </div>
    );
};

export default Guest; 