namespace ProEventos.Application.DTOs
{
    public class LoteDTO
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public decimal Preco { get; set; }
        public string? DateInicio { get; set; }
        public string? DateFim { get; set; }
        public int Quantidade { get; set; }
        public EventoDTO Evento { get; set; }
    }
}