using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BugPress.API.Data;
using BugPress.API.DTOs;
using BugPress.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace BugPress.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/usuarios")]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsuariosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsuarioRespostaDto>>> GetUsuarios()
        {
            var usuarios = await _context.Usuarios
                .Select(u => new UsuarioRespostaDto
                {
                    UsuarioID = u.UsuarioID,
                    Nome = u.Nome,
                    Email = u.Email,
                    Telefone = u.Telefone,
                    Sexo = u.Sexo,
                    Login = u.Login
                })
                .ToListAsync();

            return Ok(usuarios);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UsuarioRespostaDto>> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
            {
                return NotFound(new { message = "Usuário não encontrado." });
            }

            return Ok(new UsuarioRespostaDto
            {
                UsuarioID = usuario.UsuarioID,
                Nome = usuario.Nome,
                Email = usuario.Email,
                Telefone = usuario.Telefone,
                Sexo = usuario.Sexo,
                Login = usuario.Login
            });
        }

        [HttpPost]
        public async Task<ActionResult<UsuarioRespostaDto>> CreateUsuario([FromBody] UsuarioDto usuarioDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (string.IsNullOrWhiteSpace(usuarioDto.Senha))
            {
                return BadRequest(new { message = "A senha é obrigatória para o cadastro de novos usuários." });
            }

            // Validar se Login já existe
            if (await _context.Usuarios.AnyAsync(u => u.Login == usuarioDto.Login))
            {
                return BadRequest(new { message = "Este Login já está em uso." });
            }

            // Validar se E-mail já existe
            if (await _context.Usuarios.AnyAsync(u => u.Email == usuarioDto.Email))
            {
                return BadRequest(new { message = "Este E-mail já está em uso." });
            }

            var usuario = new Usuario
            {
                Nome = usuarioDto.Nome,
                Email = usuarioDto.Email,
                Telefone = usuarioDto.Telefone,
                Sexo = usuarioDto.Sexo,
                Login = usuarioDto.Login,
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(usuarioDto.Senha)
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            var resposta = new UsuarioRespostaDto
            {
                UsuarioID = usuario.UsuarioID,
                Nome = usuario.Nome,
                Email = usuario.Email,
                Telefone = usuario.Telefone,
                Sexo = usuario.Sexo,
                Login = usuario.Login
            };

            return CreatedAtAction(nameof(GetUsuario), new { id = usuario.UsuarioID }, resposta);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUsuario(int id, [FromBody] UsuarioDto usuarioDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound(new { message = "Usuário não encontrado." });
            }

            // Validar se novo Login colide com outro usuário
            if (usuario.Login != usuarioDto.Login && await _context.Usuarios.AnyAsync(u => u.Login == usuarioDto.Login))
            {
                return BadRequest(new { message = "Este Login já está em uso por outro usuário." });
            }

            // Validar se novo E-mail colide com outro usuário
            if (usuario.Email != usuarioDto.Email && await _context.Usuarios.AnyAsync(u => u.Email == usuarioDto.Email))
            {
                return BadRequest(new { message = "Este E-mail já está em uso por outro usuário." });
            }

            usuario.Nome = usuarioDto.Nome;
            usuario.Email = usuarioDto.Email;
            usuario.Telefone = usuarioDto.Telefone;
            usuario.Sexo = usuarioDto.Sexo;
            usuario.Login = usuarioDto.Login;

            // Se uma nova senha for fornecida, atualiza o hash
            if (!string.IsNullOrWhiteSpace(usuarioDto.Senha))
            {
                usuario.SenhaHash = BCrypt.Net.BCrypt.HashPassword(usuarioDto.Senha);
            }

            _context.Entry(usuario).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await UsuarioExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return Ok(new UsuarioRespostaDto
            {
                UsuarioID = usuario.UsuarioID,
                Nome = usuario.Nome,
                Email = usuario.Email,
                Telefone = usuario.Telefone,
                Sexo = usuario.Sexo,
                Login = usuario.Login
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound(new { message = "Usuário não encontrado." });
            }

            // Validar restrição de deleção por FK
            var possuiNoticias = await _context.Noticias.AnyAsync(n => n.UsuarioID == id);
            if (possuiNoticias)
            {
                return BadRequest(new { message = "Não é possível remover este usuário porque existem notícias associadas a ele." });
            }

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Usuário removido com sucesso." });
        }

        private async Task<bool> UsuarioExists(int id)
        {
            return await _context.Usuarios.AnyAsync(e => e.UsuarioID == id);
        }
    }
}
