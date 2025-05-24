import React, { useState, useEffect } from 'react';
import wishesBanner from '../img/wishes_banner.jpg';
import WishlistList from './WishlistList';
import Confetti from 'react-confetti';
import WishlistCreateForm from './WishlistCreateForm';
import GiftItemForm from './GiftItemForm';
import GiftItemList from './GiftItemList';

const Home = () => {
    const [showForms, setShowForms] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newWishlistId, setNewWishlistId] = useState<string | null>(null);

    const handleGiftAdded = () => {
        // No-op for now; GiftItemList handles its own updates
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewWishlistId(null);
    };

    const handleWishlistCreated = (wishlistId: string) => {
        setShowConfetti(true);
        setNewWishlistId(wishlistId);
        setTimeout(() => setShowConfetti(false), 3000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-[var(--primary-pink)] to-[var(--primary-teal)] font-['Poppins'] text-gray-800">
            {showConfetti && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    colors={['#f472b6', '#2dd4bf', '#facc15']}
                />
            )}
            <nav className="navbar navbar-expand-lg navbar-dark bg-[var(--primary-pink)] shadow-lg">
                <div className="container-fluid">
                    <a className="navbar-brand fw-bold" href="#">
                        <i className="fas fa-birthday-cake mr-2"></i>Wishes
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="#">Режим іменинника</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Режим гостя</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    <i className="fas fa-robot mr-2"></i>Помічник AI
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container mt-5">
                <div className="relative mb-6 flex justify-center overflow-auto">
                    <div className="banner-wrapper flex flex-col items-center justify-center gap-6 py-8">
                        <img
                            src={wishesBanner}
                            alt="Святковий банер"
                            className="rounded-lg shadow-lg"
                            style={{ width: '300px', height: '300px' }}
                            onError={() => console.error("Failed to load banner image")}
                        />
                        <p className="text-xl md:text-2xl text-white font-semibold bg-gradient-to-r from-[#2dd4bf] to-[#facc15] bg-clip-text animate-pulse-slow">
                            Створюйте та діліться списком бажань на день народження з друзями та родиною!
                        </p>
                    </div>
                </div>

                <div className="md:w-1/4 text-center md:text-left mb-6">
                    <button
                        className="btn btn-primary rounded-full px-8 py-3 text-lg font-bold bg-gradient-to-r from-[#f472b6] to-[#2dd4bf] hover:from-[#facc15] hover:to-[#f472b6] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 text-white"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <i className="fas fa-plus mr-2"></i>Створити новий список бажань
                    </button>
                </div>


                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto">
                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 w-full max-w-3xl my-8 border-4 border-gradient-to-r from-[#f472b6] to-[#2dd4bf] shadow-2xl animate-fade-in">
                            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white/10 backdrop-blur-md p-4 rounded-t-lg z-10">
                                <h2 className="text-2xl font-bold text-white">
                                    {newWishlistId ? 'Додайте подарунки до списку' : 'Створіть новий список бажань'}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-200 hover:text-red-500 transition-colors duration-200 text-xl"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            {/* Wishlist Creation Form */}
                            {!newWishlistId && (
                                <div className="mb-8">
                                    <WishlistCreateForm
                                        onWishlistCreated={() => {
                                            const newWishlist = JSON.parse(localStorage.getItem('lastCreatedWishlist') || '{}');
                                            if (newWishlist && newWishlist.id) {
                                                handleWishlistCreated(newWishlist.id.toString());
                                            }
                                        }}
                                    />
                                </div>
                            )}

                            {/* Gift Item Form and List */}
                            {newWishlistId && (
                                <div className="space-y-8">
                                    <GiftItemForm wishlistId={newWishlistId} onGiftAdded={handleGiftAdded} />
                                    <GiftItemList wishlistId={newWishlistId} />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Existing Content (Overlapped by Modal) */}
                <div className="mt-8">
                    <h2 className="text-2xl md:text-3xl text-white font-bold mb-6 text-center">
                        Існуючі картки бажань
                    </h2>
                    <WishlistList />
                </div>
            </div>
        </div>
    );
};

// Add animation keyframes
const styles = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
        animation: fadeIn 0.3s ease-out;
    }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default Home;

