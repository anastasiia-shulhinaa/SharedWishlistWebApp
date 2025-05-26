import React, { useState, useEffect } from 'react';
import { getGiftItems } from '../api/giftItemApi';
import type { GiftItemDto } from '../types/types';
import { getOrCreateOwnerId } from '../utils/ownerutils';
import '../styles/gift-items.css';

const GiftItemList: React.FC<{ wishlistId: string; refresh?: number }> = ({ wishlistId, refresh = 0 }) => {
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
    }, [wishlistId, refresh]);

    return (
        <div className="gift-item-list">
            <div className="gift-item-list__header">
                <h2>
                    <i className="fas fa-gift"></i> Подарунки
                </h2>
            </div>
            <div className="gift-item-list__body">
                {giftError && (
                    <div className="gift-item-list__error" role="alert">
                        {giftError}
                    </div>
                )}
                <div className="gift-item-list__table-container">
                    <table className="gift-item-list__table">
                        <thead>
                            <tr>
                                <th scope="col">Зображення</th>
                                <th scope="col">Подарунок</th>
                                <th scope="col">Опис</th>
                                <th scope="col">Ціна</th>
                                <th scope="col">Посилання</th>
                                <th scope="col">Дії</th>
                            </tr>
                        </thead>
                        <tbody>
                            {giftItems.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="gift-item-list__empty">
                                        Немає подарунків
                                    </td>
                                </tr>
                            ) : (
                                giftItems.map((item) => (
                                    <tr key={item.id} className="gift-item-list__row">
                                        <td>
                                            <img
                                                src={`https://source.unsplash.com/60x60/?${item.title}`}
                                                alt={item.title}
                                                className="gift-item-list__image"
                                            />
                                        </td>
                                        <td>{item.title}</td>
                                        <td>{item.description || '-'}</td>
                                        <td>{item.price ? `₴${item.price.toFixed(2)}` : '-'}</td>
                                        <td>
                                            {item.link ? (
                                                <a
                                                    href={item.link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="gift-item-list__link"
                                                >
                                                    Купити
                                                </a>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                className="gift-item-list__button gift-item-list__button--edit"
                                                disabled
                                                title="Редагувати (скоро буде)"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                className="gift-item-list__button gift-item-list__button--delete"
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