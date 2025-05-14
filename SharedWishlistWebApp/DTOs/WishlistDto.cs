namespace SharedWishlistWebApp.DTOs
{
    public class WishlistDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string OwnerName { get; set; } = string.Empty;
        public DateTime? EventDate { get; set; }
        public string ShareCode { get; set; } = string.Empty;
        public List<GiftItemDto> GiftItems { get; set; } = new();
    }
}
