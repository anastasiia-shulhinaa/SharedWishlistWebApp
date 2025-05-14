using AutoMapper;
using SharedWishlistWebApp.DTOs;
using SharedWishlistWebApp.Models;
using Microsoft.EntityFrameworkCore;

namespace SharedWishlistWebApp.Services
{
    public class WishlistService
    {
        private readonly WishlistApiContext _context;
        private readonly IMapper _mapper;

        public WishlistService(WishlistApiContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<(WishlistDto Wishlist, string OwnerId)> CreateWishlistAsync(WishlistCreateDto dto)
        {
            var wishlist = _mapper.Map<Wishlist>(dto);
            wishlist.OwnerId = Guid.NewGuid().ToString();
            wishlist.ShareCode = Guid.NewGuid().ToString("N").Substring(0, 8);
            _context.Wishlists.Add(wishlist);
            await _context.SaveChangesAsync();
            return (_mapper.Map<WishlistDto>(wishlist), wishlist.OwnerId);
        }

        public async Task<WishlistDto> GetWishlistForOwnerAsync(int wishlistId, string ownerId)
        {
            var wishlist = await _context.Wishlists
                .Include(w => w.GiftItems)
                .FirstOrDefaultAsync(w => w.Id == wishlistId && w.OwnerId == ownerId)
                ?? throw new Exception("Wishlist not found or unauthorized");
            return _mapper.Map<WishlistDto>(wishlist);
        }

        public async Task<WishlistGuestViewDto> GetWishlistByShareCodeAsync(string shareCode)
        {
            var wishlist = await _context.Wishlists
                .Include(w => w.GiftItems)
                .ThenInclude(g => g.GiftReservations)
                .FirstOrDefaultAsync(w => w.ShareCode == shareCode)
                ?? throw new Exception("Wishlist not found");
            return _mapper.Map<WishlistGuestViewDto>(wishlist);
        }

        public async Task<WishlistDto> UpdateWishlistAsync(int wishlistId, string ownerId, WishlistUpdateDto dto)
        {
            var wishlist = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.Id == wishlistId && w.OwnerId == ownerId)
                ?? throw new Exception("Wishlist not found or unauthorized");
            _mapper.Map(dto, wishlist);
            await _context.SaveChangesAsync();
            return _mapper.Map<WishlistDto>(wishlist);
        }

        public async Task DeleteWishlistAsync(int wishlistId, string ownerId)
        {
            var wishlist = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.Id == wishlistId && w.OwnerId == ownerId)
                ?? throw new Exception("Wishlist not found or unauthorized");
            _context.Wishlists.Remove(wishlist);
            await _context.SaveChangesAsync();
        }
    }
}
