import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Optional, for navigation if needed later
import wishesBanner from '../img/wishes_banner.jpg';
import WishlistList from './WishlistList';
import Confetti from 'react-confetti';
import WishlistCreateForm from './WishlistCreateForm';
import GiftItemForm from './GiftItemForm';
import GiftItemList from './GiftItemList';
import '../styles/share-form.css';

const Home = () => {
    const [showForms, setShowForms] = useState(false); // Toggle form visibility
    const [showConfetti, setShowConfetti] = useState(false);
    const [showShareWindow, setShowShareWindow] = useState(false); // New state for share window
    const [newWishlistId, setNewWishlistId] = useState<string | null>(null);
    const [refreshWishlists, setRefreshWishlists] = useState(0); // Trigger to refresh WishlistList
    const [refreshGiftItems, setRefreshGiftItems] = useState(0); // Trigger to refresh GiftItemList
    const navigate = useNavigate(); // Optional, for navigation

    const handleGiftAdded = () => {
        setRefreshGiftItems(prev => prev + 1); // Trigger GiftItemList refresh
        setRefreshWishlists(prev => prev + 1); // Trigger WishlistList refresh to update gift items
    };

    const handleWishlistCreated = (wishlistId: string) => {
        setShowConfetti(true);
        setNewWishlistId(wishlistId);
        setRefreshWishlists(prev => prev + 1); // Trigger WishlistList refresh
        setTimeout(() => setShowConfetti(false), 3000);
    };

    const handleReady = () => {
        setShowConfetti(true); // Trigger confetti immediately
        console.log('Confetti triggered, showConfetti:', showConfetti); // Debug log
        setShowShareWindow(true); // Show share window
    };

    const copyToClipboard = () => {
        const shareLink = `https://yourdomain.com/wishlist/${newWishlistId}`;
        navigator.clipboard.writeText(shareLink).then(() => {
            alert('Посилання скопійовано!');
            setShowForms(false); // Close all forms
            setNewWishlistId(null); // Reset wishlist ID
            setShowShareWindow(false); // Close share window
            setShowConfetti(false); // Stop confetti
        });
    };

    const closeAllForms = () => {
        setShowForms(false);
        setNewWishlistId(null);
        setShowShareWindow(false);
    };

    const toggleForms = () => {
        setShowForms(!showForms);
        if (showForms) {
            setNewWishlistId(null); // Reset when closing the form
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-[var(--primary-pink)] to-[var(--primary-teal)] font-['Poppins'] text-gray-800 relative">
            {showConfetti && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    colors={['#f472b6', '#2dd4bf', '#facc15']}
                    numberOfPieces={200}
                    recycle={false}
                    style={{ position: 'absolute', top: 0, left: 0, zIndex: 1000 }} // Ensure full screen coverage
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
                        onClick={toggleForms}
                    >
                        <i className="fas fa-plus mr-2"></i>
                        {showForms ? 'Приховати форму' : 'Створити новий список бажань'}
                    </button>
                </div>

                {/* Collapsible Forms Section */}
                {showForms && (
                    <div className="mb-8 bg-white/10 backdrop-blur-md rounded-lg p-6 border-2 border-[var(--primary-teal)] animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">
                                {newWishlistId ? 'Додайте подарунки до списку' : 'Створіть новий список бажань'}
                            </h2>
                            <button
                                onClick={toggleForms}
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
                                <GiftItemList wishlistId={newWishlistId} refresh={refreshGiftItems} />
                                {/* "Ready" Button */}
                                {refreshGiftItems > 0 && ( // Show button only if gift items are added
                                    <button
                                        className="btn btn-primary rounded-full px-8 py-3 text-lg font-bold bg-gradient-to-r from-[#2dd4bf] to-[#facc15] hover:from-[#f472b6] hover:to-[#2dd4bf] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 text-white"
                                        onClick={handleReady}
                                    >
                                        <i className="fas fa-check mr-2"></i> Готово
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Existing Wishlists */}
                <div className="mt-8">
                    <WishlistList refresh={refreshWishlists} />
                </div>

                {/* Share Window */}
                {showShareWindow && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="share-window">
                            <div className="share-window__header">
                                <h2 className="text-2xl font-bold text-white">
                                    <i className="fas fa-share mr-2"></i>Поділіться списком!
                                </h2>
                                <button
                                    onClick={closeAllForms}
                                    className="text-gray-200 hover:text-red-500 transition-colors duration-200 text-xl"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <div className="share-window__body">
                                <p className="mb-4 text-white">Скопіюйте посилання для спільного доступу:</p>
                                <div className="flex items-center mb-4">
                                    <input
                                        type="text"
                                        className="w-full p-2 rounded-l-lg border border-[var(--primary-teal)] text-white"
                                        value={`https://yourdomain.com/wishlist/${newWishlistId}`}
                                        readOnly
                                    />
                                    <button
                                        className="bg-[var(--primary-teal)] text-white px-4 py-2 rounded-r-lg hover:bg-[var(--primary-lemon)] transition-colors duration-200"
                                        onClick={copyToClipboard}
                                    >
                                        Поділитися
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
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
    @keyframes pulseSlow {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
    }
    .animate-pulse-slow {
        animation: pulseSlow 2s infinite;
    }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default Home; 