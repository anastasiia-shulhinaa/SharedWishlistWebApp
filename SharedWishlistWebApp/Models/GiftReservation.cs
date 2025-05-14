using SharedWishlistWebApp.Models;
using System.ComponentModel.DataAnnotations;

public class GiftReservation
{
    public int Id { get; set; }
    public int GiftItemId { get; set; }
    public GiftItem GiftItem { get; set; } = null!;

    public int GuestId { get; set; }
    public Guest Guest { get; set; } = null!;

    [Range(0, double.MaxValue)]
    public decimal? ContributionAmount { get; set; }
    public string Status { get; set; } = "Pending"; // e.g., "Pending", "Confirmed", "Cancelled"
    public DateTime ReservedAt { get; set; } = DateTime.UtcNow;
}