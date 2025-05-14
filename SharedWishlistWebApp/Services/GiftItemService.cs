using AutoMapper;
using SharedWishlistWebApp.DTOs;
using SharedWishlistWebApp.Models;
using Microsoft.EntityFrameworkCore;

namespace SharedWishlistWebApp.Services
{
    public class GiftItemService
    {
        private readonly WishlistApiContext _context;
        private readonly IMapper _mapper;

        public GiftItemService(WishlistApiContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<GiftItemDto> CreateGiftItemAsync(int wishlistId, string ownerId, GiftItemCreateDto dto)
        {
            var wishlist = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.Id == wishlistId && w.OwnerId == ownerId)
                ?? throw new Exception("Wishlist not found or unauthorized");

            var giftItem = _mapper.Map<GiftItem>(dto);
            giftItem.WishlistId = wishlistId;
            _context.GiftItems.Add(giftItem);
            await _context.SaveChangesAsync();
            return _mapper.Map<GiftItemDto>(giftItem);
        }

        public async Task<GiftItemDto> GetGiftItemAsync(int giftItemId)
        {
            var giftItem = await _context.GiftItems
                .FirstOrDefaultAsync(g => g.Id == giftItemId)
                ?? throw new Exception("Gift item not found");
            return _mapper.Map<GiftItemDto>(giftItem);
        }

        public async Task<GiftItemDto> UpdateGiftItemAsync(int giftItemId, string ownerId, GiftItemUpdateDto dto)
        {
            var giftItem = await _context.GiftItems
                .Include(g => g.Wishlist)
                .FirstOrDefaultAsync(g => g.Id == giftItemId && g.Wishlist.OwnerId == ownerId)
                ?? throw new Exception("Gift item not found or unauthorized");
            _mapper.Map(dto, giftItem);
            await _context.SaveChangesAsync();
            return _mapper.Map<GiftItemDto>(giftItem);
        }

        public async Task DeleteGiftItemAsync(int giftItemId, string ownerId)
        {
            var giftItem = await _context.GiftItems
                .Include(g => g.Wishlist)
                .FirstOrDefaultAsync(g => g.Id == giftItemId && g.Wishlist.OwnerId == ownerId)
                ?? throw new Exception("Gift item not found or unauthorized");
            _context.GiftItems.Remove(giftItem);
            await _context.SaveChangesAsync();
        }
    }
}
