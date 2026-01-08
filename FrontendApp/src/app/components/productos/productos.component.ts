import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SoapService } from '../../services/soap.service';
import { Producto, TipoProducto } from '../../models/producto.model';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {

  productos: Producto[] = [];
  tipos: TipoProducto[] = [];
  
  // Formulario
  nuevoProducto: Producto = {
    id: 0,
    idTipo: 0,
    descripcion: '',
    valor: 0,
    costo: 0
  };

  editandoId: number | null = null;
  cargando = false;
  mensaje = '';
  tipoMensaje: 'success' | 'error' | '' = '';

  constructor(private soapService: SoapService) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    
    // Cargar tipos primero
    this.soapService.getAllTipos().subscribe({
      next: (tipos) => {
        this.tipos = tipos;
        // Luego cargar productos
        this.cargarProductos();
      },
      error: (error) => {
        this.mostrarMensaje('Error al cargar tipos: ' + error.message, 'error');
        this.cargando = false;
      }
    });
  }

  cargarProductos(): void {
    this.soapService.getAllProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarMensaje('Error al cargar productos: ' + error.message, 'error');
        this.cargando = false;
      }
    });
  }

  guardarProducto(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.cargando = true;

    if (this.editandoId) {
      // Actualizar
      this.soapService.updateProducto(this.editandoId, this.nuevoProducto).subscribe({
        next: (producto) => {
          if (producto) {
            this.mostrarMensaje('Producto actualizado correctamente', 'success');
            this.cargarProductos();
            this.limpiarFormulario();
          } else {
            this.mostrarMensaje('Error al actualizar el producto', 'error');
          }
          this.cargando = false;
        },
        error: (error) => {
          this.mostrarMensaje('Error: ' + error.message, 'error');
          this.cargando = false;
        }
      });
    } else {
      // Crear
      this.soapService.createProducto(this.nuevoProducto).subscribe({
        next: (producto) => {
          if (producto) {
            this.mostrarMensaje('Producto creado correctamente', 'success');
            this.cargarProductos();
            this.limpiarFormulario();
          } else {
            this.mostrarMensaje('Error al crear el producto', 'error');
          }
          this.cargando = false;
        },
        error: (error) => {
          this.mostrarMensaje('Error: ' + error.message, 'error');
          this.cargando = false;
        }
      });
    }
  }

  editarProducto(producto: Producto): void {
    this.editandoId = producto.id;
    this.nuevoProducto = { ...producto };
  }

  eliminarProducto(id: number): void {
    if (!confirm('¿Está seguro de eliminar este producto?')) {
      return;
    }

    this.cargando = true;
    this.soapService.deleteProducto(id).subscribe({
      next: (resultado) => {
        if (resultado) {
          this.mostrarMensaje('Producto eliminado correctamente', 'success');
          this.cargarProductos();
        } else {
          this.mostrarMensaje('Error al eliminar el producto', 'error');
        }
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarMensaje('Error: ' + error.message, 'error');
        this.cargando = false;
      }
    });
  }

  limpiarFormulario(): void {
    this.nuevoProducto = {
      id: 0,
      idTipo: 0,
      descripcion: '',
      valor: 0,
      costo: 0
    };
    this.editandoId = null;
  }

  cancelarEdicion(): void {
    this.limpiarFormulario();
  }

  obtenerNombreTipo(idTipo: number): string {
    const tipo = this.tipos.find(t => t.id === idTipo);
    return tipo ? tipo.tipo : 'Desconocido';
  }

  private validarFormulario(): boolean {
    if (!this.nuevoProducto.descripcion.trim()) {
      this.mostrarMensaje('La descripción es requerida', 'error');
      return false;
    }
    if (this.nuevoProducto.idTipo <= 0) {
      this.mostrarMensaje('Debe seleccionar un tipo de producto', 'error');
      return false;
    }
    if (this.nuevoProducto.valor <= 0) {
      this.mostrarMensaje('El valor debe ser mayor a 0', 'error');
      return false;
    }
    if (this.nuevoProducto.costo <= 0) {
      this.mostrarMensaje('El costo debe ser mayor a 0', 'error');
      return false;
    }
    return true;
  }

  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error'): void {
    this.mensaje = mensaje;
    this.tipoMensaje = tipo;
    setTimeout(() => {
      this.mensaje = '';
      this.tipoMensaje = '';
    }, 4000);
  }
}
