using AutoMapper;
using ProEventos.Application.DTOs;
using ProEventos.Domain;
using ProEventos.Domain.Identity;
using ProEventos.Domain.Models;
using ProEventos.Persistence.models;

namespace ProEventos.API.Helpers
{
    public class ProEventosProfile : Profile
    {
        public ProEventosProfile()
        {
            CreateMap<Evento, EventoDTO>().ReverseMap();

            CreateMap<Lote, LoteDTO>().ReverseMap();

            CreateMap<RedeSocial, RedeSocialDTO>().ReverseMap();

            CreateMap<Palestrante, PalestranteDTO>().ReverseMap();
            CreateMap<Palestrante, PalestranteAddDTO>().ReverseMap();
            CreateMap<Palestrante, PalestranteUpdateDTO>().ReverseMap();

            CreateMap<User, UserDTO>().ReverseMap();
            CreateMap<User, UserLoginDTO>().ReverseMap();
            CreateMap<User, UserUpdateDTO>().ReverseMap();
        }
    }
}