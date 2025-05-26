// src/components/GuestForm.tsx
import React, { useState } from 'react';
import type { GuestCreateDto } from '../types/types';

interface GuestFormProps {
    onSubmit: (guest: GuestCreateDto, guestId: string) => void;
    onCancel: () => void;
    error?: string;
}

const GuestForm: React.FC<GuestFormProps> = ({ onSubmit, onCancel, error }) => {
    const [guest, setGuest] = useState<GuestCreateDto>({ name: '', contactInfo: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!guest.name.trim()) {
            alert('Будь ласка, введіть ваше ім’я.');
            return;
        }
        onSubmit(guest, ''); // Guest ID is managed by Guest.tsx
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="card p-6 m-4 fade-in bg-white/10 backdrop-blur-md rounded-lg shadow-xl border-2 border-[var(--primary-teal)] max-w-md w-full">
                <div className="card-header bg-[var(--primary-pink)] text-white rounded-t-lg p-4">
                    <h2 className="text-xl font-bold mb-0 flex items-center">
                        <i className="fas fa-user mr-2"></i>Вкажіть вашу інформацію
                    </h2>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="alert alert-danger text-center" role="alert">
                                {error}
                            </div>
                        )}
                        <div className="mb-4">
                            <label className="block text-white mb-2 font-semibold">Ваше ім’я</label>
                            <input
                                type="text"
                                className="form-control w-full p-2 rounded-lg border-gray-300 focus:border-[var(--primary-teal)] focus:ring focus:ring-[var(--primary-teal)] focus:ring-opacity-50"
                                value={guest.name}
                                onChange={(e) => setGuest({ ...guest, name: e.target.value })}
                                placeholder="Введіть ваше ім’я"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white mb-2 font-semibold">Контактна інформація (опціонально)</label>
                            <input
                                type="text"
                                className="form-control w-full p-2 rounded-lg border-gray-300 focus:border-[var(--primary-teal)] focus:ring focus:ring-[var(--primary-teal)] focus:ring-opacity-50"
                                value={guest.contactInfo || ''}
                                onChange={(e) => setGuest({ ...guest, contactInfo: e.target.value })}
                                placeholder="Наприклад, email або телефон"
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="btn btn-primary rounded-full px-4 py-2 hover:bg-[#26a69a] hover:scale-105 transition-transform flex-1"
                                disabled={!guest.name.trim()}
                            >
                                <i className="fas fa-check mr-2"></i>Продовжити
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary rounded-full px-4 py-2 hover:bg-gray-500 hover:scale-105 transition-transform flex-1"
                                onClick={onCancel}
                            >
                                <i className="fas fa-times mr-2"></i>Скасувати
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GuestForm;