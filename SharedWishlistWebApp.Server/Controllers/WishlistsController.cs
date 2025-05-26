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

[ApiController]
[Route("api/wishlists")]
public class WishlistController : ControllerBase
{
    private readonly WishlistService _wishlistService;
    private readonly GuestService _guestService;
    private readonly WishlistGuestService _wishlistGuestService;
    public WishlistController(WishlistService wishlistService, GuestService guestService, WishlistGuestService wishlistGuestService)
    {
        _wishlistService = wishlistService;
        _guestService = guestService;
        _wishlistGuestService = wishlistGuestService;
    }

    [HttpPost]
    public async Task<ActionResult<WishlistDto>> CreateWishlist([FromBody] WishlistCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var wishlist = await _wishlistService.CreateWishlistAsync(dto);
            return CreatedAtAction(nameof(GetWishlistForOwner), new { wishlistId = wishlist.Id }, (wishlist));
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }

    [HttpGet("{wishlistId}")]
    public async Task<ActionResult<WishlistDto>> GetWishlistForOwner(int wishlistId, [FromQuery] string ownerId)
    {
        if (string.IsNullOrEmpty(ownerId))
            return BadRequest("OwnerId is required");

        try
        {
            var wishlist = await _wishlistService.GetWishlistForOwnerAsync(wishlistId, ownerId);
            return Ok(wishlist);
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpGet("share/{shareCode}")]
    public async Task<ActionResult<WishlistGuestViewDto>> GetWishlistByShareCode(string shareCode)
    {
        if (string.IsNullOrEmpty(shareCode))
            return BadRequest("ShareCode is required");

        var ownerId = Request.Headers["Owner-Id"].FirstOrDefault();
        var guestId = Request.Headers["Guest-Id"].FirstOrDefault();

        if (string.IsNullOrEmpty(ownerId) && string.IsNullOrEmpty(guestId))
            return BadRequest(new { message = "Either Owner-Id or Guest-Id must be provided in the headers." });

        if (!string.IsNullOrEmpty(ownerId))
        {
            var isOwner = await _wishlistService.IsOwnerAsync(shareCode, ownerId);
            if (isOwner)
            {
                return Unauthorized(new { message = "Sorry, your wishlists can view only guests. If you want statistics or to change something, find the necessary wishlist in your profile and press переглянути." });
            }
        }

        try
        {
            var wishlist = await _wishlistService.GetWishlistByShareCodeAsync(shareCode);

            if (!string.IsNullOrEmpty(guestId) && int.TryParse(guestId, out var parsedGuestId))
            {
                var guestExists = await _guestService.IsGuestAsync(guestId);
                if (guestExists)
                {
                    await _wishlistGuestService.CreateWishlistGuestAsync(wishlist.Id, parsedGuestId);
                }
            }

            return Ok(wishlist);
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPut("{wishlistId}")]
    public async Task<ActionResult<WishlistDto>> UpdateWishlist(int wishlistId, [FromQuery] string ownerId, [FromBody] WishlistUpdateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (string.IsNullOrEmpty(ownerId))
            return BadRequest("OwnerId is required");

        try
        {
            var wishlist = await _wishlistService.UpdateWishlistAsync(wishlistId, ownerId, dto);
            return Ok(wishlist);
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("{wishlistId}")]
    public async Task<ActionResult> DeleteWishlist(int wishlistId, [FromQuery] string ownerId)
    {
        if (string.IsNullOrEmpty(ownerId))
            return BadRequest("OwnerId is required");

        try
        {
            await _wishlistService.DeleteWishlistAsync(wishlistId, ownerId);
            return NoContent();
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpGet("owner/{ownerId}")]
    public async Task<ActionResult<List<WishlistDto>>> GetWishlistsByOwnerId(string ownerId)
    {
        if (string.IsNullOrEmpty(ownerId))
            return BadRequest("OwnerId is required");

        try
        {
            var wishlists = await _wishlistService.GetWishlistsByOwnerIdAsync(ownerId);
            return Ok(wishlists);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }
}