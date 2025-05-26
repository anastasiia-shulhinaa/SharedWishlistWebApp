// ReserveGiftFormGuest.tsx

import React, { useState } from 'react';
import { reserveGift, cancelReservation } from '../api/guestApi';
import type { GiftItemGuestViewDto, GiftReservationCreateDto } from '../types/types';
import '../styles/reserve-form.css';


interface ReserveGiftFormGuestProps {
    giftItem: GiftItemGuestViewDto;
    onReservationSuccess: (updatedGiftItem: GiftItemGuestViewDto) => void;
    onCancel: () => void;
}

const ReserveGiftFormGuest: React.FC<ReserveGiftFormGuestProps> = ({ giftItem, onReservationSuccess, onCancel }) => {
    const [paymentOption, setPaymentOption] = useState<'full' | 'divide'>('full');
    const [contributionAmount, setContributionAmount] = useState<number | undefined>(undefined);
    const [error, setError] = useState<string>('');

    // Calculate the total reserved amount and remaining amount
    const totalReserved = giftItem.reservations.reduce((sum, reservation) => sum + (reservation.contributionAmount || 0), 0);
    const remainingAmount = (giftItem.price || 0) - totalReserved;

    const handleReserve = async () => {
        if (paymentOption === 'divide' && (contributionAmount === undefined || contributionAmount <= 0)) {
            setError('Внесок має бути більше 0.');
            return;
        }

        if (paymentOption === 'divide' && contributionAmount && contributionAmount > remainingAmount) {
            setError(`Внесок не може перевищувати залишкову суму (${remainingAmount} ₴).`);
            return;
        }

        const dto: GiftReservationCreateDto = {
            giftItemId: giftItem.id,
            contributionAmount: paymentOption === 'full' ? remainingAmount : contributionAmount,
        };

        try {
            const updatedGiftItem = await reserveGift(giftItem.id.toString(), dto);
            setError('');
            onReservationSuccess(updatedGiftItem);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="reserve-gift-form">
            <div className="reserve-gift-form__header">
                <h2>
                    <i className="fas fa-gift"></i>Зарезервувати подарунок
                </h2>
            </div>
            <div className="reserve-gift-form__body">
                {error && (
                    <div className="reserve-gift-form__error" role="alert">
                        {error}
                    </div>
                )}
                <p>Подарунок: <strong>{giftItem.title}</strong></p>
                <p>Ціна: {giftItem.price ? `${giftItem.price} ₴` : 'Не вказано'}</p>
                <p>Вже зарезервовано: {totalReserved} ₴</p>
                <p>Залишилося: {remainingAmount} ₴</p>

                <div className="reserve-gift-form__field">
                    <label className="reserve-gift-form__label">
                        Спосіб оплати
                    </label>
                    <div>
                        <label>
                            <input
                                type="radio"
                                value="full"
                                checked={paymentOption === 'full'}
                                onChange={() => {
                                    setPaymentOption('full');
                                    setContributionAmount(undefined);
                                }}
                            />
                            Сплатити повністю ({remainingAmount} ₴)
                        </label>
                        <label style={{ marginLeft: '1rem' }}>
                            <input
                                type="radio"
                                value="divide"
                                checked={paymentOption === 'divide'}
                                onChange={() => setPaymentOption('divide')}
                            />
                            Розділити з іншими
                        </label>
                    </div>
                </div>

                {paymentOption === 'divide' && (
                    <div className="reserve-gift-form__field">
                        <label className="reserve-gift-form__label">
                            Ваш внесок <span>*</span>
                        </label>
                        <input
                            type="number"
                            className="reserve-gift-form__input"
                            value={contributionAmount ?? ''}
                            onChange={(e) => setContributionAmount(e.target.value ? Math.max(0, Number(e.target.value)) : undefined)}
                            placeholder="Введіть суму (₴)"
                            min="0"
                            step="0.01"
                            required
                        />
                        <small className="reserve-gift-form__hint">
                            Введіть суму, яку ви готові внести (максимум {remainingAmount} ₴).
                        </small>
                    </div>
                )}

                <div className="reserve-gift-form__actions">
                    <button
                        className="reserve-gift-form__cancel-button"
                        onClick={onCancel}
                    >
                        <i className="fas fa-times"></i>Скасувати
                    </button>
                    <button
                        className="reserve-gift-form__button"
                        onClick={handleReserve}
                    >
                        <i className="fas fa-check"></i>Зарезервувати
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReserveGiftFormGuest;