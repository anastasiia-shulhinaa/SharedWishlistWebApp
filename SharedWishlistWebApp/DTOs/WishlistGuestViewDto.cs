namespace SharedWishlistWebApp.DTOs
{
    public class WishlistGuestViewDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string OwnerName { get; set; } = string.Empty;
        public DateTime? EventDate { get; set; }
        public List<GiftItemGuestViewDto> GiftItems { get; set; } = new();
    }
}
