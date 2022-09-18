/** 
 * ##############################################################################################
 * ##########################                Coderhouse                  ########################
 * ##########################                [Entregas]                  ########################
 * ##############################################################################################
 * ##########################                28/08/2022                  ########################
 * ##############################################################################################
 **/

/** 
 * -- Entrega nro. 2
 * 
 *  Especificación de formato: carpeta comprimida con el proyecto.
 * 
 *  Sugerencia: usar un archivo para la clase y otro de test, que la importe.
 * 
 *  Consigna: Implementar programa que contenga una clase llamada Contenedor 
 *  que reciba el nombre del archivo con el que va a trabajar.
 * 
 **/
const fs = require('fs');
const cod = 'utf-8';
const ext = '.txt'; // [.json] | [.txt]

class Contenedor {

  constructor(filePath) {
    this.filePath = `./${filePath}${ext}`;
  }

  /**
   * Método generador de ID.
   * @returns maxID
   */
  async generateID() {
    try {
      this.objects = await this.getAll();
      let maxID = this.objects.length;
      this.objects.forEach(prod => {
        prod.id > maxID ? maxID = prod.id : maxID
      })
      return maxID + 1;
    } catch (err) {
      throw new Error(`Error en el método (generateID()) \n: ${error.message}`);
    }
  }

  /**
   * - save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
   * @param {*} obj 
   * @returns 
   */
  async save(obj) {
    try {
      if (!fs.existsSync(this.filePath)) {
        //obj.id = (new Date()).getTime();        
        obj["id"] = 1;
        const contenidoJSON = JSON.stringify([obj], null, 2);
        await fs.promises.writeFile(this.filePath, contenidoJSON);
      }
      else {
        /** Se agrega el nuevo objeto al json existente en ./filePath. */
        const parseData = await this.getAll();
        obj.id = await this.generateID();
        parseData.push(obj);
        await fs.promises.writeFile(this.filePath, JSON.stringify(parseData, null, 2));
      }
      /**  Retorna el id del objeto. **/
      return obj.id;
    }
    catch (error) {
      throw new Error(`Error en el método (save()) \n: ${error.message}`);
    }
  }

  /**
 * - replace(Object, Number): void - Recibe un objeto, lo guarda en el archivo, con el id asignado.
 */
  async replace(obj, id) {
    try {
      await this.deleteById(id);
      if (fs.existsSync(this.filePath)) {
        const parseData = await this.getAll();
        obj["id"] = id;
        parseData.push(obj);
        await fs.promises.writeFile(this.filePath, JSON.stringify(parseData, null, 2));
      }
    }
    catch (error) {
      throw new Error(`Error en el método (replace()) \n: ${error.message}`);
    }
  }

  /**
   * - getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo.
   * @returns array
   */
  async getAll() {
    try {
      /** Lectura del archivo en filePath. **/
      if (!fs.existsSync(this.filePath)) {
        return (`Error en función getAll(): \n El directorio ${this.filePath} no existe.`);
      }
      else {
        const content = await fs.promises.readFile(this.filePath, cod);
        /** Si hay contenido devuelve el arreglo con esos datos. **/
        if (content.length > 0) {
          const arreglo = JSON.parse(content);
          return arreglo;
        }
        else {
          /** Si no hay datos, se devuelve un arreglo vacío. **/
          return [];
        }
      }
    }
    catch (error) {
      throw new Error(`Error en el método (getAll()): \n ${error.message}`);
    }
  }

  /**
   * - getById(Number): Object - Recibe un id y devuelve el objeto con ese id, o null si no está.
   * @param {*} id 
   * @returns 
   */
  async getById(id) {
    try {
      if (!fs.existsSync(this.filePath)) {
        return (`Error en función (getById()): \n El directorio ${this.filePath} no existe.`);
      } else {
        const contenido = await this.getAll();

        // Ejecuta búsqueda con find y si encuentra el id lo devuelve.
        const prod = contenido.find(prod => prod.id === id);
        if (prod) {
          return prod;
        } else {
          return null;
        }
      }
    } catch (error) {
      throw new Error(`Error en el método (getById()) \n: ${error.message}`);
    }
  }

  /**
   * - deleteAll(): void - Elimina todos los objetos presentes en el archivo. 
   */
  async deleteAll() {
    try {
      if (!fs.existsSync(this.filePath)) {
        return (`Error en función getById(): \n El directorio ${this.filePath} no existe.`);
      } else {
        await fs.promises.writeFile(this.filePath, "");
      }
    }
    catch (error) {
      throw new Error(`Error en el método (deleteAll()) \n: ${error.message}`);
    }
  }

  /**
   * - deleteFile(): void - Elimina el archivo y todos sus elementos con él. 
   */
  async deleteFile() {
    try {
      if (!fs.existsSync(this.filePath)) {
        return (`Error en función getById(): \n El directorio ${this.filePath} no existe.`);
      } else {
        fs.unlinkSync(this.filePath);
      }
    }
    catch (error) {
      throw new Error(`Error en el método (deleteFile()) \n: ${error.message}`);
    }
  }

  /**
   * - deleteById(Number): void - Elimina del archivo el objeto con el id buscado.
   */
  async deleteById(id) {
    try {
      if (!fs.existsSync(this.filePath)) {
        return (`Error en función getById(): \n El directorio ${this.filePath} no existe.`);
      } else {
        const content = await this.getAll();
        const eliminado = content.filter(prod => prod.id !== id);
        await fs.promises.writeFile(this.filePath, JSON.stringify(eliminado, null, 2));
      }
    } catch (error) {
      throw new Error(`Error en el método (deleteFile()) \n: ${error.message}`);
    }
  }
}

module.exports = Contenedor;