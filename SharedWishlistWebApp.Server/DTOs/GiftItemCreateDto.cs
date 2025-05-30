﻿using System.ComponentModel.DataAnnotations;

namespace SharedWishlistWebApp.Server.DTOs
{
    public class GiftItemCreateDto
    {
        [Required, MaxLength(100)]
        public string Title { get; set; } = string.Empty;
        [MaxLength(500)]
        public string? Description { get; set; }
        [Url]
        public string? Link { get; set; }
        public decimal? Price { get; set; }
    }
}
