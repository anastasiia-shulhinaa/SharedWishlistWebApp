namespace SharedWishlistWebApp.Server.DTOs
{
    public class GiftItemGuestViewDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Link { get; set; }
        public decimal? Price { get; set; }
        public bool IsFullyReserved { get; set; }
        public decimal? ReservedAmount { get; set; } // Sum of contributions
        public List<GiftReservationDto> Reservations { get; set; } = new();
    }
}
