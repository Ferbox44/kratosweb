import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompiladorService, ResultadoCompilacion } from '../../services/compilador.service';
declare const monaco: any;

@Component({
  selector: 'app-editor',
  standalone: true,
  templateUrl: './editor.html',
  imports: [CommonModule],
  styles: []
})
export class EditorComponent implements OnInit, OnDestroy {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  
  private editor: any;
  resultado: ResultadoCompilacion | null = null;
  tabActiva: 'tokens' | 'cuadruplos' | 'errores' = 'tokens';

  constructor(private compiladorService: CompiladorService) {}

  ngOnInit(): void {
    this.initMonaco();
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
  }

  async compilar(): Promise<void> {
    const codigo = this.editor.getValue();
    this.resultado = await this.compiladorService.compilar(codigo);
  }

  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.dispose();
    }
  }
}