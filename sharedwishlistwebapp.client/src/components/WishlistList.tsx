import React, { useState, useEffect } from 'react';
import { getWishlist, getWishlistsByOwnerId, deleteWishlist } from '../api/wishlistApi';
import { getGiftItems } from '../api/giftItemApi';
import type { WishlistDto, GiftItemDto } from '../types/types';
import { getOrCreateOwnerId } from '../utils/ownerutils';

const WishlistList: React.FC = () => {
    const [wishlists, setWishlists] = useState<WishlistDto[]>([]);
    const [giftItemsMap, setGiftItemsMap] = useState<Record<string, GiftItemDto[]>>({});
    const [error, setError] = useState('');
    const ownerId = getOrCreateOwnerId();

    const loadWishlists = async () => {
        try {
            const data = await getWishlistsByOwnerId(ownerId);
            setWishlists(data);
            setError('');

            // Fetch gift items for each wishlist
            const giftItemsPromises = data.map((wishlist) =>
                getGiftItems(wishlist.id, ownerId)
            );
            const giftItemsResults = await Promise.all(giftItemsPromises);
            console.log('Gift Items Results:', giftItemsResults); // Debug: Check raw results

            // Map results to wishlist IDs
            const newGiftItemsMap: Record<string, GiftItemDto[]> = {};
            data.forEach((wishlist, index) => {
                newGiftItemsMap[wishlist.id.toString()] = giftItemsResults[index] || [];
                console.log(`Wishlist ID: ${wishlist.id}, Gift Items:`, giftItemsResults[index]); // Debug: Check mapping
            });
            setGiftItemsMap(newGiftItemsMap);
            console.log('Gift Items Map:', newGiftItemsMap); // Debug: Check final map
        } catch (err: any) {
            setError('Не вдалося завантажити списки або подарунки: ' + err.message);
        }
    };

    useEffect(() => {
        loadWishlists();
    }, []);

    const handleView = async (id: string) => {
        try {
            const wishlist = await getWishlist(id, ownerId);
            alert(`Перегляд списку: ${wishlist.title}`);
        } catch (err: any) {
            setError('Не вдалося завантажити список: ' + err.message);
        }
    };

    const handleShare = (shareCode: string) => {
        const shareUrl = `${window.location.origin}/wishlist/share/${shareCode}`;
        navigator.clipboard.writeText(shareUrl);
        alert('Посилання скопійовано до буфера обміну: ' + shareUrl);
    };

    const handleDelete = async (wishlistId: string) => {
        if (!confirm('Ви впевнені, що хочете видалити цей список бажань?')) return;

        try {
            await deleteWishlist(wishlistId, ownerId);
            setWishlists(wishlists.filter((wishlist) => wishlist.id.toString() !== wishlistId));
            const updatedGiftItemsMap = { ...giftItemsMap };
            delete updatedGiftItemsMap[wishlistId];
            setGiftItemsMap(updatedGiftItemsMap);
            setError('');
        } catch (err: any) {
            setError('Не вдалося видалити список: ' + err.message);
        }
    };

    return (
        <div className="fade-in">
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            {wishlists.length === 0 ? (
                <div className="text-center text-gray-200 text-lg">
                    Немає списків бажань
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlists.map((wishlist) => (
                        <div
                            key={wishlist.id}
                            className="card relative rounded-lg shadow-lg p-6 transition-all duration-300 transform hover:scale-105"
                        >
                            {/* Delete Button */}
                            <button
                                className="absolute top-3 right-3 text-gray-200 hover:text-red-500 transition-colors duration-200"
                                onClick={() => handleDelete(wishlist.id.toString())}
                                title="Видалити"
                            >
                                <i className="fas fa-trash"></i>
                            </button>

                            {/* Wishlist Header */}
                            <div className="mb-4">
                                <h3 className="text-xl font-bold">{wishlist.title}</h3>
                                <p>
                                    Власник: {wishlist.ownerName}
                                </p>
                                <p>
                                    Дата події:{' '}
                                    {wishlist.eventDate
                                        ? new Date(wishlist.eventDate).toLocaleDateString('uk-UA', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })
                                        : 'Не вказано'}
                                </p>
                            </div>

                            {/* Gift Items */}
                            <div className="mb-4">
                                <h4 className="text-lg font-semibold">Подарунки:</h4>
                                {giftItemsMap[wishlist.id.toString()]?.length === 0 ? (
                                    <p className="text-gray-300">Немає подарунків</p>
                                ) : (
                                        <ul className="list-disc list-inside">
                                            {giftItemsMap[wishlist.id.toString()]?.map((item) => (
                                                <li key={item.id}>{item.title}</li>
                                            ))}
                                        </ul>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    className="btn btn-primary rounded-full px-4 py-2 text-sm font-bold"
                                    onClick={() => handleView(wishlist.id.toString())}
                                >
                                    <i className="fas fa-eye mr-2"></i>Переглянути
                                </button>
                                <button
                                    className="btn btn-secondary rounded-full px-4 py-2 text-sm font-bold"
                                    onClick={() => handleShare(wishlist.shareCode)}
                                >
                                    <i className="fas fa-share-alt mr-2"></i>Поширити
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistList;