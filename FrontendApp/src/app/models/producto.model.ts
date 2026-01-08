export interface Producto {
  id: number;
  idTipo: number;
  descripcion: string;
  valor: number;
  costo: number;
}

export interface TipoProducto {
  id: number;
  tipo: string;
}
