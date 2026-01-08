import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Producto, TipoProducto } from '../models/producto.model';
import { XmlParserUtil } from '../utils/xml-parser.util';

@Injectable({
  providedIn: 'root'
})
export class SoapService {

  private serviceUrl = 'http://localhost:5000/InventoryService.svc';
  private namespace = 'http://tempuri.org/';
  private dataNamespace = 'http://schemas.datacontract.org/2004/07/BackendService.Models';

  constructor(private http: HttpClient) { }

  // ==================== PRODUCTOS ====================

  /**
   * Obtener todos los productos
   */
  getAllProductos(): Observable<Producto[]> {
    const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="${this.namespace}">
        <soapenv:Header/>
        <soapenv:Body>
          <tem:GetAllProductos/>
        </soapenv:Body>
      </soapenv:Envelope>`;

    return this.sendSoapRequest(soapEnvelope, 'GetAllProductos').pipe(
      map(response => XmlParserUtil.extractProductos(response))
    );
  }

  /**
   * Obtener producto por ID
   */
  getProductoById(id: number): Observable<Producto | null> {
    const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="${this.namespace}">
        <soapenv:Header/>
        <soapenv:Body>
          <tem:GetProductoById>
            <tem:id>${id}</tem:id>
          </tem:GetProductoById>
        </soapenv:Body>
      </soapenv:Envelope>`;

    return this.sendSoapRequest(soapEnvelope, 'GetProductoById').pipe(
      map(response => XmlParserUtil.extractProducto(response))
    );
  }

  /**
   * Crear un nuevo producto
   */
  createProducto(producto: Producto): Observable<Producto | null> {
    const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                        xmlns:tem="${this.namespace}"
                        xmlns:mod="${this.dataNamespace}">
        <soapenv:Header/>
        <soapenv:Body>
          <tem:CreateProducto>
            <tem:producto>
              <mod:Costo>${producto.costo}</mod:Costo>
              <mod:Descripcion>${producto.descripcion}</mod:Descripcion>
              <mod:Id>${producto.id}</mod:Id>
              <mod:IdTipo>${producto.idTipo}</mod:IdTipo>
              <mod:Valor>${producto.valor}</mod:Valor>
            </tem:producto>
          </tem:CreateProducto>
        </soapenv:Body>
      </soapenv:Envelope>`;

    return this.sendSoapRequest(soapEnvelope, 'CreateProducto').pipe(
      map(response => XmlParserUtil.extractProducto(response))
    );
  }

  /**
   * Actualizar un producto
   */
  updateProducto(id: number, producto: Producto): Observable<Producto | null> {
    const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                        xmlns:tem="${this.namespace}"
                        xmlns:mod="${this.dataNamespace}">
        <soapenv:Header/>
        <soapenv:Body>
          <tem:UpdateProducto>
            <tem:id>${id}</tem:id>
            <tem:producto>
              <mod:Costo>${producto.costo}</mod:Costo>
              <mod:Descripcion>${producto.descripcion}</mod:Descripcion>
              <mod:Id>${producto.id}</mod:Id>
              <mod:IdTipo>${producto.idTipo}</mod:IdTipo>
              <mod:Valor>${producto.valor}</mod:Valor>
            </tem:producto>
          </tem:UpdateProducto>
        </soapenv:Body>
      </soapenv:Envelope>`;

    return this.sendSoapRequest(soapEnvelope, 'UpdateProducto').pipe(
      map(response => XmlParserUtil.extractProducto(response))
    );
  }

