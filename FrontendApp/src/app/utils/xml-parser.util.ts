/**
 * Utilidad para parsear respuestas XML SOAP a objetos JSON
 */
export class XmlParserUtil {

  /**
   * Convierte un string XML en un objeto JSON
   */
  static parseXmlToJson(xmlString: string): any {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    return this.xmlToJson(xmlDoc);
  }

  /**
   * Convierte un nodo XML a objeto JSON recursivamente
   */
  private static xmlToJson(xml: Node): any {
    let obj: any = {};

    if (xml.nodeType === Node.ELEMENT_NODE) {
      const element = xml as Element;

      // Procesar atributos
      if (element.attributes.length > 0) {
        obj['@attributes'] = {};
        for (let i = 0; i < element.attributes.length; i++) {
          const attr = element.attributes.item(i);
          if (attr) {
            obj['@attributes'][attr.nodeName] = attr.nodeValue;
          }
        }
      }
    } else if (xml.nodeType === Node.TEXT_NODE) {
      obj = xml.nodeValue?.trim() || '';
    }

    // Procesar hijos
    if (xml.hasChildNodes()) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const item = xml.childNodes.item(i);
        const nodeName = item.nodeName;

        // Ignorar nodos de texto vacíos
        if (item.nodeType === Node.TEXT_NODE && !item.nodeValue?.trim()) {
          continue;
        }

        if (typeof obj[nodeName] === 'undefined') {
          obj[nodeName] = this.xmlToJson(item);
        } else {
          if (!Array.isArray(obj[nodeName])) {
            obj[nodeName] = [obj[nodeName]];
          }
          obj[nodeName].push(this.xmlToJson(item));
        }
      }
    }

    return obj;
  }

  /**
   * Extrae un array de productos desde la respuesta SOAP
   */
  static extractProductos(xmlString: string): any[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    // Buscar elementos Producto en la respuesta
    const productos = xmlDoc.getElementsByTagName('a:Producto');
    const result: any[] = [];

    for (let i = 0; i < productos.length; i++) {
      const producto = productos[i];
      result.push({
        id: parseInt(this.getElementText(producto, 'a:Id') || '0'),
        idTipo: parseInt(this.getElementText(producto, 'a:IdTipo') || '0'),
        descripcion: this.getElementText(producto, 'a:Descripcion') || '',
        valor: parseFloat(this.getElementText(producto, 'a:Valor') || '0'),
        costo: parseFloat(this.getElementText(producto, 'a:Costo') || '0')
      });
    }

    return result;
  }

  /**
   * Extrae un solo producto desde la respuesta SOAP
   */
  static extractProducto(xmlString: string): any | null {
    const productos = this.extractProductos(xmlString);
    return productos.length > 0 ? productos[0] : null;
  }

  /**
   * Extrae un array de tipos de producto desde la respuesta SOAP
   */
  static extractTipos(xmlString: string): any[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    const tipos = xmlDoc.getElementsByTagName('a:TipoProducto');
    const result: any[] = [];

    for (let i = 0; i < tipos.length; i++) {
      const tipo = tipos[i];
      result.push({
        id: parseInt(this.getElementText(tipo, 'a:Id') || '0'),
        tipo: this.getElementText(tipo, 'a:Tipo') || ''
      });
    }

    return result;
  }

  /**
   * Extrae un valor booleano de la respuesta SOAP
   */
  static extractBoolean(xmlString: string, resultTag: string): boolean {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    
    const resultElement = xmlDoc.getElementsByTagName(resultTag)[0];
    if (resultElement) {
      return resultElement.textContent?.toLowerCase() === 'true';
    }
    return false;
  }

  /**
   * Obtiene el texto de un elemento hijo por nombre de tag
   */
  private static getElementText(parent: Element, tagName: string): string | null {
    const elements = parent.getElementsByTagName(tagName);
    if (elements.length > 0) {
      return elements[0].textContent;
    }
    return null;
  }
}
