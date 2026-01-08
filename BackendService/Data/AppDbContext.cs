using Microsoft.EntityFrameworkCore;
using BackendService.Models;

namespace BackendService.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<TipoProducto> TiposProducto { get; set; }
    public DbSet<Producto> Productos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configurar relación
        modelBuilder.Entity<Producto>()
            .HasOne(p => p.TipoProducto)
            .WithMany()
            .HasForeignKey(p => p.IdTipo);
    }
}
