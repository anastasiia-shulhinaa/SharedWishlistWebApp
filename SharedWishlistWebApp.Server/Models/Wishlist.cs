using System.ComponentModel.DataAnnotations;

namespace SharedWishlistWebApp.Server.Models
{
    public class Wishlist
    {
        public Wishlist()
        {
            GiftItems = new List<GiftItem>();
            WishlistGuests = new List<WishlistGuest>();
        }
        public int Id { get; set; }
        [Required, MaxLength(100)]
        public string Title { get; set; } = string.Empty;
        [Required, MaxLength(50)]
        public string OwnerName { get; set; } = string.Empty;
        public string OwnerId { get; set; } = Guid.NewGuid().ToString(); // Unique ID for owner
        [Required]
        public string ShareCode { get; set; } = Guid.NewGuid().ToString("N").Substring(0, 8); // Short unique code
        public DateTime? EventDate { get; set; }

        public ICollection<GiftItem> GiftItems { get; set; } = new List<GiftItem>();
        public ICollection<WishlistGuest> WishlistGuests { get; set; } = new List<WishlistGuest>();
    }
}