export interface WishlistGuestViewDto {
    id: number;
    title: string;
    ownerName: string;
    eventDate?: string;
    giftItems: GiftItemGuestViewDto[];
}

export interface GiftItemGuestViewDto {
    id: number;
    title: string;
    description?: string;
    price?: number;
    link?: string;
    isFullyReserved: boolean;
    reservedAmount?: number;
    reservations: GiftReservationDto[];
}
export interface GiftReservationDto {
    id: number;
    giftItemId: number;
    guestId: number;
    contributionAmount?: number;
    status: string;
    reservedAt: string; // ISO date string
}

export interface GuestCreateDto {
    name: string;
    contactInfo?: string;
}

export interface GuestDto {
    id: number;
    name: string;
    contactInfo?: string;
}

export interface GiftReservationCreateDto {
    giftItemId: number;
    contributionAmount?: number;
}
export interface GiftItemDto {
    id: string;
    name: string; // Adjusted to match 'name' in your definition
    description: string;
    isReserved: boolean;
    reservedBy?: string;
}

export interface WishlistDto {
    id: string;
    title: string;
    ownerName: string;
    eventDate?: string;
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

export interface CreateWishlistResponse {
    ownerId: string;
    wishlist: WishlistDto;
}

