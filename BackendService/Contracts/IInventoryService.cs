using CoreWCF;
using BackendService.Models;

namespace BackendService.Contracts;

[ServiceContract]
public interface IInventoryService
{
    // ==================== PRODUCTOS ====================
    
    [OperationContract]
    List<Producto> GetAllProductos();

    [OperationContract]
    Producto? GetProductoById(int id);

    [OperationContract]
    Producto CreateProducto(Producto producto);

    [OperationContract]
    Producto? UpdateProducto(int id, Producto producto);

    [OperationContract]
    bool DeleteProducto(int id);

    // ==================== TIPOS DE PRODUCTO ====================
    
    [OperationContract]
    List<TipoProducto> GetAllTipos();

    [OperationContract]
    TipoProducto? GetTipoById(int id);

    [OperationContract]
    TipoProducto CreateTipo(TipoProducto tipo);

    [OperationContract]
    TipoProducto? UpdateTipo(int id, TipoProducto tipo);

    [OperationContract]
    bool DeleteTipo(int id);
}
