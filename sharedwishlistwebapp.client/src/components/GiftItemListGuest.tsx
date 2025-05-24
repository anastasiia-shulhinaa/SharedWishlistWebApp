// src/components/GiftItemListGuest.tsx
import React, { useState, useEffect } from 'react';
import type { GiftItemGuestViewDto } from '../types/types';
import { getGiftItemsByShareCode } from '../api/guestApi';

interface GiftItemListGuestProps {
    shareCode: string;
    onReserve: (gift: GiftItemGuestViewDto) => void;
}

const GiftItemListGuest: React.FC<GiftItemListGuestProps> = ({ shareCode, onReserve }) => {
    const [giftItems, setGiftItems] = useState<GiftItemGuestViewDto[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (shareCode) {
            getGiftItemsByShareCode(shareCode)
                .then((data) => {
                    setGiftItems(data);
                    setError('');
                })
                .catch((err: any) => {
                    setError('Не вдалося завантажити подарунки: ' + err.message);
                });
        }
    }, [shareCode]);

    return (
        <div className="card p-4 mb-4 fade-in bg-white/10 backdrop-blur-md rounded-lg shadow-lg border-2 border-[var(--primary-lemon)]">
            <div className="card-header bg-[var(--primary-pink)] text-white rounded-t-lg p-3">
                <h2 className="text-xl font-bold mb-0 flex items-center">
                    <i className="fas fa-gift mr-2"></i>Подарунки
                </h2>
            </div>
            <div className="card-body p-4">
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
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
                                <th scope="col" className="text-center">Зарезервовано</th>
                                <th scope="col" className="text-center">Сума внесків</th>
                                <th scope="col" className="text-center">Резерви</th>
                                <th scope="col" className="text-center">Дії</th>
                            </tr>
                        </thead>
                        <tbody>
                            {giftItems.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="text-center text-gray-500 py-4">
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
                                            {item.isFullyReserved ? 'Так' : 'Ні'}
                                        </td>
                                        <td className="text-center align-middle">
                                            {item.reservedAmount ? `₴${item.reservedAmount.toFixed(2)}` : '-'}
                                        </td>
                                        <td className="text-center align-middle">
                                            {item.reservations.length}
                                        </td>
                                        <td className="text-center align-middle">
                                            <button
                                                className="btn btn-primary btn-sm rounded-full mr-2"
                                                onClick={() => onReserve(item)}
                                                disabled={item.isFullyReserved}
                                                title={item.isFullyReserved ? 'Fully reserved' : 'Reserve'}
                                            >
                                                <i className="fas fa-check"></i>
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

export default GiftItemListGuest;