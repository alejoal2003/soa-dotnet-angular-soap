using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace BackendService.Models;

[DataContract]
[Table("tipo_producto")]
public class TipoProducto
{
    [DataMember]
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [DataMember]
    [Column("tipo")]
    public string Tipo { get; set; } = string.Empty;
}
