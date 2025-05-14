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
[Route("api/gift-items")]
public class GiftItemController : ControllerBase
{
    private readonly GiftItemService _giftItemService;

    public GiftItemController(GiftItemService giftItemService)
    {
        _giftItemService = giftItemService;
    }

    [HttpPost]
    public async Task<ActionResult<GiftItemDto>> CreateGiftItem([FromQuery] int wishlistId, [FromQuery] string ownerId, [FromBody] GiftItemCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var giftItem = await _giftItemService.CreateGiftItemAsync(wishlistId, ownerId, dto);
            return CreatedAtAction(nameof(GetGiftItem), new { giftItemId = giftItem.Id }, giftItem);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }

    [HttpGet("{giftItemId}")]
    public async Task<ActionResult<GiftItemDto>> GetGiftItem(int giftItemId)
    {
        try
        {
            var giftItem = await _giftItemService.GetGiftItemAsync(giftItemId);
            return Ok(giftItem);
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPut("{giftItemId}")]
    public async Task<ActionResult<GiftItemDto>> UpdateGiftItem(int giftItemId, [FromQuery] string ownerId, [FromBody] GiftItemUpdateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var giftItem = await _giftItemService.UpdateGiftItemAsync(giftItemId, ownerId, dto);
            return Ok(giftItem);
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("{giftItemId}")]
    public async Task<ActionResult> DeleteGiftItem(int giftItemId, [FromQuery] string ownerId)
    {
        try
        {
            await _giftItemService.DeleteGiftItemAsync(giftItemId, ownerId);
            return NoContent();
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }
}