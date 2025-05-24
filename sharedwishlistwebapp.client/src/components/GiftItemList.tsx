import React, { useState, useEffect } from 'react';
import { getGiftItems } from '../api/giftItemApi';
import type { GiftItemDto } from '../types/types';
import { getOrCreateOwnerId } from '../utils/ownerutils';

const GiftItemList: React.FC<{ wishlistId: string }> = ({ wishlistId }) => {
    const [giftItems, setGiftItems] = useState<GiftItemDto[]>([]);
    const [giftError, setGiftError] = useState('');
    const ownerId = getOrCreateOwnerId();

    const loadGiftItems = async () => {
        try {
            const items = await getGiftItems(wishlistId, ownerId);
            setGiftItems(items);
            setGiftError('');
        } catch (err: any) {
            setGiftError('Не вдалося завантажити подарунки: ' + err.message);
        }
    };

    useEffect(() => {
        if (wishlistId) {
            loadGiftItems();
        }
    }, [wishlistId]);

    return (
        <div className="card p-4 fade-in border-2 border-[var(--primary-lemon)]">
            <div className="card-header bg-[var(--primary-pink)] text-white rounded-t-lg">
                <h2 className="text-xl font-bold mb-0">
                    <i className="fas fa-gift mr-2"></i>Подарунки
                </h2>
            </div>
            <div className="card-body">
                {giftError && (
                    <div className="alert alert-danger" role="alert">
                        {giftError}
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="table table-hover rounded-lg shadow-sm bg-white w-full">
                        <thead>
                            <tr>
                                <th scope="col" className="text-center">Зображення</th>
                                <th scope="col" className="text-center">Подарунок</th>
                                <th scope="col" className="text-center">Опис</th>
                                <th scope="col" className="text-center">Ціна</th>
                                <th scope="col" className="text-center">Посилання</th>
                                <th scope="col" className="text-center">Дії</th>
                            </tr>
                        </thead>
                        <tbody>
                            {giftItems.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center text-gray-500 py-4">
                                        Немає подарунків
                                    </td>
                                </tr>
                            ) : (
                                giftItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-[var(--soft-white)]">
                                        <td className="text-center">
                                            <img
                                                src={`https://source.unsplash.com/60x60/?${item.title}`}
                                                alt={item.title}
                                                className="gift-image rounded mx-auto"
                                                style={{ width: '60px', height: '60px' }}
                                            />
                                        </td>
                                        <td className="text-center align-middle">{item.title}</td>
                                        <td className="text-center align-middle">{item.description || '-'}</td>
                                        <td className="text-center align-middle">{item.price ? `₴${item.price.toFixed(2)}` : '-'}</td>
                                        <td className="text-center align-middle">
                                            {item.link ? (
                                                <a
                                                    href={item.link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-[var(--primary-teal)] hover:underline"
                                                >
                                                    Купити
                                                </a>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                        <td className="text-center align-middle">
                                            <button
                                                className="btn btn-primary btn-sm rounded-full mr-2"
                                                disabled
                                                title="Редагувати (скоро буде)"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                className="btn btn-lemon btn-sm rounded-full"
                                                disabled
                                                title="Видалити (скоро буде)"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GiftItemList; 