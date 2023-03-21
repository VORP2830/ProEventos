using Microsoft.AspNetCore.Mvc;
using ProEventos.API.Data;
using ProEventos.API.Models;

namespace ProEventos.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventoController : ControllerBase
{
    private readonly DataContext _context;

    public EventoController(DataContext context)
    {
        _context = context;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Evento>> Get()
    {
        return _context.Eventos;
    }

    [HttpGet("{id}")]
    public Evento GetById(int id)
    {
        return _context.Eventos.FirstOrDefault(evento => evento.EventoId == id);
    }

    [HttpPost]
    public async Task<ActionResult> Post([FromBody] Evento evento)
    {
        await _context.AddAsync(evento);
        _context.SaveChangesAsync();
        return Ok("Evento adicionando com sucesso!");
    }

    [HttpPut("{id}")]
    public ActionResult Put([FromBody] Evento evento, int id)
    {
        var eventoDb = GetById(id);
        if (eventoDb == null)
        {
            return NotFound();
        }
        _context.Update(evento);
        _context.SaveChanges();
        return Ok("Evento alterado com sucesso!");
    }

    [HttpDelete("{id}")]
    public ActionResult Delete(int id)
    {
        var evento = GetById(id);
        if(evento == null)
        {
            return NotFound();
        }
        _context.Remove(evento);
        _context.SaveChanges();
        return Ok("Evento deletado com sucesso!");
    }
}
