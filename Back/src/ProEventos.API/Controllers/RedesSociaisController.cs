using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProEventos.Application;
using ProEventos.Application.Contratos;
using ProEventos.Application.DTOs;

namespace ProEventos.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class RedesSociaisController : ControllerBase
{
    private readonly IRedeSocialService _redeSocialService;
    private readonly IEventoService _eventoService;
    private readonly IPalestranteService _palestranteService;

    public RedesSociaisController(IRedeSocialService redeSocialService,
                                IEventoService eventoService,
                                IPalestranteService palestranteService)
    {
        _redeSocialService = redeSocialService;
        _eventoService = eventoService;
        _palestranteService = palestranteService;
    }

}
