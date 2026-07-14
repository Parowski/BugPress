using Microsoft.EntityFrameworkCore;
using BugPress.API.Models;

namespace BugPress.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; } = null!;
        public DbSet<Categoria> Categorias { get; set; } = null!;
        public DbSet<Noticia> Noticias { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuração da entidade Usuario
            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.ToTable("Usuarios");

                entity.HasKey(e => e.UsuarioID);

                entity.Property(e => e.Nome)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(e => e.Telefone)
                    .HasMaxLength(20);

                entity.Property(e => e.Sexo)
                    .HasMaxLength(20);

                entity.Property(e => e.Login)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.SenhaHash)
                    .IsRequired()
                    .HasMaxLength(250);

                // Índices de Unicidade
                entity.HasIndex(e => e.Email)
                    .IsUnique();

                entity.HasIndex(e => e.Login)
                    .IsUnique();
            });

            // Configuração da entidade Categoria
            modelBuilder.Entity<Categoria>(entity =>
            {
                entity.ToTable("Categorias");

                entity.HasKey(e => e.CategoriaID);

                entity.Property(e => e.Descricao)
                    .IsRequired()
                    .HasMaxLength(150);
            });

            // Configuração da entidade Noticia
            modelBuilder.Entity<Noticia>(entity =>
            {
                entity.ToTable("Noticias");

                entity.HasKey(e => e.NoticiaID);

                entity.Property(e => e.Titulo)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.Texto)
                    .IsRequired();

                entity.Property(e => e.Data)
                    .IsRequired();

                entity.Property(e => e.Slug)
                    .IsRequired()
                    .HasMaxLength(250);

                // Índice de Unicidade e busca no Slug
                entity.HasIndex(e => e.Slug)
                    .IsUnique();

                // Relacionamento Categoria -> Noticias (1:N) - Impedir deleção se houver notícias
                entity.HasOne(d => d.Categoria)
                    .WithMany(p => p.Noticias)
                    .HasForeignKey(d => d.CategoriaID)
                    .OnDelete(DeleteBehavior.Restrict);

                // Relacionamento Usuario -> Noticias (1:N) - Restrict por segurança
                entity.HasOne(d => d.Usuario)
                    .WithMany(p => p.Noticias)
                    .HasForeignKey(d => d.UsuarioID)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
