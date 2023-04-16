namespace ProEventos.Application.DTOs
{
    public class UserUpdateDTO
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string UserName { get; set; }
        public string PrimeiroNome { get; set; }
        public string UltimoNome { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Funcao { get; set; }
        public string Password { get; set; }
        public string token { get; set; }
    }
}