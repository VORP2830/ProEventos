using System.Threading.Tasks;
using ProEventos.Domain.Models;
using ProEventos.Persistence.models;

namespace ProEventos.Persistence.Contratos
{
    public interface IEventoPersist
    {
        Task<PageList<Evento>> GetAllEventosAsync(PageParams pageParams, bool includePalestrantes = false);
        Task<Evento> GetEventoByIdAsync(int userId, int eventoId, bool includePalestrantes = false);
        Task<PageList<Evento>> GetAllEventosByPalestranteIdAsync(int userId, PageParams pageParams, bool includePalestrantes = false);
    }
}