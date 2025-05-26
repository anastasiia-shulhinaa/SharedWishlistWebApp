import React from 'react';
import type { GiftItemGuestViewDto } from '../types/types';
import '../styles/gifts-cards.css';


interface GiftItemListGuestProps {
    giftItems: GiftItemGuestViewDto[];
    onReserve: (gift: GiftItemGuestViewDto) => void;
}

const GiftItemListGuest: React.FC<GiftItemListGuestProps> = ({ giftItems, onReserve }) => {
    return (
        <div className="gift-list-container">
            <div className="gift-list-header">
                <h2><i className="fas fa-gift"></i> Подарунки</h2>
            </div>
            <div className="gift-list-body">
                {giftItems.length === 0 ? (
                    <div className="gift-list-empty">Немає подарунків</div>
                ) : (
                    <div className="gift-list-grid">
                        {giftItems.map((item) => (
                            <div key={item.id} className="gift-card">
                                <div className="gift-card__image">
                                    <img
                                        src={`https://source.unsplash.com/120x120/?${item.title}`}
                                        alt={item.title}
                                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                    />
                                </div>
                                <h3 className="gift-card__title">{item.title}</h3>
                                <p className="gift-card__description">{item.description || '-'}</p>
                                <p className="gift-card__price"><strong>Ціна:</strong> {item.price ? `₴${item.price.toFixed(2)}` : '-'}</p>
                                <p className="gift-card__link">
                                    <strong>Посилання:</strong>{' '}
                                    {item.link ? (
                                        <a href={item.link} target="_blank" rel="noreferrer">Купити</a>
                                    ) : (
                                        '-'
                                    )}
                                </p>
                                <p className="gift-card__reserved"><strong>Зарезервовано:</strong> {item.isFullyReserved ? 'Так' : 'Ні'}</p>
                                <p className="gift-card__amount"><strong>Сума внесків:</strong> {item.reservedAmount ? `₴${item.reservedAmount.toFixed(2)}` : '-'}</p>
                                <p className="gift-card__reservations"><strong>Резерви:</strong> {item.reservations.length}</p>
                                <button
                                    className="gift-card__reserve-btn"
                                    onClick={() => onReserve(item)}
                                    disabled={item.isFullyReserved}
                                    title={item.isFullyReserved ? 'Fully reserved' : 'Reserve'}
                                >
                                    <i className="fas fa-check"></i> Зарезервувати
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GiftItemListGuest;