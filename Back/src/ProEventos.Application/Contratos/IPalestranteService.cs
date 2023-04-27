using ProEventos.Application.DTOs;
using ProEventos.Persistence.models;

namespace ProEventos.Application.Contratos
{
    public interface IPalestranteService
    {
        Task<PalestranteDTO> AddPalestrante(int userId, PalestranteAddDTO model);
        Task<PalestranteDTO> UpdatePalestrante(int userId, PalestranteUpdateDTO model);
        Task<PageList<PalestranteDTO>> GetAllPalestranteAsync(PageParams pageParams, bool includeEventos = false);
        Task<PalestranteDTO> GetPalestranteByUserIdAsync(int userId, bool includeEventos = false);
    }
}