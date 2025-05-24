export interface GiftItemDto {
    id: string;
    name: string;
    description: string;
    isReserved: boolean;
    reservedBy?: string;
}

export interface WishlistDto {
    id: string;
    title: string;       // corresponds to Title in backend?
    ownerName: string;
    eventDate?: string
    shareCode: string;
    giftItems: GiftItemDto[];
}

export interface GiftItemCreateDto {
    title: string;
    description?: string;
    link?: string;
    price?: number;
}

export interface GiftItemDto extends GiftItemCreateDto {
    id: string;
}

export interface WishlistCreateDto {
    title: string;
    ownerName: string;
    eventDate?: string; // optional if you want to support it
    ownerId?: string; // add this if needed
}

export interface WishlistGuestViewDto {
    id: string;
    title: string;
    ownerName: string;
    eventDate?: string;
    giftItems: GiftItemDto[];
}

export interface CreateWishlistResponse {
    ownerId: string;
    wishlist: WishlistDto;
}
export interface WishlistGuestViewDto {
    id: string;
    title: string;
    ownerName: string;
    eventDate?: string; // Optional, ISO date string (e.g., "2025-12-25")
}

export interface GiftItemGuestViewDto {
    id: string;
    title: string;
    description?: string;
    price?: number;
    link?: string;
    isFullyReserved: boolean;
    reservedAmount?: number; // Sum of contributions
    reservations: GiftReservationDto[];
}

export interface GiftReservationDto {
    id: string;
    giftItemId: string;
    guestId: string;
    contributionAmount?: number;
    status: string;
    reservedAt: string; // ISO date string
}

export interface GiftReservationCreateDto {
    contributionAmount?: number; // Optional contribution amount in currency (e.g., UAH)
    name: string; // Guest's name
}
