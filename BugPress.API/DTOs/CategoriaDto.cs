using System.ComponentModel.DataAnnotations;

namespace BugPress.API.DTOs
{
    public class CategoriaDto
    {
        public int CategoriaID { get; set; }

        [Required(ErrorMessage = "A Descrição da categoria é obrigatória.")]
        [StringLength(150, ErrorMessage = "A Descrição não pode exceder 150 caracteres.")]
        public string Descricao { get; set; } = string.Empty;
    }
}
