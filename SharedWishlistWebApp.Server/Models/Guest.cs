using System.ComponentModel.DataAnnotations;

namespace SharedWishlistWebApp.Server.Models
{
    public class Guest
    {
        public Guest()
        {
            GiftReservations = new List<GiftReservation>();
            WishlistGuests = new List<WishlistGuest>();
        }
        public int Id { get; set; }
        [Required, MaxLength(50)]
        public string Name { get; set; } = string.Empty;
        [MaxLength(100)]
        public string? ContactInfo { get; set; } // Instagram, Telegram, phone, etc

        public ICollection<GiftReservation> GiftReservations { get; set; } = new List<GiftReservation>();
        public ICollection<WishlistGuest> WishlistGuests { get; set; } = new List<WishlistGuest>();
    }
}