using ProEventos.Application.DTOs;
using ProEventos.Persistence.models;

namespace ProEventos.Application.Contratos
{
    public interface IEventoService
    {
        Task<EventoDTO> AddEventos(int userId, EventoDTO model);
        Task<EventoDTO> UpdateEvento(int userId, int eventoId, EventoDTO model);
        Task<bool> DeleteEvento(int userId, int eventoId);
        Task<PageList<EventoDTO>> GetAllEventosByPalestranteIdAsync(int userId, PageParams pageParams, bool includePalestrantes = false);
        Task<EventoDTO> GetEventoByIdAsync(int userId, int eventoId, bool includePalestrantes = false);
        Task<PageList<EventoDTO>> GetAllEventosAsync(PageParams pageParams , bool includePalestrantes = false);
    }
}