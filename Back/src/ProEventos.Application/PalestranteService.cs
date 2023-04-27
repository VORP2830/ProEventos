using AutoMapper;
using ProEventos.Application.Contratos;
using ProEventos.Application.DTOs;
using ProEventos.Domain;
using ProEventos.Domain.Models;
using ProEventos.Persistence.Contratos;
using ProEventos.Persistence.models;

namespace ProEventos.Application
{
    public class PalestranteService : IPalestranteService
    {
        private readonly IPalestrantePersist _palestrantePersist;
        private readonly IMapper _mapper;

        public PalestranteService(IPalestrantePersist palestrantePersist, IMapper mapper)
        {
            _palestrantePersist = palestrantePersist;
            _mapper = mapper;
        }
        public async Task<PalestranteDTO> AddPalestrante(int userId, PalestranteAddDTO model)
        {
            try
            {
                var Palestrante = _mapper.Map<PalestranteDTO>(model);
                Palestrante.UserId = userId;
                _palestrantePersist.Add<PalestranteDTO>(Palestrante);
                if(await _palestrantePersist.SaveChangesAsync())
                {
                    var PalestranteRetorno = await _palestrantePersist.GetPalestranteByUserIdAsync(userId, false);
                    return _mapper.Map<PalestranteDTO>(PalestranteRetorno);
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<PalestranteDTO> UpdatePalestrante(int userId, PalestranteUpdateDTO model)
        {
            try
            {
                var palestrante = await _palestrantePersist.GetPalestranteByUserIdAsync(userId, false);
                if(palestrante == null) return null;
                model.Id = palestrante.Id;
                model.UserId = userId;
                _mapper.Map(model, palestrante);
                _palestrantePersist.Update<Palestrante>(palestrante);
                if(await _palestrantePersist.SaveChangesAsync())
                {
                    var palestranteRetorno = await _palestrantePersist.GetPalestranteByUserIdAsync(userId, false);
                    return _mapper.Map<PalestranteDTO>(palestranteRetorno);
                }
                return null;
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<PageList<PalestranteDTO>> GetAllPalestranteAsync(PageParams pageParams, bool includeEventos = false)
        {
            try
            {
                var Palestrantes = await _palestrantePersist.GetAllPalestrantesAsync(pageParams ,includeEventos);
                if(Palestrantes == null) return null;
                var palestranteRetorno = _mapper.Map<PageList<PalestranteDTO>>(Palestrantes);

                palestranteRetorno.CurrentPage = Palestrantes.CurrentPage;
                palestranteRetorno.TotalPages = Palestrantes.TotalPages;
                palestranteRetorno.PageSize = Palestrantes.PageSize;
                palestranteRetorno.TotalCount = Palestrantes.TotalCount;

                return palestranteRetorno;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<PalestranteDTO> GetPalestranteByUserIdAsync(int userId, bool includeEventos = false)
        {
            try
            {
                var Palestrante = await _palestrantePersist.GetPalestranteByUserIdAsync(userId, includeEventos);
                if(Palestrante == null) return null;
                var palestranteRetorno = _mapper.Map<PalestranteDTO>(Palestrante);
                return palestranteRetorno;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}