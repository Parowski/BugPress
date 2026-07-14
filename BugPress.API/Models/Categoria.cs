namespace BugPress.API.Models
{
    public class Categoria
    {
        public int CategoriaID { get; set; }
        public string Descricao { get; set; } = string.Empty;

        // Propriedade de navegação
        public ICollection<Noticia> Noticias { get; set; } = new List<Noticia>();
    }
}
