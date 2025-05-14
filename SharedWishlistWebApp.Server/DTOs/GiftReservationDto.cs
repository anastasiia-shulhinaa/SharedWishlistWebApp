namespace SharedWishlistWebApp.Server.DTOs
{
    public class GiftReservationDto
    {
        public int Id { get; set; }
        public int GiftItemId { get; set; }
        public int GuestId { get; set; }
        public decimal? ContributionAmount { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime ReservedAt { get; set; }
    }
}