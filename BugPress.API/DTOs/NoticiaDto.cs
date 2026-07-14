using System;
using System.ComponentModel.DataAnnotations;

namespace BugPress.API.DTOs
{
    public class NoticiaDto
    {
        public int NoticiaID { get; set; }

        [Required(ErrorMessage = "O Título da notícia é obrigatório.")]
        [StringLength(250, ErrorMessage = "O Título não pode exceder 250 caracteres.")]
        public string Titulo { get; set; } = string.Empty;

        [Required(ErrorMessage = "O Texto da notícia é obrigatório.")]
        public string Texto { get; set; } = string.Empty;

        [Required(ErrorMessage = "O CategoriaID é obrigatório.")]
        public int CategoriaID { get; set; }
    }

    public class NoticiaRespostaDto
    {
        public int NoticiaID { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Texto { get; set; } = string.Empty;
        public DateTime Data { get; set; }
        public string Slug { get; set; } = string.Empty;
        public int CategoriaID { get; set; }
        public string CategoriaDescricao { get; set; } = string.Empty;
        public int UsuarioID { get; set; }
        public string UsuarioNome { get; set; } = string.Empty;
    }
}
