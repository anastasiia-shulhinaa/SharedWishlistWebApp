import React, { useState, useEffect } from 'react';
import { createWishlist, getWishlist } from '../api/wishlistApi';
import type { WishlistCreateDto, WishlistDto } from '../types/types';
import { getOrCreateOwnerId } from '../utils/ownerutils'; 
import { createGiftItem, getGiftItems } from '../api/giftItemApi';
import type { GiftItemCreateDto, GiftItemDto } from '../types/types';

const Home = () => {
    const [wishlistId, setWishlistId] = useState('');
    const [title, setTitle] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [wishlist, setWishlist] = useState<WishlistDto | null>(null);
    const [error, setError] = useState('');
    const ownerId = getOrCreateOwnerId();
    const [giftItems, setGiftItems] = useState<GiftItemDto[]>([]);
    const [giftTitle, setGiftTitle] = useState('');
    const [giftDescription, setGiftDescription] = useState('');
    const [giftLink, setGiftLink] = useState('');
    const [giftPrice, setGiftPrice] = useState<number | undefined>(undefined);
    const [giftError, setGiftError] = useState('');


    const handleCreate = async () => {
        const dto: WishlistCreateDto = { title, ownerName, eventDate, ownerId };
        try {
            const createdWishlist = await createWishlist(dto); // assume API returns created wishlist or at least its ID
            alert('Wishlist created successfully.');
            setWishlistId(createdWishlist.id); // store the generated ID automatically
            setWishlist(createdWishlist);      // optionally display it immediately
        } catch (err: any) {
            console.error('Create wishlist error:', err);
            alert('Error creating wishlist: ' + err.message);
        }
    };

    const handleGet = async () => {
        if (!wishlistId) {
            setError('No wishlist ID available to fetch.');
            return;
        }
        try {
            setError('');
            const data = await getWishlist(wishlistId, ownerId);
            setWishlist(data);
        } catch (err: any) {
            console.error('Fetch wishlist error:', err);
            setError(err.message || 'Failed to load wishlist');
        }
    };

    useEffect(() => {
        if (wishlistId !== null) {
            loadGiftItems();
        }
    }, [wishlistId]);

    const loadGiftItems = async () => {
        try {
            const items = await getGiftItems(wishlistId!, ownerId);
            setGiftItems(items);
            setGiftError('');
        } catch (err: any) {
            setGiftError(err.message || 'Failed to load gift items');
        }
    };

    const handleAddGiftItem = async () => {
        if (wishlistId === null) {
            alert('Please create or load a wishlist first.');
            return;
        }

        const dto: GiftItemCreateDto = {
            title: giftTitle,
            description: giftDescription || undefined,
            link: giftLink || undefined,
            price: giftPrice,
        };

        try {
            await createGiftItem(wishlistId, ownerId, dto);
            setGiftTitle('');
            setGiftDescription('');
            setGiftLink('');
            setGiftPrice(undefined);
            await loadGiftItems(); // refresh list
        } catch (err: any) {
            setGiftError(err.message || 'Failed to add gift item');
        }
    };

    return (
        <div>
            <h1>Create Your Wishlist</h1>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Wishlist title"
            />
            <br />
            <input
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Owner name"
            />
            <br />
            <input
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                placeholder="Event date"
            />
            <br />
            <button onClick={handleCreate}>Create</button>

            <button onClick={handleGet}>Get Wishlist</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {wishlist && (
                <div>
                    <h3>Wishlist Details</h3>
                    <p><strong>Title:</strong> {wishlist.title}</p>
                    <p><strong>Owner:</strong> {wishlist.ownerName}</p>
                    <p><strong>Event Date:</strong> {wishlist.eventDate}</p>
                </div>
            )}
            <h2>Gift Items</h2>

            {giftError && <p style={{ color: 'red' }}>{giftError}</p>}

            <input
                placeholder="Gift Title"
                value={giftTitle}
                onChange={(e) => setGiftTitle(e.target.value)}
            />
            <br />
            <input
                placeholder="Description"
                value={giftDescription}
                onChange={(e) => setGiftDescription(e.target.value)}
            />
            <br />
            <input
                placeholder="Link"
                value={giftLink}
                onChange={(e) => setGiftLink(e.target.value)}
            />
            <br />
            <input
                type="number"
                placeholder="Price"
                value={giftPrice ?? ''}
                onChange={(e) => setGiftPrice(e.target.value ? Number(e.target.value) : undefined)}
            />
            <br />
            <button onClick={handleAddGiftItem}>Add Gift Item</button>

            <ul>
                {giftItems.map(item => (
                    <li key={item.id}>
                        <strong>{item.title}</strong> - {item.description} - {item.price && `$${item.price.toFixed(2)}`} <br />
                        {item.link && <a href={item.link} target="_blank" rel="noreferrer">Link</a>}
                    </li>
                ))}
            </ul>
        </div>
    );

};

export default Home;