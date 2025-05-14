using Microsoft.EntityFrameworkCore;


namespace SharedWishlistWebApp.Models
{
    public class WishlistApiContext : DbContext
    {
        public WishlistApiContext(DbContextOptions<WishlistApiContext> options)
            : base(options)
        {
            Database.EnsureCreated();
        }

        public DbSet<Wishlist> Wishlists { get; set; }
        public DbSet<GiftItem> GiftItems { get; set; }
        public DbSet<Guest> Guests { get; set; }
        public DbSet<GiftReservation> GiftReservations { get; set; }
        public DbSet<WishlistGuest> WishlistGuests { get; set; }
    }
}
