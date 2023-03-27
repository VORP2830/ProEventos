using ProEventos.Domain.Models;

namespace ProEventos.Domain
{
    public class Lote
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public decimal Preco { get; set; }
        public DateTime? DateInicio { get; set; }
        public DateTime? DateFim { get; set; }
        public int Quantidade { get; set; }
        public int EventoId { get; set; }
        public Evento Evento { get; set; }

    }
}