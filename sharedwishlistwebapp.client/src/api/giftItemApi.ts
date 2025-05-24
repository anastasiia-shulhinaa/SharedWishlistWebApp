import type { GiftItemCreateDto, GiftItemDto } from '../types/types';

const baseUrl = '/api/gift-items';

export async function createGiftItem(wishlistId: string, ownerId: string, dto: GiftItemCreateDto): Promise<GiftItemDto> {
    const query = `?wishlistId=${wishlistId}&ownerId=${ownerId}`;
    const response = await fetch(baseUrl + query, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
    });

    if (!response.ok) {
        throw new Error('Failed to create gift item');
    }

    return response.json();
}

export async function getGiftItems(wishlistId: string, ownerId: string): Promise<GiftItemDto[]> {
    const query = `?wishlistId=${wishlistId}&ownerId=${ownerId}`;
    const response = await fetch(baseUrl + query);

    if (!response.ok) {
        throw new Error('Failed to fetch gift items');
    }

    return response.json();
}
