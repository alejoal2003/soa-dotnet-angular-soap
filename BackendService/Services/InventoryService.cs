using BackendService.Contracts;
using BackendService.Data;
using BackendService.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendService.Services;

public class InventoryService : IInventoryService
{
    private readonly AppDbContext _context;

    public InventoryService(AppDbContext context)
    {
        _context = context;
    }

    // ==================== PRODUCTOS ====================

    public List<Producto> GetAllProductos()
    {
        return _context.Productos
            .Include(p => p.TipoProducto)
            .ToList();
    }

    public Producto? GetProductoById(int id)
    {
        return _context.Productos
            .Include(p => p.TipoProducto)
            .FirstOrDefault(p => p.Id == id);
    }

    public Producto CreateProducto(Producto producto)
    {
        _context.Productos.Add(producto);
        _context.SaveChanges();
        return producto;
    }

    public Producto? UpdateProducto(int id, Producto producto)
    {
        var existingProducto = _context.Productos.Find(id);

        if (existingProducto == null)
            return null;

        existingProducto.IdTipo = producto.IdTipo;
        existingProducto.Descripcion = producto.Descripcion;
        existingProducto.Valor = producto.Valor;
        existingProducto.Costo = producto.Costo;

        _context.SaveChanges();
        return existingProducto;
    }

    public bool DeleteProducto(int id)
    {
        var producto = _context.Productos.Find(id);

        if (producto == null)
            return false;

        _context.Productos.Remove(producto);
        _context.SaveChanges();
        return true;
    }

    // ==================== TIPOS DE PRODUCTO ====================

    public List<TipoProducto> GetAllTipos()
    {
        return _context.TiposProducto.ToList();
    }

    public TipoProducto? GetTipoById(int id)
    {
        return _context.TiposProducto.Find(id);
    }

    public TipoProducto CreateTipo(TipoProducto tipo)
    {
        _context.TiposProducto.Add(tipo);
        _context.SaveChanges();
        return tipo;
    }

    public TipoProducto? UpdateTipo(int id, TipoProducto tipo)
    {
        var existingTipo = _context.TiposProducto.Find(id);

        if (existingTipo == null)
            return null;

        existingTipo.Tipo = tipo.Tipo;

        _context.SaveChanges();
        return existingTipo;
    }

    public bool DeleteTipo(int id)
    {
        var tipo = _context.TiposProducto.Find(id);

        if (tipo == null)
            return false;

        _context.TiposProducto.Remove(tipo);
        _context.SaveChanges();
        return true;
    }
}
