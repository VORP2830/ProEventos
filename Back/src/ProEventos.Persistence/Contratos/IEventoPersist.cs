using System.Threading.Tasks;
using ProEventos.Domain.Models;

namespace ProEventos.Persistence.Contratos
{
    public interface IEventoPersist
    {
        Task<Evento[]> GetAllEventosByTemaAsync(int userId, string tema, bool includePalestrantes = false);
        Task<Evento[]> GetAllEventosAsync(int userId, bool includePalestrantes = false);
        Task<Evento> GetEventoByIdAsync(int userId, int eventoId, bool includePalestrantes = false);
    }
}