using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BugPress.API.Data;
using BugPress.API.DTOs;
using BugPress.API.Models;
using BugPress.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace BugPress.API.Controllers
{
    [ApiController]
    [Route("api/noticias")]
    public class NoticiasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NoticiasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/noticias (Público)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NoticiaRespostaDto>>> GetNoticias()
        {
            var noticias = await _context.Noticias
                .Include(n => n.Categoria)
                .Include(n => n.Usuario)
                .OrderByDescending(n => n.Data)
                .Select(n => new NoticiaRespostaDto
                {
                    NoticiaID = n.NoticiaID,
                    Titulo = n.Titulo,
                    Texto = n.Texto,
                    Data = n.Data,
                    Slug = n.Slug,
                    CategoriaID = n.CategoriaID,
                    CategoriaDescricao = n.Categoria.Descricao,
                    UsuarioID = n.UsuarioID,
                    UsuarioNome = n.Usuario.Nome
                })
                .ToListAsync();

            return Ok(noticias);
        }

        // GET: api/noticias/{slug} (Público)
        [HttpGet("{slug}")]
        public async Task<ActionResult<NoticiaRespostaDto>> GetNoticiaBySlug(string slug)
        {
            var noticia = await _context.Noticias
                .Include(n => n.Categoria)
                .Include(n => n.Usuario)
                .FirstOrDefaultAsync(n => n.Slug == slug);

            if (noticia == null)
            {
                return NotFound(new { message = "Notícia não encontrada." });
            }

            return Ok(new NoticiaRespostaDto
            {
                NoticiaID = noticia.NoticiaID,
                Titulo = noticia.Titulo,
                Texto = noticia.Texto,
                Data = noticia.Data,
                Slug = noticia.Slug,
                CategoriaID = noticia.CategoriaID,
                CategoriaDescricao = noticia.Categoria.Descricao,
                UsuarioID = noticia.UsuarioID,
                UsuarioNome = noticia.Usuario.Nome
            });
        }

        // POST: api/noticias (Protegido)
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<NoticiaRespostaDto>> CreateNoticia([FromBody] NoticiaDto noticiaDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Obter ID do usuário autenticado através do Token JWT
            var usuarioIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(usuarioIdClaim) || !int.TryParse(usuarioIdClaim, out int usuarioId))
            {
                return Unauthorized(new { message = "Identificação do usuário inválida no token." });
            }

            // Validar se Categoria existe
            var categoria = await _context.Categorias.FindAsync(noticiaDto.CategoriaID);
            if (categoria == null)
            {
                return BadRequest(new { message = "A categoria informada não existe." });
            }

            // Validar se Usuário existe no banco
            var usuario = await _context.Usuarios.FindAsync(usuarioId);
            if (usuario == null)
            {
                return BadRequest(new { message = "Usuário do token não foi encontrado." });
            }

            // Gerar Slug único a partir do título
            var slugUnico = await GenerateUniqueSlugAsync(noticiaDto.Titulo);

            var noticia = new Noticia
            {
                Titulo = noticiaDto.Titulo,
                Texto = noticiaDto.Texto,
                Data = DateTime.UtcNow,
                Slug = slugUnico,
                CategoriaID = noticiaDto.CategoriaID,
                UsuarioID = usuarioId
            };

            _context.Noticias.Add(noticia);
            await _context.SaveChangesAsync();

            var resposta = new NoticiaRespostaDto
            {
                NoticiaID = noticia.NoticiaID,
                Titulo = noticia.Titulo,
                Texto = noticia.Texto,
                Data = noticia.Data,
                Slug = noticia.Slug,
                CategoriaID = noticia.CategoriaID,
                CategoriaDescricao = categoria.Descricao,
                UsuarioID = noticia.UsuarioID,
                UsuarioNome = usuario.Nome
            };

            return CreatedAtAction(nameof(GetNoticiaBySlug), new { slug = noticia.Slug }, resposta);
        }

        // PUT: api/noticias/5 (Protegido)
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNoticia(int id, [FromBody] NoticiaDto noticiaDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var noticia = await _context.Noticias
                .Include(n => n.Categoria)
                .Include(n => n.Usuario)
                .FirstOrDefaultAsync(n => n.NoticiaID == id);

            if (noticia == null)
            {
                return NotFound(new { message = "Notícia não encontrada." });
            }

            // Validar se Categoria existe
            var categoria = await _context.Categorias.FindAsync(noticiaDto.CategoriaID);
            if (categoria == null)
            {
                return BadRequest(new { message = "A categoria informada não existe." });
            }

            // Se o título mudou, gerar um novo slug garantindo a unicidade
            if (noticia.Titulo != noticiaDto.Titulo)
            {
                noticia.Slug = await GenerateUniqueSlugAsync(noticiaDto.Titulo, noticia.NoticiaID);
            }

            noticia.Titulo = noticiaDto.Titulo;
            noticia.Texto = noticiaDto.Texto;
            noticia.CategoriaID = noticiaDto.CategoriaID;

            _context.Entry(noticia).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await NoticiaExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return Ok(new NoticiaRespostaDto
            {
                NoticiaID = noticia.NoticiaID,
                Titulo = noticia.Titulo,
                Texto = noticia.Texto,
                Data = noticia.Data,
                Slug = noticia.Slug,
                CategoriaID = noticia.CategoriaID,
                CategoriaDescricao = categoria.Descricao,
                UsuarioID = noticia.UsuarioID,
                UsuarioNome = noticia.Usuario.Nome
            });
        }

        // DELETE: api/noticias/5 (Protegido)
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNoticia(int id)
        {
            var noticia = await _context.Noticias.FindAsync(id);
            if (noticia == null)
            {
                return NotFound(new { message = "Notícia não encontrada." });
            }

            _context.Noticias.Remove(noticia);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Notícia removida com sucesso." });
        }

        private async Task<bool> NoticiaExists(int id)
        {
            return await _context.Noticias.AnyAsync(e => e.NoticiaID == id);
        }

        private async Task<string> GenerateUniqueSlugAsync(string titulo, int? noticiaIdExcluido = null)
        {
            var baseSlug = SlugHelper.GenerateSlug(titulo);
            var slug = baseSlug;
            int contador = 1;

            // Loop para garantir que o slug seja único na tabela de notícias
            while (await _context.Noticias.AnyAsync(n => n.Slug == slug && (!noticiaIdExcluido.HasValue || n.NoticiaID != noticiaIdExcluido.Value)))
            {
                slug = $"{baseSlug}-{contador}";
                contador++;
            }

            return slug;
        }
    }
}
