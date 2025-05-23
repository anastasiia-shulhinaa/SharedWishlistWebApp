// src/api/wishlistApi.ts
import type { WishlistCreateDto, WishlistDto, WishlistGuestViewDto } from '../types/types';

export async function createWishlist(dto: WishlistCreateDto): Promise<WishlistDto> {
    const response = await fetch('/api/wishlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        throw new Error('Failed to create wishlist');
    }

    return response.json();  // returning the created wishlist including its id
}

export const getWishlist = async (id: string, ownerId: string) => {
    const response = await fetch(`/api/wishlists/${id}?ownerId=${ownerId}`);
    if (!response.ok) throw new Error(await response.text());
    return response.json();
};


export const getWishlistByShareCode = async (shareCode: string): Promise<WishlistGuestViewDto> => {
    const res = await fetch(`/api/wishlist/${shareCode}`);
    return res.json();
};