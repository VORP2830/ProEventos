using ProEventos.Application.DTOs;

namespace ProEventos.Application.Contratos
{
    public interface ILoteService
    {
        
        Task<LoteDTO[]> SaveLotes(int eventoId, LoteDTO[] models);
        Task<bool> DeleteLote(int eventoId, int LoteId);

        Task<LoteDTO[]> GetLotesByEventoIdAsync(int eventoId);
        
        Task<LoteDTO> GetLotesByIdsAsync(int eventoId, int loteId);
    }
}