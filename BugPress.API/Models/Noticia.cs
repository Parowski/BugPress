using System;

namespace BugPress.API.Models
{
    public class Noticia
    {
        public int NoticiaID { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Texto { get; set; } = string.Empty;
        public DateTime Data { get; set; }
        public string Slug { get; set; } = string.Empty;

        public int CategoriaID { get; set; }
        public Categoria Categoria { get; set; } = null!;

        public int UsuarioID { get; set; }
        public Usuario Usuario { get; set; } = null!;
    }
}
