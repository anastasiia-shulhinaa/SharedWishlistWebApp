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
[Route("api/gift-reservations")]
public class GiftReservationController : ControllerBase
{
    private readonly GiftReservationService _giftReservationService;

    public GiftReservationController(GiftReservationService giftReservationService)
    {
        _giftReservationService = giftReservationService;
    }

    [HttpPost]
    public async Task<ActionResult<GiftItemGuestViewDto>> ReserveGift([FromQuery] int giftItemId, [FromBody] GiftReservationCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (!Request.Headers.TryGetValue("Guest-Id", out var guestIdHeader) || !int.TryParse(guestIdHeader, out var guestId))
            return Unauthorized("Guest-Id header is required");

        try
        {
            var giftItem = await _giftReservationService.ReserveGiftAsync(giftItemId, dto, guestId);
            return Ok(giftItem);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{reservationId}")]
    public async Task<ActionResult<GiftItemGuestViewDto>> CancelReservation(int reservationId)
    {
        if (!Request.Headers.TryGetValue("Guest-Id", out var guestIdHeader) || !int.TryParse(guestIdHeader, out var guestId))
            return Unauthorized("Guest-Id header is required");

        try
        {
            var giftItem = await _giftReservationService.CancelReservationAsync(reservationId, guestId);
            return Ok(giftItem);
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }
}