// src/components/WishlistView.tsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getWishlistByShareCode } from '../api/wishlistApi';
import type { WishlistGuestViewDto } from '../types/types';

const WishlistView = () => {
    const { shareCode } = useParams<{ shareCode: string }>();
    const [wishlist, setWishlist] = useState<WishlistGuestViewDto | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (shareCode) {
            getWishlistByShareCode(shareCode)
                .then((data) => setWishlist(data))
                .catch(() => setError('Failed to load wishlist'));
        }
    }, [shareCode]);

    if (error) return <div>{error}</div>;
    if (!wishlist) return <div>Loading wishlist...</div>;

    return (
        <div>
            <h2>Viewing: {wishlist.title}</h2>
            <ul>
                {wishlist.giftItems.map(item => (
                    <li key={item.id}>
                        {item.name} - {item.description} {item.isReserved ? '(Reserved)' : ''}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WishlistView;