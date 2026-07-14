using System.ComponentModel.DataAnnotations;

namespace BugPress.API.DTOs
{
    public class LoginDto
    {
        [Required(ErrorMessage = "O campo Login é obrigatório.")]
        [StringLength(100, ErrorMessage = "O Login não pode exceder 100 caracteres.")]
        public string Login { get; set; } = string.Empty;

        [Required(ErrorMessage = "O campo Senha é obrigatório.")]
        [StringLength(100, ErrorMessage = "A Senha não pode exceder 100 caracteres.")]
        public string Senha { get; set; } = string.Empty;
    }
}
