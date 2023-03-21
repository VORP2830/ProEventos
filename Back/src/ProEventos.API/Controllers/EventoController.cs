using Microsoft.AspNetCore.Mvc;

namespace ProEventos.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventoController : ControllerBase
{
    public EventoController()
    {
    }

    [HttpGet(Name = "GetEvento")]
    public string Get()
    {
        return "value";
    }
}
