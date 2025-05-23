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

    public WishlistController(WishlistService wishlistService)
    {
        _wishlistService = wishlistService;
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

        try
        {
            var wishlist = await _wishlistService.GetWishlistByShareCodeAsync(shareCode);
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
}