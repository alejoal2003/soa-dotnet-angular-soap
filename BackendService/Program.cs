using Microsoft.EntityFrameworkCore;
using CoreWCF;
using CoreWCF.Configuration;
using BackendService.Data;
using BackendService.Contracts;
using BackendService.Services;

var builder = WebApplication.CreateBuilder(args);

// Configurar Entity Framework con PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql("Host=localhost;Port=5432;Database=soa_inventory;Username=postgres;Password=admin"));

// Registrar servicios CoreWCF
builder.Services.AddServiceModelServices();
builder.Services.AddServiceModelMetadata();

// Registrar el servicio de inventario
builder.Services.AddScoped<InventoryService>();

// Configurar CORS para permitir cualquier origen (Angular)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Habilitar CORS
app.UseCors("AllowAll");

// Configurar endpoint SOAP
app.UseServiceModel(serviceBuilder =>
{
    serviceBuilder.AddService<InventoryService>();
    serviceBuilder.AddServiceEndpoint<InventoryService, IInventoryService>(
        new BasicHttpBinding(),
        "/InventoryService.svc"
    );

    // Habilitar metadata (WSDL)
    var serviceMetadataBehavior = app.Services.GetRequiredService<CoreWCF.Description.ServiceMetadataBehavior>();
    serviceMetadataBehavior.HttpGetEnabled = true;
});

app.Run();
