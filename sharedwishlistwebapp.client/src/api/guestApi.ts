// src/api/guestApi.ts
import type { WishlistGuestViewDto, GiftItemGuestViewDto, GiftReservationCreateDto } from '../types/types';

const backendUrl = 'https://localhost:7209/api';

export async function getWishlistByShareCode(shareCode: string): Promise<WishlistGuestViewDto> {
    const response = await fetch(`${backendUrl}/wishlists/share/${shareCode}`, {
        headers: {
            'Guest-Id': localStorage.getItem('guestId') || 'guest', // Placeholder; generate as needed
        },
    });
    if (!response.ok) throw new Error(await response.text() || 'Wishlist not found');
    return response.json();
}

export async function getGiftItemsByShareCode(shareCode: string): Promise<GiftItemGuestViewDto[]> {
    const response = await fetch(`${backendUrl}/gift-items/share/${shareCode}`, {
        headers: {
            'Guest-Id': localStorage.getItem('guestId') || 'guest', // Placeholder; generate as needed
        },
    });
    if (!response.ok) throw new Error(await response.text() || 'Failed to fetch gift items');
    return response.json();
}

export async function reserveGift(giftId: string, dto: GiftReservationCreateDto): Promise<void> {
    const response = await fetch(`${backendUrl}/gift-reservations?giftItemId=${giftId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Guest-Id': localStorage.getItem('guestId') || 'guest', // Placeholder; generate as needed
        },
        body: JSON.stringify(dto),
    });
    if (!response.ok) throw new Error(await response.text() || 'Reservation failed');
}