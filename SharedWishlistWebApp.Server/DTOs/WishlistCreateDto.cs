using System.ComponentModel.DataAnnotations;

namespace SharedWishlistWebApp.Server.DTOs
{
    public class WishlistCreateDto
    {
        [Required, MaxLength(100)]
        public string Title { get; set; } = string.Empty;
        [Required, MaxLength(50)]
        public string OwnerName { get; set; } = string.Empty;
        public DateTime? EventDate { get; set; }
    }
}
