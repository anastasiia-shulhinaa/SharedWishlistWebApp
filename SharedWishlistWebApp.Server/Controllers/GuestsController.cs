using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SharedWishlistWebApp.Server.DTOs;
using SharedWishlistWebApp.Server.Models;
using SharedWishlistWebApp.Server.Services;

namespace SharedWishlistWebApp.Server.Controllers
{
    [ApiController]
    [Route("api/guests")]
    public class GuestController : ControllerBase
    {
        private readonly GuestService _guestService;

        public GuestController(GuestService guestService)
        {
            _guestService = guestService;
        }

        [HttpPost]
        public async Task<ActionResult<GuestDto>> CreateGuest([FromBody] GuestCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var guest = await _guestService.CreateGuestAsync(dto);
                return Ok(guest);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpHead("{guestId}")]
        public async Task<IActionResult> CheckGuestExists(string guestId)
        {
            if (!int.TryParse(guestId, out _))
                return BadRequest(new { message = "GuestId must be a valid integer." });

            var exists = await _guestService.IsGuestAsync(guestId);
            return exists ? Ok() : NotFound();
        }
    }
}
