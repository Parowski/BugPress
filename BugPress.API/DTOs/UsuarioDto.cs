using System.ComponentModel.DataAnnotations;

namespace BugPress.API.DTOs
{
    public class UsuarioDto
    {
        public int UsuarioID { get; set; }

        [Required(ErrorMessage = "O campo Nome é obrigatório.")]
        [StringLength(150, ErrorMessage = "O Nome não pode exceder 150 caracteres.")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "O campo Email é obrigatório.")]
        [EmailAddress(ErrorMessage = "O Email fornecido é inválido.")]
        [StringLength(150, ErrorMessage = "O Email não pode exceder 150 caracteres.")]
        public string Email { get; set; } = string.Empty;

        [StringLength(20, ErrorMessage = "O Telefone não pode exceder 20 caracteres.")]
        public string? Telefone { get; set; }

        [StringLength(20, ErrorMessage = "O campo Sexo não pode exceder 20 caracteres.")]
        public string? Sexo { get; set; }

        [Required(ErrorMessage = "O campo Login é obrigatório.")]
        [StringLength(100, ErrorMessage = "O Login não pode exceder 100 caracteres.")]
        public string Login { get; set; } = string.Empty;

        // Opcional para edição, mas obrigatório para cadastro
        public string? Senha { get; set; }
    }

    public class UsuarioRespostaDto
    {
        public int UsuarioID { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Telefone { get; set; }
        public string? Sexo { get; set; }
        public string Login { get; set; } = string.Empty;
    }
}
