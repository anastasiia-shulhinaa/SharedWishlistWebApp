using SharedWishlistWebApp.Server.Models;
using System;
using Microsoft.EntityFrameworkCore;

namespace SharedWishlistWebApp.Server.Services
{
    public class WishlistGuestService
    {
        private readonly WishlistApiContext _context;

        public WishlistGuestService(WishlistApiContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        /// <summary>
        /// Creates a record linking a guest to a wishlist with the current UTC time as InvitedAt.
        /// </summary>
        /// <param name="wishlistId">The ID of the wishlist.</param>
        /// <param name="guestId">The ID of the guest.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        /// <exception cref="ArgumentException">Thrown when wishlistId or guestId is invalid.</exception>
        /// <exception cref="Exception">Thrown when the operation fails due to database issues.</exception>
        public async Task CreateWishlistGuestAsync(int wishlistId, int guestId)
        {
            if (wishlistId <= 0) throw new ArgumentException("WishlistId must be a positive integer.", nameof(wishlistId));
            if (guestId <= 0) throw new ArgumentException("GuestId must be a positive integer.", nameof(guestId));

            var wishlistExists = await _context.Wishlists.AnyAsync(w => w.Id == wishlistId);
            if (!wishlistExists) throw new Exception("Wishlist not found.");

            var guestExists = await _context.Guests.AnyAsync(g => g.Id == guestId);
            if (!guestExists) throw new Exception("Guest not found.");

            var wishlistGuest = new WishlistGuest
            {
                WishlistId = wishlistId,
                GuestId = guestId,
                InvitedAt = DateTime.UtcNow
            };

            _context.WishlistGuests.Add(wishlistGuest);
            await _context.SaveChangesAsync();
        }
    }
}
