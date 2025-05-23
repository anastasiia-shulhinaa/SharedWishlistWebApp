using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SharedWishlistWebApp.Server.DTOs;
using SharedWishlistWebApp.Server.Models;

namespace SharedWishlistWebApp.Server.Services
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

        public async Task<List<GiftItemDto>> GetGiftItemsByWishlistAsync(int wishlistId, string ownerId)
        {
            var wishlist = await _context.Wishlists
                .Include(w => w.GiftItems)
                .FirstOrDefaultAsync(w => w.Id == wishlistId && w.OwnerId == ownerId);

            if (wishlist == null)
                throw new Exception("Wishlist not found or does not belong to the specified owner.");

            return wishlist.GiftItems.Select(g => new GiftItemDto
            {
                Id = g.Id,
                Title = g.Title,
                Description = g.Description,
                Link = g.Link,
                Price = g.Price
            }).ToList();
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
