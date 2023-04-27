using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ProEventos.Application;
using ProEventos.Domain.Models;
using ProEventos.Application.DTOs;
using ProEventos.Application.Contratos;
using ProEventos.API.Extensions;
using Microsoft.AspNetCore.Authorization;
using ProEventos.Persistence.models;

namespace ProEventos.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PalestrantesController : ControllerBase
{
    private readonly IPalestranteService _palestranteService;
    private readonly IWebHostEnvironment _hostEnvironment;
    private readonly IAccountService _accountService;

    public PalestrantesController(IPalestranteService palestranteService, IWebHostEnvironment hostEnvironment, IAccountService accountService)
    {
        _palestranteService = palestranteService;
        _hostEnvironment = hostEnvironment;
        _accountService = accountService;
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAll([FromQuery] PageParams pageParams)
    {
        try
        {
            var palestrante = await _palestranteService.GetAllPalestranteAsync(pageParams ,true);
            if(palestrante == null) return NoContent();
            Response.AddPagination(palestrante.CurrentPage, palestrante.PageSize, palestrante.TotalCount, palestrante.TotalPages);
            return Ok(palestrante);
        }
        catch (Exception ex)
        {
            return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar recuperar palestrantes. Erro: {ex.Message}");
        }
    }
    [HttpGet()]
    public async Task<IActionResult> GetById()
    {
        try
        {
            var palestrante = await _palestranteService.GetPalestranteByUserIdAsync(User.GetUserId(), true);
            if(palestrante == null) return NoContent();
            return Ok(palestrante);

        }
        catch (Exception ex)
        {
            return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar recuperar palestrante. Erro: {ex.Message}");
        }
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] PalestranteAddDTO model)
    {
        try
        {
            var palestrante = await _palestranteService.GetPalestranteByUserIdAsync(User.GetUserId(), true);
            if(palestrante == null)
                palestrante = await _palestranteService.AddPalestrante(User.GetUserId(), model);
            return Ok(palestrante);
        }
        catch (Exception ex)
        {
            return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar cadastrar palestrante. Erro: {ex.Message}");
        }
    }

    [HttpPut]
    public async Task<IActionResult> Put([FromBody] PalestranteUpdateDTO model)
    {
        try
        {
            var palestrante = await _palestranteService.UpdatePalestrante(User.GetUserId(), model);
            if(palestrante == null) return BadRequest("O palestrante é requerido.");
            return Ok(palestrante);
        }
        catch (Exception ex)
        {
            return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar alterar palestrante. Erro: {ex.Message}");
        }
    }
}
