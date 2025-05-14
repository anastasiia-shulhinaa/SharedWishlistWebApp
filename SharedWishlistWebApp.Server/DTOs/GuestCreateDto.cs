using System.ComponentModel.DataAnnotations;

namespace SharedWishlistWebApp.Server.DTOs
{
    public class GuestCreateDto
    {
        [Required, MaxLength(50)]
        public string Name { get; set; } = string.Empty;
        [MaxLength(100)]
        public string? ContactInfo { get; set; }
    }
}
