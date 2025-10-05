import { Injectable } from '@angular/core';

export interface Token {
  lexema: string;
  tipo: string;
}

export interface Cuadruplo {
  num: number;
  operador: string;
  operando1: string;
  operando2: string;
  resultado: string;
}

export interface ResultadoCompilacion {
  cuadruplos: Cuadruplo[];
  errores: string[];
  erroresSemanticos: string[];
  mensaje: string;
  success: boolean;
  tokens: Token[];
}

declare global {
  interface Window {
    Module: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class CompiladorService {
  private moduleLoaded = false;
  private modulePromise: Promise<void> | null = null;

  constructor() {
    this.loadModule();
  }

  private loadModule(): Promise<void> {
    if (this.modulePromise) {
      return this.modulePromise;
    }

    this.modulePromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'assets/wasm/compilador.js';
      script.onload = () => {
        // Esperar a que el módulo WASM se inicialice
        const checkModule = () => {
          if (window.Module && window.Module.ccall) {
            this.moduleLoaded = true;
            console.log('Módulo WASM cargado correctamente');
            resolve();
          } else {
            setTimeout(checkModule, 50);
          }
        };
        
        if (window.Module && window.Module.onRuntimeInitialized) {
          window.Module.onRuntimeInitialized = () => {
            checkModule();
          };
        } else {
          checkModule();
        }
      };
      script.onerror = () => reject(new Error('Error cargando compilador.js'));
      document.body.appendChild(script);
    });

    return this.modulePromise;
  }

  async compilar(codigo: string): Promise<ResultadoCompilacion> {
    await this.loadModule();

    try {
      // Verifica que ccall está disponible
      if (!window.Module || !window.Module.ccall) {
        throw new Error('El módulo WASM no está completamente cargado');
      }

      // Llama a la función _analizarCodigo usando ccall
      // Sintaxis: ccall(nombreFuncion, tipoRetorno, [tiposParametros], [parametros])
      const resultado = window.Module.ccall(
        'analizarCodigo',  // Nombre sin el guión bajo
        'string',          // Tipo de retorno
        ['string'],        // Tipos de parámetros
        [codigo]           // Parámetros
      );
      
      console.log('Resultado del compilador:', resultado);
      
      // Si el resultado es un string JSON, parsearlo
      if (typeof resultado === 'string') {
        return JSON.parse(resultado);
      }
      
      return resultado;
    } catch (error) {
      console.error('Error al compilar:', error);
      return {
        cuadruplos: [],
        errores: [`Error al compilar: ${error}`],
        erroresSemanticos: [],
        mensaje: 'ERROR EN LA COMPILACIÓN',
        success: false,
        tokens: []
      };
    }
  }
}