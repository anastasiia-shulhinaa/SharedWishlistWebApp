import React, { useState, useEffect } from 'react';
import { getWishlist, getWishlistsByOwnerId, deleteWishlist } from '../api/wishlistApi';
import { getGiftItems } from '../api/giftItemApi';
import type { WishlistDto, GiftItemDto } from '../types/types';
import { getOrCreateOwnerId } from '../utils/ownerutils';
import '../styles/confirmation-model.css';

const WishlistList: React.FC<{ refresh?: number }> = ({ refresh = 0 }) => {
    const [wishlists, setWishlists] = useState<WishlistDto[]>([]);
    const [giftItemsMap, setGiftItemsMap] = useState<Record<string, GiftItemDto[]>>({});
    const [error, setError] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false); // State for modal visibility
    const [wishlistToDelete, setWishlistToDelete] = useState<string | null>(null); // ID of wishlist to delete
    const ownerId = getOrCreateOwnerId();

    const loadWishlists = async () => {
        try {
            const data = await getWishlistsByOwnerId(ownerId);

            // Current date for comparison (May 26, 2025)
            const currentDate = new Date('2025-05-26');

            // Filter out wishlists with event dates in the past
            const futureWishlists = data.filter((wishlist) => {
                if (!wishlist.eventDate) return true; // Keep wishlists with no event date
                const eventDate = new Date(wishlist.eventDate);
                return eventDate >= currentDate;
            });

            // Sort wishlists by event date (nearest to farthest)
            const sortedData = futureWishlists.sort((a, b) => {
                const dateA = a.eventDate ? new Date(a.eventDate).getTime() : Infinity;
                const dateB = b.eventDate ? new Date(b.eventDate).getTime() : Infinity;
                return dateA - dateB;
            });

            setWishlists(sortedData);
            setError('');

            // Fetch gift items for each wishlist
            const giftItemsPromises = sortedData.map((wishlist) =>
                getGiftItems(wishlist.id, ownerId)
            );
            const giftItemsResults = await Promise.all(giftItemsPromises);
            console.log('Gift Items Results:', giftItemsResults); // Debug: Check raw results

            // Map results to wishlist IDs
            const newGiftItemsMap: Record<string, GiftItemDto[]> = {};
            sortedData.forEach((wishlist, index) => {
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
    }, [refresh]); // Re-run when refresh prop changes

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
        setWishlistToDelete(wishlistId); // Set the wishlist to delete
        setShowConfirmModal(true); // Show confirmation modal
    };

    const confirmDelete = async () => {
        if (!wishlistToDelete) return;

        try {
            await deleteWishlist(wishlistToDelete, ownerId);
            setWishlists(wishlists.filter((wishlist) => wishlist.id.toString() !== wishlistToDelete));
            const updatedGiftItemsMap = { ...giftItemsMap };
            delete updatedGiftItemsMap[wishlistToDelete];
            setGiftItemsMap(updatedGiftItemsMap);
            setError('');
        } catch (err: any) {
            setError('Не вдалося видалити список: ' + err.message);
        } finally {
            setShowConfirmModal(false); // Close modal after action
            setWishlistToDelete(null); // Reset wishlist to delete
        }
    };

    const cancelDelete = () => {
        setShowConfirmModal(false); // Close modal
        setWishlistToDelete(null); // Reset wishlist to delete
    };

    return (
        <div className="fade-in">
            <h2 className="text-3xl font-bold text-white mb-4 text-shadow">
                <i className="fas fa-list-ul icon mr-2"></i>Існуючі вішлісти
            </h2>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            {wishlists.length === 0 ? (
                <div className="text-center text-gray-200 text-lg">
                    Немає списків бажань для майбутніх подій
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
                                <h4 className="text-lg font-semibold">{wishlist.title}</h4>
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
            {showConfirmModal && (
                <ConfirmationModal
                    message="Ви впевнені, що хочете видалити цей список бажань?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </div>
    );
};

// Confirmation Modal Component
const ConfirmationModal: React.FC<{
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}> = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="confirmation-modal">
                <div className="confirmation-modal__header">
                    <h2 className="text-2xl font-bold text-white">
                        <i className="fas fa-exclamation-triangle mr-2"></i>Підтвердження
                    </h2>
                </div>
                <div className="confirmation-modal__body">
                    <p className="mb-4 text-white">{message}</p>
                    <div className="flex justify-end gap-4">
                        <button
                            className="btn btn-secondary rounded-full px-4 py-2 text-sm font-bold"
                            onClick={onCancel}
                        >
                            Скасувати
                        </button>
                        <button
                            className="btn btn-danger rounded-full px-4 py-2 text-sm font-bold"
                            onClick={onConfirm}
                        >
                            Видалити
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WishlistList; 