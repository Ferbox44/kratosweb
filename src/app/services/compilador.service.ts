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
      if (!window.Module || !window.Module.ccall) {
        throw new Error('El módulo WASM no está completamente cargado');
      }

      // Intentar limpiar memoria si existe una función para ello
      if (window.Module._limpiarMemoria) {
        window.Module._limpiarMemoria();
      }

      const resultadoString: string = window.Module.ccall(
        'analizarCodigo',
        'string',
        ['string'],
        [codigo]
      );

      const resultadoParsed = JSON.parse(resultadoString);

      return JSON.parse(JSON.stringify(resultadoParsed));

    } catch (error) {
      console.error('Error al compilar:', error);
      return {
        cuadruplos: [],
        errores: [],
        erroresSemanticos: [],
        mensaje: 'ERROR EN LA COMPILACIÓN',
        success: false,
        tokens: []
      };
    }
  }
}