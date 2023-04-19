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

namespace ProEventos.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class EventosController : ControllerBase
{
    private readonly IEventoService _eventoService;
    private readonly IWebHostEnvironment _hostEnvironment;
    private readonly IAccountService _accountService;

    public EventosController(IEventoService eventoService, IWebHostEnvironment hostEnvironment, IAccountService accountService)
    {
        _eventoService = eventoService;
        _hostEnvironment = hostEnvironment;
        _accountService = accountService;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        try
        {
            var eventos = await _eventoService.GetAllEventosAsync(User.GetUserId(), true);
            if(eventos == null) return NoContent();
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

    [HttpGet("{tema}/tema")]
    public async Task<IActionResult> GetByTema(string tema)
    {
        try
        {
            var evento = await _eventoService.GetAllEventosByTemaAsync(User.GetUserId(), tema);
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
                DeleteImagem(evento.ImagemUrl);
                evento.ImagemUrl = await SaveImage(file);
            }
            var eventoRetorno = await _eventoService.UpdateEvento(User.GetUserId(), eventoId, evento);
            return Ok(evento);
        }
        catch (Exception ex)
        {
            return this.StatusCode(StatusCodes.Status500InternalServerError,
            $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
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
                DeleteImagem(evento.ImagemUrl);
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

    [NonAction]
    public async Task<string> SaveImage(IFormFile imageFile) 
    {
        string imageName = new String(Path.GetFileNameWithoutExtension(imageFile.FileName).TakeLast(10).ToArray()).Replace(' ', '-');
        imageName = $"{imageName}{DateTime.UtcNow.ToString("yymmssfff")}{Path.GetExtension(imageFile.FileName)}";
        var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, @"Resources/Images", imageName);
        using (var fileStream = new FileStream(imagePath, FileMode.Create))
        {
            await imageFile.CopyToAsync(fileStream);
        }
        return imageName;
    }

    [NonAction]
    public void DeleteImagem(string imageName) 
    {
        var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, @"Resources/Images", imageName);
        if(System.IO.File.Exists(imagePath)) System.IO.File.Delete(imagePath);
    }
}
