namespace SharedWishlistWebApp.Models;
using System.ComponentModel.DataAnnotations;

public class GiftItem
{
    public GiftItem()
    {
        GiftReservations = new List<GiftReservation>();
    }
    public int Id { get; set; }
    [Required, MaxLength(100)]
    public string Title { get; set; } = string.Empty;
    [MaxLength(500)]
    public string? Description { get; set; }
    [Url]
    public string? Link { get; set; }
    public decimal? Price { get; set; }

    public int WishlistId { get; set; }
    public Wishlist Wishlist { get; set; } = null!;

    public ICollection<GiftReservation> GiftReservations { get; set; } = new List<GiftReservation>();
}

