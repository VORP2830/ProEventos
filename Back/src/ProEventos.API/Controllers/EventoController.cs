using Microsoft.AspNetCore.Mvc;
using ProEventos.API.Models;

namespace ProEventos.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventoController : ControllerBase
{
    public EventoController()
    {
    }

    [HttpGet]
    public Evento Get()
    {
        return new Evento() {
            EventoId = 1,
            Tema = "Angular e .NET",
            Local = "Aracaju",
            Lote = "1° Lote",
            QtdPessoas = 250,
            DataEvento = DateTime.Now.AddDays(2).ToString(),
            ImagemUrl = "Foto.png"
        };
    }
}
