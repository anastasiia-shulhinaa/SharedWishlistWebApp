
// src/utils/ownerUtils.ts

export function getOrCreateOwnerId(): string {
    const key = 'ownerId';
    let ownerId = localStorage.getItem(key);
    if (!ownerId) {
        ownerId = crypto.randomUUID(); // Or use a UUID library
        localStorage.setItem(key, ownerId);
    }
    return ownerId;
}
