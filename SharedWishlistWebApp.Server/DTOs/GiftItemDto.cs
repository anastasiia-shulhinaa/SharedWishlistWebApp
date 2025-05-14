namespace SharedWishlistWebApp.Server.DTOs
{
    public class GiftItemDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Link { get; set; }
        public decimal? Price { get; set; }
    }
}
