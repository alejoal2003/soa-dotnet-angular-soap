# 📦 Sistema de Inventario - Laboratorio 2

Sistema completo de gestión de inventario utilizando arquitectura SOA (Service-Oriented Architecture) con un backend SOAP en .NET y un frontend en Angular.

## 🏗️ Arquitectura

```
laboratorio2/
├── BackendService/     # API SOAP con CoreWCF + PostgreSQL
└── FrontendApp/        # Cliente Angular que consume el servicio SOAP
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **.NET 8** - Framework principal
- **CoreWCF** - Implementación de WCF para .NET Core/8 (SOAP)
- **Entity Framework Core** - ORM para acceso a datos
- **PostgreSQL** - Base de datos relacional
- **Npgsql** - Proveedor de PostgreSQL para EF Core

### Frontend
- **Angular 19** - Framework de desarrollo web
- **TypeScript** - Lenguaje de programación
- **HttpClient** - Para peticiones HTTP/SOAP
- **DOMParser** - Parsing de respuestas XML

## 📋 Prerequisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)
- [PostgreSQL 14+](https://www.postgresql.org/download/)

## 🗄️ Configuración de Base de Datos

1. Crear la base de datos en PostgreSQL:

```sql
CREATE DATABASE soa_inventory;
```

2. Crear las tablas:

```sql
CREATE TABLE tipo_producto (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(100) NOT NULL
);

CREATE TABLE producto (
    id SERIAL PRIMARY KEY,
    id_tipo INTEGER REFERENCES tipo_producto(id),
    descripcion VARCHAR(255) NOT NULL,
    valor DOUBLE PRECISION NOT NULL,
    costo DOUBLE PRECISION NOT NULL
);
```

3. (Opcional) Insertar datos de prueba:

```sql
INSERT INTO tipo_producto (tipo) VALUES 
    ('Electrónica'),
    ('Ropa'),
    ('Alimentos');

INSERT INTO producto (id_tipo, descripcion, valor, costo) VALUES 
    (1, 'Laptop HP 15 pulgadas', 899.99, 650.00),
    (1, 'Mouse inalámbrico Logitech', 45.99, 25.00),
    (2, 'Camiseta deportiva Nike', 35.00, 15.00),
    (2, 'Pantalón jeans Levis', 79.99, 40.00),
    (3, 'Café molido 500g', 12.50, 7.00);
```

4. Configurar la cadena de conexión en `BackendService/Program.cs`:

```csharp
options.UseNpgsql("Host=localhost;Port=5432;Database=soa_inventory;Username=postgres;Password=TU_PASSWORD")
```

## 🚀 Ejecución

### Backend (Puerto 5000)

```bash
cd BackendService
dotnet run
```

El servicio SOAP estará disponible en:
- **Endpoint**: `http://localhost:5000/InventoryService.svc`
- **WSDL**: `http://localhost:5000/InventoryService.svc?wsdl`

### Frontend (Puerto 4200)

```bash
cd FrontendApp
npm install
ng serve
```

La aplicación estará disponible en: `http://localhost:4200`

## 📡 Operaciones SOAP Disponibles

### Productos
| Operación | Descripción |
|-----------|-------------|
| `GetAllProductos` | Obtener todos los productos |
| `GetProductoById` | Obtener producto por ID |
| `CreateProducto` | Crear nuevo producto |
| `UpdateProducto` | Actualizar producto existente |
| `DeleteProducto` | Eliminar producto |

### Tipos de Producto
| Operación | Descripción |
|-----------|-------------|
| `GetAllTipos` | Obtener todos los tipos |
| `GetTipoById` | Obtener tipo por ID |
| `CreateTipo` | Crear nuevo tipo |
| `UpdateTipo` | Actualizar tipo existente |
| `DeleteTipo` | Eliminar tipo |

## 📝 Ejemplo de Petición SOAP

```xml
<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:tem="http://tempuri.org/">
    <soapenv:Header/>
    <soapenv:Body>
        <tem:GetAllProductos/>
    </soapenv:Body>
</soapenv:Envelope>
```

## 📁 Estructura del Proyecto

### BackendService
```
BackendService/
├── Models/
│   ├── Producto.cs
│   └── TipoProducto.cs
├── Data/
│   └── AppDbContext.cs
├── Contracts/
│   └── IInventoryService.cs
├── Services/
│   └── InventoryService.cs
└── Program.cs
```

### FrontendApp
```
FrontendApp/src/app/
├── models/
│   └── producto.model.ts
├── utils/
│   └── xml-parser.util.ts
├── services/
│   └── soap.service.ts
└── components/
    └── productos/
        ├── productos.component.ts
        ├── productos.component.html
        └── productos.component.css
```

## 👨‍💻 Autor

Desarrollado para la materia de **Aplicaciones Web Avanzadas** - Escuela Politécnica Nacional

## 📄 Licencia

Este proyecto es de uso académico.
