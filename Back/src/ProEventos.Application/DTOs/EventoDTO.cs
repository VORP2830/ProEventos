using System.ComponentModel.DataAnnotations;

namespace ProEventos.Application.DTOs
{
    public class EventoDTO
    {
        public int Id { get; set; }
        public string Local { get; set; }
        public string DataEvento { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório."),
        //MinLength(4, ErrorMessage = "O campo {0} deve ter no mínimo {1} caracteres"),
        //MaxLength(50, ErrorMessage = "O campo {0} deve ter no máximo {1} caracteres")
        StringLength(50, MinimumLength = 4, ErrorMessage = "Intervalo permitido de 4 a 50 caracteres.")]
        public string Tema { get; set; }
        [Display(Name = "Quantidade de pessoas"),
        Required(ErrorMessage = "O campo {0} é obrigatório."),
        Range(1, 120000, ErrorMessage = "{0} não pode ser menor que {1} e maior que {2}")]
        public int QtdPessoas { get; set; }
        [RegularExpression(@".*\.(gif|jpe?g|bmp|png)$",
        ErrorMessage = "Não é uma imagem valida. (gif | jpg | jpeg | bmp ou png)")]
        public string ImagemUrl { get; set; }
        [Phone(ErrorMessage = "O telefone deve ser válido."),
        Required(ErrorMessage = "O campo {0} é obrigatório.")]
        public string Telefone { get; set; }
        [Display(Name = "e-mail"),
        Required(ErrorMessage = "O campo {0} é obrigatório."),
        EmailAddress(ErrorMessage = "O campo {0} precisa ser válido!")]
        public string Email { get; set; }
        public int userId { get; set; }
        public UserDTO UserDTO { get; set; }
        public IEnumerable<LoteDTO> Lotes {get; set;}
        public IEnumerable<RedeSocialDTO> RedesSociais { get; set; }
        public IEnumerable<PalestranteDTO> Palestrantes { get; set; }
    }
}