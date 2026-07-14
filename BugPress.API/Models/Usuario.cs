namespace BugPress.API.Models
{
    public class Usuario
    {
        public int UsuarioID { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Telefone { get; set; }
        public string? Sexo { get; set; }
        public string Login { get; set; } = string.Empty;
        public string SenhaHash { get; set; } = string.Empty;

        // Propriedade de navegação
        public ICollection<Noticia> Noticias { get; set; } = new List<Noticia>();
    }
}
