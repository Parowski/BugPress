using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BugPress.API.Data;
using BugPress.API.DTOs;
using BugPress.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace BugPress.API.Controllers
{
    [ApiController]
    [Route("api/categorias")]
    public class CategoriasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/categorias (Público)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoriaDto>>> GetCategorias()
        {
            var categorias = await _context.Categorias
                .Select(c => new CategoriaDto
                {
                    CategoriaID = c.CategoriaID,
                    Descricao = c.Descricao
                })
                .ToListAsync();

            return Ok(categorias);
        }

        // GET: api/categorias/5 (Público)
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoriaDto>> GetCategoria(int id)
        {
            var categoria = await _context.Categorias.FindAsync(id);

            if (categoria == null)
            {
                return NotFound(new { message = "Categoria não encontrada." });
            }

            return Ok(new CategoriaDto
            {
                CategoriaID = categoria.CategoriaID,
                Descricao = categoria.Descricao
            });
        }

        // POST: api/categorias (Protegido)
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<CategoriaDto>> CreateCategoria([FromBody] CategoriaDto categoriaDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Validar se descrição da categoria já existe
            if (await _context.Categorias.AnyAsync(c => c.Descricao.ToLower() == categoriaDto.Descricao.ToLower()))
            {
                return BadRequest(new { message = "Já existe uma categoria com esta descrição." });
            }

            var categoria = new Categoria
            {
                Descricao = categoriaDto.Descricao
            };

            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync();

            categoriaDto.CategoriaID = categoria.CategoriaID;

            return CreatedAtAction(nameof(GetCategoria), new { id = categoria.CategoriaID }, categoriaDto);
        }

        // PUT: api/categorias/5 (Protegido)
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategoria(int id, [FromBody] CategoriaDto categoriaDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var categoria = await _context.Categorias.FindAsync(id);
            if (categoria == null)
            {
                return NotFound(new { message = "Categoria não encontrada." });
            }

            // Validar unicidade com outras categorias
            if (categoria.Descricao.ToLower() != categoriaDto.Descricao.ToLower() &&
                await _context.Categorias.AnyAsync(c => c.Descricao.ToLower() == categoriaDto.Descricao.ToLower()))
            {
                return BadRequest(new { message = "Já existe outra categoria com esta descrição." });
            }

            categoria.Descricao = categoriaDto.Descricao;

            _context.Entry(categoria).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await CategoriaExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return Ok(new CategoriaDto
            {
                CategoriaID = categoria.CategoriaID,
                Descricao = categoria.Descricao
            });
        }

        // DELETE: api/categorias/5 (Protegido)
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategoria(int id)
        {
            var categoria = await _context.Categorias.FindAsync(id);
            if (categoria == null)
            {
                return NotFound(new { message = "Categoria não encontrada." });
            }

            // Validar se existem notícias associadas
            var possuiNoticias = await _context.Noticias.AnyAsync(n => n.CategoriaID == id);
            if (possuiNoticias)
            {
                return BadRequest(new { message = "Não é possível remover esta categoria pois existem notícias vinculadas a ela." });
            }

            _context.Categorias.Remove(categoria);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Categoria removida com sucesso." });
        }

        private async Task<bool> CategoriaExists(int id)
        {
            return await _context.Categorias.AnyAsync(e => e.CategoriaID == id);
        }
    }
}
