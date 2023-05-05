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
using ProEventos.API.helpers;

namespace ProEventos.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class EventosController : ControllerBase
{
    private readonly IEventoService _eventoService;
    private readonly IUtil _util;
    private readonly IAccountService _accountService;
    private readonly string _destino = "Images";

    public EventosController(IEventoService eventoService, IUtil util, IAccountService accountService)
    {
        _eventoService = eventoService;
        _util = util;
        _accountService = accountService;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] PageParams pageParams)
    {
        try
        {
            var eventos = await _eventoService.GetAllEventosByPalestranteIdAsync(User.GetUserId(), pageParams ,true);
            if(eventos == null) return NoContent();
            Response.AddPagination(eventos.CurrentPage, eventos.PageSize, eventos.TotalCount, eventos.TotalPages);
            return Ok(eventos);
        }
        catch (Exception ex)
        {
            return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
        }
    }
    [HttpGet("GetAllEventos")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll([FromQuery] PageParams pageParams)
    {
        try
        {
            var eventos = await _eventoService.GetAllEventosAsync(pageParams ,true);
            if(eventos == null) return NoContent();
            Response.AddPagination(eventos.CurrentPage, eventos.PageSize, eventos.TotalCount, eventos.TotalPages);
            return Ok(eventos);
        }
        catch (Exception ex)
        {
            return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
        }
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var evento = await _eventoService.GetEventoByIdAsync(User.GetUserId(), id);
            if(evento == null) return NoContent();
            return Ok(evento);

        }
        catch (Exception ex)
        {
            return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
        }
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] EventoDTO model)
    {
        try
        {
            var evento = await _eventoService.AddEventos(User.GetUserId(), model);
            if(evento == null) return BadRequest("O eventos é requerido.");
            return Ok(evento);
        }
        catch (Exception ex)
        {
            return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
        }
    }

    [HttpPost("upload-image/{eventoId}")]
    public async Task<IActionResult> uploadImage(int eventoId)
    {
        try
        {
            var evento = await _eventoService.GetEventoByIdAsync(User.GetUserId(), eventoId, true);
            if(evento == null) return NoContent();
            var file = Request.Form.Files[0];
            if(file.Length > 0) 
            {
                _util.DeleteImage(evento.ImagemUrl, _destino);
                evento.ImagemUrl = await _util.SaveImage(file, _destino);
            }
            var eventoRetorno = await _eventoService.UpdateEvento(User.GetUserId(), eventoId, evento);
            return Ok(evento);
        }
        catch (Exception ex)
        {
            return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar realizar upload de foto do evento. Erro: {ex.Message}");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put([FromBody] EventoDTO model, int id)
    {
        try
        {
            var evento = await _eventoService.UpdateEvento(User.GetUserId(), id, model);
            if(evento == null) return BadRequest("O eventos é requerido.");
            return Ok(evento);
        }
        catch (Exception ex)
        {
            return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var evento = await _eventoService.GetEventoByIdAsync(User.GetUserId(), id);
            if(await _eventoService.DeleteEvento(User.GetUserId(), id)) 
            {
                _util.DeleteImage(evento.ImagemUrl, _destino);
                return Ok( new {message = "Deletado"});
            }
            else
            {
                throw new Exception("Ocorreu um erro não especificado ao tentar deletar o evento!");
            }
        }
        catch (Exception ex)
        {
            return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
        }
    }
}
