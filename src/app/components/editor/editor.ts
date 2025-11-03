import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompiladorService, ResultadoCompilacion } from '../../services/compilador.service';

declare const monaco: any;

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './editor.html',
  styleUrls: ['./editor.css']
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('editorContainer', { static: false }) editorContainer!: ElementRef;
  
  private editor: any;
  resultado: ResultadoCompilacion | null = null;
  tabActiva: 'tokens' | 'cuadruplos' | 'errores' = 'tokens';
  timestamp: number = Date.now(); // Para forzar recreación del DOM

  constructor(private compiladorService: CompiladorService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMonaco();
    }, 100);
  }

  private initMonaco(): void {
    if (typeof monaco !== 'undefined') {
      this.createEditor();
    } else {
      const script = document.createElement('script');
      script.src = 'assets/monaco/vs/loader.js';
      script.onload = () => {
        (window as any).require.config({ 
          paths: { vs: 'assets/monaco/vs' } 
        });
        (window as any).require(['vs/editor/editor.main'], () => {
          this.createEditor();
        });
      };
      document.body.appendChild(script);
    }
  }

  private createEditor(): void {
    const containerHeight = this.editorContainer.nativeElement.offsetHeight;
    console.log('Altura del contenedor:', containerHeight);

    this.editor = monaco.editor.create(this.editorContainer.nativeElement, {
      value: `class mi_program
def private A as int;
main()
  Cont = 0;
end
endclass`,
      language: 'plaintext',
      theme: 'vs-dark',
      automaticLayout: true,
      fontSize: 14
    });

    setTimeout(() => {
      if (this.editor) {
        this.editor.layout();
      }
    }, 100);
  }

  async compilar(): Promise<void> {
    console.log('=== Iniciando compilación ===');
    
    // Limpiar completamente el resultado
    this.resultado = null;
    this.timestamp = Date.now(); // Nuevo timestamp para forzar recreación
    
    const codigo = this.editor.getValue();
    console.log('Código a compilar:', codigo);
    
    const nuevoResultado = await this.compiladorService.compilar(codigo);
    console.log('Resultado obtenido:', nuevoResultado);
    
    // Asignar el nuevo resultado
    this.resultado = nuevoResultado;
    
    console.log('=== Compilación finalizada ===');
  }

  // Funciones trackBy para optimizar el renderizado
  trackByIndex(index: number, item: any): number {
    return index;
  }

  trackByCuadruplo(index: number, cuadruplo: any): string {
    return `${cuadruplo.num}-${index}`;
  }

  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.dispose();
    }
  }
}