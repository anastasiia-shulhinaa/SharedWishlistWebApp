import React, { useState } from 'react';

const WishlistShareForm: React.FC = () => {
    const [wishlistId, setWishlistId] = useState('');

    const handleShare = () => {
        alert(`Посилання на список скопійовано: https://wishes.app/group/${wishlistId}`);
    };

    return (
        <div className="card p-4 fade-in">
            <div className="card-header bg-[var(--primary-pink)] text-white rounded-t-lg">
                <h2 className="text-xl font-bold mb-0">
                    <i className="fas fa-share-alt mr-2"></i>Поділитися посиланням на список
                </h2>
            </div>
            <div className="card-body">
                <p className="text-gray-600 mb-3">Поширення списку буде доступне незабаром!</p>
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control rounded-lg border-gray-300 focus:border-[var(--primary-teal)] focus:ring focus:ring-[var(--primary-teal)] focus:ring-opacity-50"
                        value={wishlistId}
                        onChange={(e) => setWishlistId(e.target.value)}
                        placeholder="Введіть ID списку для поширення"
                    />
                    <button
                        className="btn btn-primary rounded-full px-4 py-2 hover:bg-[#26a69a] hover:scale-105 transition-transform"
                        onClick={handleShare}
                        disabled
                    >
                        <i className="fas fa-share-alt mr-2"></i>Поділитися
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WishlistShareForm;