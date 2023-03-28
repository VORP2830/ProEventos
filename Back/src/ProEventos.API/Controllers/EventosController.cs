using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ProEventos.Application;
using ProEventos.Domain.Models;

namespace ProEventos.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventosController : ControllerBase
{
    private readonly IEventoService _eventoService;

    public EventosController(IEventoService eventoService)
    {
        _eventoService = eventoService;

    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        try
        {
            var eventos = await _eventoService.GetAllEventosAsync(true);
            if(eventos == null) return NotFound("Nenhum evento encontrado");
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
            var evento = await _eventoService.GetEventoByIdAsync(id);
            if(evento == null) return NotFound("Evento não encontrado");
            return Ok(evento);

        }
        catch (Exception ex)
        {
            return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
        }
    }

    [HttpGet("{tema}/tema")]
    public async Task<IActionResult> GetByTema(string tema)
    {
        try
        {
            var evento = await _eventoService.GetAllEventosByTemaAsync(tema);
            if(evento == null) return NotFound("Eventos por tema não encontrado.");
            return Ok(evento);

        }
        catch (Exception ex)
        {
            return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
        }
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Evento model)
    {
        try
        {
            var evento = _eventoService.AddEventos(model);
            if(evento == null) return BadRequest("O eventos é requerido.");
            return Ok(evento);
        }
        catch (Exception ex)
        {
            return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put([FromBody] Evento model, int id)
    {
        try
        {
            var evento = _eventoService.UpdateEvento(id, model);
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
            if(await _eventoService.DeleteEvento(id)) return Ok("Deletado");
            return BadRequest("Erro ao deletar evento");
        }
        catch (Exception ex)
        {
            return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
        }
    }
}
