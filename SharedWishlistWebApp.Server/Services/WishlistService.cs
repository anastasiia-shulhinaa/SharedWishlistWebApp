﻿using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SharedWishlistWebApp.Server.DTOs;
using SharedWishlistWebApp.Server.Models;

namespace SharedWishlistWebApp.Server.Services
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

        public async Task<WishlistDto> CreateWishlistAsync(WishlistCreateDto dto)
        {
            var wishlist = _mapper.Map<Wishlist>(dto);
            wishlist.ShareCode = Guid.NewGuid().ToString("N").Substring(0, 8);
            _context.Wishlists.Add(wishlist);
            await _context.SaveChangesAsync();
            return (_mapper.Map<WishlistDto>(wishlist));
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

        public async Task<List<WishlistDto>> GetWishlistsByOwnerIdAsync(string ownerId)
        {
            if (string.IsNullOrEmpty(ownerId))
                throw new ArgumentException("OwnerId cannot be null or empty");

            var wishlists = await _context.Wishlists
                .Where(w => w.OwnerId == ownerId)
                .Include(w => w.GiftItems)
                .ToListAsync();

            if (wishlists == null || !wishlists.Any())
                return new List<WishlistDto>();

            return _mapper.Map<List<WishlistDto>>(wishlists);
        }

        public async Task<bool> IsOwnerAsync(string shareCode, string ownerId)
        {
            var wishlist = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.ShareCode == shareCode);
            return wishlist != null && wishlist.OwnerId == ownerId;
        }


    }
}
