using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SharedWishlistWebApp.DTOs;
using SharedWishlistWebApp.Models;
using SharedWishlistWebApp.Services;

[ApiController]
[Route("api/guests")]
public class GuestController : ControllerBase
{
    private readonly GuestService _guestService;

    public GuestController(GuestService guestService)
    {
        _guestService = guestService;
    }

    [HttpPost("join")]
    public async Task<ActionResult<GuestDto>> JoinWishlist([FromQuery] string shareCode, [FromBody] GuestCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var guest = await _guestService.JoinWishlistAsync(shareCode, dto);
            return CreatedAtAction(nameof(GetGuest), new { guestId = guest.Id }, guest);
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpGet("{guestId}")]
    public async Task<ActionResult<GuestDto>> GetGuest(int guestId)
    {
        try
        {
            var guest = await _guestService.GetGuestAsync(guestId);
            return Ok(guest);
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }
}
