using SharedWishlistWebApp.Models;
public class WishlistGuest
{
    public int Id { get; set; }
    public int WishlistId { get; set; }
    public Wishlist Wishlist { get; set; } = null!;

    public int GuestId { get; set; }
    public Guest Guest { get; set; } = null!;

    public DateTime InvitedAt { get; set; } = DateTime.UtcNow;
}