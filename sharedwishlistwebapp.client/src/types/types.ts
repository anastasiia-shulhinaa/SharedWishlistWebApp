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
    name: string;
    giftItems: GiftItemDto[];
}

export interface CreateWishlistResponse {
    ownerId: string;
    wishlist: WishlistDto;
}
