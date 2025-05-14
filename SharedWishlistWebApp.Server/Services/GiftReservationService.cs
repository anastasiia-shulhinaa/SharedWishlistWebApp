using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SharedWishlistWebApp.Server.DTOs;
using SharedWishlistWebApp.Server.Models;

namespace SharedWishlistWebApp.Server.Services
{
    public class GiftReservationService
    {
        private readonly WishlistApiContext _context;
        private readonly IMapper _mapper;

        public GiftReservationService(WishlistApiContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<GiftItemGuestViewDto> ReserveGiftAsync(int giftItemId, GiftReservationCreateDto dto, int guestId)
        {
            var giftItem = await _context.GiftItems
                .Include(g => g.GiftReservations)
                .Include(g => g.Wishlist)
                .FirstOrDefaultAsync(g => g.Id == giftItemId)
                ?? throw new Exception("Gift item not found");

            var isGuest = await _context.WishlistGuests
                .AnyAsync(wg => wg.WishlistId == giftItem.WishlistId && wg.GuestId == guestId);
            if (!isGuest)
                throw new Exception("Guest not authorized for this wishlist");

            var totalReserved = giftItem.GiftReservations.Sum(r => r.ContributionAmount ?? 0);
            if (totalReserved + (dto.ContributionAmount) > (giftItem.Price ?? 0))
                throw new Exception("Contribution exceeds remaining amount");

            var reservation = new GiftReservation
            {
                GiftItemId = giftItemId,
                GuestId = guestId,
                ContributionAmount = dto.ContributionAmount,
                Status = "Confirmed"
            };

            _context.GiftReservations.Add(reservation);
            await _context.SaveChangesAsync();
            return _mapper.Map<GiftItemGuestViewDto>(giftItem);
        }

        public async Task<GiftItemGuestViewDto> CancelReservationAsync(int reservationId, int guestId)
        {
            var reservation = await _context.GiftReservations
                .Include(r => r.GiftItem)
                .ThenInclude(g => g.Wishlist)
                .FirstOrDefaultAsync(r => r.Id == reservationId && r.GuestId == guestId)
                ?? throw new Exception("Reservation not found or unauthorized");

            _context.GiftReservations.Remove(reservation);
            await _context.SaveChangesAsync();

            var giftItem = await _context.GiftItems
                .Include(g => g.GiftReservations)
                .FirstOrDefaultAsync(g => g.Id == reservation.GiftItemId)
                ?? throw new Exception("Gift item not found");
            return _mapper.Map<GiftItemGuestViewDto>(giftItem);
        }
    }
}
