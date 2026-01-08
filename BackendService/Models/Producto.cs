using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace BackendService.Models;

[DataContract]
[Table("producto")]
public class Producto
{
    [DataMember]
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [DataMember]
    [Column("id_tipo")]
    public int IdTipo { get; set; }

    [DataMember]
    [Column("descripcion")]
    public string Descripcion { get; set; } = string.Empty;

    [DataMember]
    [Column("valor")]
    public double Valor { get; set; }

    [DataMember]
    [Column("costo")]
    public double Costo { get; set; }

    [ForeignKey("IdTipo")]
    public TipoProducto? TipoProducto { get; set; }
}
