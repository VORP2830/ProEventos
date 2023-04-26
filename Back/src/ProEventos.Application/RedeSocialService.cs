using AutoMapper;
using ProEventos.Application.Contratos;
using ProEventos.Application.DTOs;
using ProEventos.Domain;
using ProEventos.Domain.Models;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Application
{
    public class RedeSocialService : IRedeSocialService
    {
        private readonly IRedeSocialPersist _redeSocialPersist;
        private readonly IMapper _mapper;

        public RedeSocialService(IRedeSocialPersist redeSocialPersist, IMapper mapper)
        {
            _redeSocialPersist = redeSocialPersist;
            _mapper = mapper;
        }

        public async Task AddRedeSocial(int id, RedeSocialDTO models, bool isEvento)
        {
            try
            {
                var RedeSocial = _mapper.Map<RedeSocial>(models);
                if(isEvento)
                {
                    RedeSocial.EventoId = id;  
                    RedeSocial.PalestranteId = null; 
                }
                else
                {
                    RedeSocial.EventoId = null;
                    RedeSocial.PalestranteId = id;
                }
                
                _redeSocialPersist.Add<RedeSocial>(RedeSocial);
                await _redeSocialPersist.SaveChangesAsync();
            }
            catch (System.Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<RedeSocialDTO[]> SaveByEvento(int eventoId, RedeSocialDTO[] models)
        {
            try
            {
                var RedeSocials = await _redeSocialPersist.GetAllByEventoIdAsync(eventoId);
                if (RedeSocials == null)
                {
                    return null;
                }

                foreach (var model in models)
                {
                    if (model.Id == 0)
                    {
                        await AddRedeSocial(eventoId, model, true);
                    }
                    else
                    {
                        var RedeSocial = RedeSocials.FirstOrDefault(RedeSocial => RedeSocial.Id == model.Id);
                        model.EventoId = eventoId;

                        _mapper.Map(model, RedeSocial);

                        _redeSocialPersist.Update<RedeSocial>(RedeSocial);
                        await _redeSocialPersist.SaveChangesAsync();
                    }
                }

                var redeSocialRetorno = await _redeSocialPersist.GetAllByEventoIdAsync(eventoId);

                return _mapper.Map<RedeSocialDTO[]>(redeSocialRetorno);
            }

            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }
        public async Task<RedeSocialDTO[]> SaveByPalestrante(int palestranteId, RedeSocialDTO[] models)
        {
            try
            {
                var RedeSocials = await _redeSocialPersist.GetAllByPalestranteIdAsync(palestranteId);
                if (RedeSocials == null)
                {
                    return null;
                }

                foreach (var model in models)
                {
                    if (model.Id == 0)
                    {
                        await AddRedeSocial(palestranteId, model, false);
                    }
                    else
                    {
                        var RedeSocial = RedeSocials.FirstOrDefault(RedeSocial => RedeSocial.Id == model.Id);
                        model.PalestranteId = palestranteId;

                        _mapper.Map(model, RedeSocial);

                        _redeSocialPersist.Update<RedeSocial>(RedeSocial);
                        await _redeSocialPersist.SaveChangesAsync();
                    }
                }

                var redeSocialRetorno = await _redeSocialPersist.GetAllByPalestranteIdAsync(palestranteId);

                return _mapper.Map<RedeSocialDTO[]>(redeSocialRetorno);
            }

            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }
        public async Task<bool> DeleteByEvento(int eventoId, int redeSocialId)
        {
            try
            {
                var RedeSocial = await _redeSocialPersist.GetRedeSocialEventoByIdsAsync(eventoId, redeSocialId);
                if(RedeSocial == null) throw new Exception("RedeSocial por evento para delete não foi encontrado");
                _redeSocialPersist.Delete<RedeSocial>(RedeSocial);
                return await _redeSocialPersist.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }
        public async Task<bool> DeleteByPalestrante(int palestranteId, int redeSocialId)
        {
            try
            {
                var RedeSocial = await _redeSocialPersist.GetRedeSocialPalestrateByIdsAsync(palestranteId, redeSocialId);
                if(RedeSocial == null) throw new Exception("Rede Social por palestrante para delete não foi encontrado");
                _redeSocialPersist.Delete<RedeSocial>(RedeSocial);
                return await _redeSocialPersist.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }
        public async Task<RedeSocialDTO[]> GetAllByEventoIdAsync(int eventoId)
        {
            try
            {
                var RedeSocials = await _redeSocialPersist.GetAllByEventoIdAsync(eventoId);
                if(RedeSocials == null) return null;
                var RedeSocialDTO = _mapper.Map<RedeSocialDTO[]>(RedeSocials);
                return RedeSocialDTO;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<RedeSocialDTO[]> GetAllByPalestranteIdAsync(int paltesranteId)
        {
            try
            {
                var RedeSocials = await _redeSocialPersist.GetAllByPalestranteIdAsync(paltesranteId);
                if(RedeSocials == null) return null;
                var RedeSocialDTO = _mapper.Map<RedeSocialDTO[]>(RedeSocials);
                return RedeSocialDTO;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<RedeSocialDTO> GetRedeSocialEventoByIdsAsync(int eventoId, int redeSocialId)
        {
            try
            {
                var RedeSocial = await _redeSocialPersist.GetRedeSocialEventoByIdsAsync(eventoId, redeSocialId);
                if(RedeSocial == null) return null;
                var RedeSocialDTO = _mapper.Map<RedeSocialDTO>(RedeSocial);
                return RedeSocialDTO;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<RedeSocialDTO> GetRedeSocialPalestranteByIdsAsync(int palestranteId, int redeSocialId)
        {
            try
            {
                var RedeSocial = await _redeSocialPersist.GetRedeSocialPalestrateByIdsAsync(palestranteId, redeSocialId);
                if(RedeSocial == null) return null;
                var RedeSocialDTO = _mapper.Map<RedeSocialDTO>(RedeSocial);
                return RedeSocialDTO;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}