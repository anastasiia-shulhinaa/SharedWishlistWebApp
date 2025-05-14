using AutoMapper;
using SharedWishlistWebApp.DTOs;
using SharedWishlistWebApp.Models;
using Microsoft.EntityFrameworkCore;

namespace SharedWishlistWebApp.Services
{
    public class GuestService
    {
        private readonly WishlistApiContext _context;
        private readonly IMapper _mapper;

        public GuestService(WishlistApiContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<GuestDto> JoinWishlistAsync(string shareCode, GuestCreateDto dto)
        {
            var wishlist = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.ShareCode == shareCode)
                ?? throw new Exception("Wishlist not found");
            var guest = _mapper.Map<Guest>(dto);
            _context.Guests.Add(guest);
            _context.WishlistGuests.Add(new WishlistGuest
            {
                WishlistId = wishlist.Id,
                Guest = guest
            });
            await _context.SaveChangesAsync();
            return _mapper.Map<GuestDto>(guest);
        }

        public async Task<GuestDto> GetGuestAsync(int guestId)
        {
            var guest = await _context.Guests
                .FirstOrDefaultAsync(g => g.Id == guestId)
                ?? throw new Exception("Guest not found");
            return _mapper.Map<GuestDto>(guest);
        }
    }
}