  /**
   * Eliminar un producto
   */
  deleteProducto(id: number): Observable<boolean> {
    const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="${this.namespace}">
        <soapenv:Header/>
        <soapenv:Body>
          <tem:DeleteProducto>
            <tem:id>${id}</tem:id>
          </tem:DeleteProducto>
        </soapenv:Body>
      </soapenv:Envelope>`;

    return this.sendSoapRequest(soapEnvelope, 'DeleteProducto').pipe(
      map(response => XmlParserUtil.extractBoolean(response, 'DeleteProductoResult'))
    );
  }

  // ==================== TIPOS DE PRODUCTO ====================

  /**
   * Obtener todos los tipos de producto
   */
  getAllTipos(): Observable<TipoProducto[]> {
    const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="${this.namespace}">
        <soapenv:Header/>
        <soapenv:Body>
          <tem:GetAllTipos/>
        </soapenv:Body>
      </soapenv:Envelope>`;

    return this.sendSoapRequest(soapEnvelope, 'GetAllTipos').pipe(
      map(response => XmlParserUtil.extractTipos(response))
    );
  }

  /**
   * Obtener tipo por ID
   */
  getTipoById(id: number): Observable<TipoProducto | null> {
    const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="${this.namespace}">
        <soapenv:Header/>
        <soapenv:Body>
          <tem:GetTipoById>
            <tem:id>${id}</tem:id>
          </tem:GetTipoById>
        </soapenv:Body>
      </soapenv:Envelope>`;

    return this.sendSoapRequest(soapEnvelope, 'GetTipoById').pipe(
      map(response => {
        const tipos = XmlParserUtil.extractTipos(response);
        return tipos.length > 0 ? tipos[0] : null;
      })
    );
  }

  /**
   * Crear un nuevo tipo de producto
   */
  createTipo(tipo: TipoProducto): Observable<TipoProducto | null> {
    const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                        xmlns:tem="${this.namespace}"
                        xmlns:mod="${this.dataNamespace}">
        <soapenv:Header/>
        <soapenv:Body>
          <tem:CreateTipo>
            <tem:tipo>
              <mod:Id>${tipo.id}</mod:Id>
              <mod:Tipo>${tipo.tipo}</mod:Tipo>
            </tem:tipo>
          </tem:CreateTipo>
        </soapenv:Body>
      </soapenv:Envelope>`;

    return this.sendSoapRequest(soapEnvelope, 'CreateTipo').pipe(
      map(response => {
        const tipos = XmlParserUtil.extractTipos(response);
        return tipos.length > 0 ? tipos[0] : null;
      })
    );
  }

  /**
   * Actualizar un tipo de producto
   */
  updateTipo(id: number, tipo: TipoProducto): Observable<TipoProducto | null> {
    const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                        xmlns:tem="${this.namespace}"
                        xmlns:mod="${this.dataNamespace}">
        <soapenv:Header/>
        <soapenv:Body>
          <tem:UpdateTipo>
            <tem:id>${id}</tem:id>
            <tem:tipo>
              <mod:Id>${tipo.id}</mod:Id>
              <mod:Tipo>${tipo.tipo}</mod:Tipo>
            </tem:tipo>
          </tem:UpdateTipo>
        </soapenv:Body>
      </soapenv:Envelope>`;

    return this.sendSoapRequest(soapEnvelope, 'UpdateTipo').pipe(
      map(response => {
        const tipos = XmlParserUtil.extractTipos(response);
        return tipos.length > 0 ? tipos[0] : null;
      })
    );
  }

  /**
   * Eliminar un tipo de producto
   */
  deleteTipo(id: number): Observable<boolean> {
    const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="${this.namespace}">
        <soapenv:Header/>
        <soapenv:Body>
          <tem:DeleteTipo>
            <tem:id>${id}</tem:id>
          </tem:DeleteTipo>
        </soapenv:Body>
      </soapenv:Envelope>`;

    return this.sendSoapRequest(soapEnvelope, 'DeleteTipo').pipe(
      map(response => XmlParserUtil.extractBoolean(response, 'DeleteTipoResult'))
    );
  }

  // ==================== MÉTODO PRIVADO ====================

  /**
   * Envía la petición SOAP al servidor
   */
  private sendSoapRequest(soapEnvelope: string, soapAction: string): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': `${this.namespace}IInventoryService/${soapAction}`
    });

    return this.http.post(this.serviceUrl, soapEnvelope, {
      headers: headers,
      responseType: 'text'
    });
  }
}
