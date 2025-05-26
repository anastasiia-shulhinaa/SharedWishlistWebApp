
using Microsoft.EntityFrameworkCore;
using SharedWishlistWebApp.Server.Models;
using SharedWishlistWebApp.Server.Services;

namespace SharedWishlistWebApp.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContext<WishlistApiContext>(option =>
                option.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddAutoMapper(typeof(Program));
            builder.Services.AddScoped<WishlistService>();
            builder.Services.AddScoped<GiftItemService>();
            builder.Services.AddScoped<GiftReservationService>();
            builder.Services.AddScoped<GuestService>();
            builder.Services.AddScoped<WishlistGuestService>();

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.WithOrigins("https://localhost:64917")
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });

            


            var app = builder.Build();

            app.UseCors("AllowAll");
            app.UseDefaultFiles();
            app.MapStaticAssets();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
