// src/utils/guestUtils.ts
export function getOrCreateGuestId(): string {
    const key = 'guestId';
    const guestId = localStorage.getItem(key) || '';
    return guestId;
}

export function setGuestId(guestId: number): void {
    const key = 'guestId';
    localStorage.setItem(key, guestId.toString());
}
