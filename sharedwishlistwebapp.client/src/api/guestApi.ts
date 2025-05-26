// guestApi.ts

import type { WishlistGuestViewDto, GiftItemGuestViewDto, GiftReservationCreateDto } from '../types/types';
import { getOrCreateGuestId } from '../utils/guestUtils';
import { getOrCreateOwnerId } from '../utils/ownerutils';

const backendUrl = 'https://localhost:7209/api';
const guestId = getOrCreateGuestId();
const ownerId = getOrCreateOwnerId();

export async function getWishlistByShareCode(shareCode: string): Promise<WishlistGuestViewDto> {
    const headers: HeadersInit = {
        'Owner-Id': ownerId,
    };
    if (guestId) {
        headers['Guest-Id'] = guestId;
    }

    const response = await fetch(`${backendUrl}/wishlists/share/${shareCode}`, { headers });
    if (!response.ok) throw new Error(await response.text() || 'Wishlist not found');
    return response.json();
}

export async function reserveGift(giftId: string, dto: GiftReservationCreateDto): Promise<GiftItemGuestViewDto> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Owner-Id': ownerId,
    };
    if (guestId) {
        headers['Guest-Id'] = guestId;
    }

    const response = await fetch(`${backendUrl}/gift-reservations?giftItemId=${giftId}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(dto),
    });
    if (!response.ok) throw new Error(await response.text() || 'Reservation failed');
    return response.json();
}

export async function cancelReservation(reservationId: number): Promise<GiftItemGuestViewDto> {
    const headers: HeadersInit = {
        'Owner-Id': ownerId,
    };
    if (guestId) {
        headers['Guest-Id'] = guestId;
    }

    const response = await fetch(`${backendUrl}/gift-reservations/${reservationId}`, {
        method: 'DELETE',
        headers,
    });
    if (!response.ok) throw new Error(await response.text() || 'Cancellation failed');
    return response.json();
}