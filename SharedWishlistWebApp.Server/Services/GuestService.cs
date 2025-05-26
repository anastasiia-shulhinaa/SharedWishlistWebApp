using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SharedWishlistWebApp.Server.DTOs;
using SharedWishlistWebApp.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace SharedWishlistWebApp.Server.Services
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

        public async Task<GuestDto> CreateGuestAsync(GuestCreateDto dto)
        {
            if (dto == null) throw new ArgumentNullException(nameof(dto));

            // Validate the DTO using DataAnnotations
            var validationContext = new ValidationContext(dto);
            var validationResults = new List<ValidationResult>();
            if (!Validator.TryValidateObject(dto, validationContext, validationResults, true))
            {
                var errors = string.Join(", ", validationResults.Select(r => r.ErrorMessage));
                throw new ValidationException($"Validation failed: {errors}");
            }

            var guest = new Guest
            {
                Name = dto.Name,
                ContactInfo = dto.ContactInfo
            };

            _context.Guests.Add(guest);
            await _context.SaveChangesAsync();

            return new GuestDto
            {
                Id = guest.Id,
                Name = guest.Name,
                ContactInfo = guest.ContactInfo
            };
        }

        public async Task<GuestDto> GetGuestAsync(int guestId)
        {
            var guest = await _context.Guests
                .FirstOrDefaultAsync(g => g.Id == guestId)
                ?? throw new Exception("Guest not found");
            return _mapper.Map<GuestDto>(guest);
        }

        public async Task<bool> IsGuestAsync(string guestId)
        {
            if (string.IsNullOrEmpty(guestId) || !int.TryParse(guestId, out var parsedGuestId))
                return false;

            return await _context.Guests.AnyAsync(g => g.Id == parsedGuestId);
        }
    }
}
