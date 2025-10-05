import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EditorComponent } from './components/editor/editor';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EditorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'compilador-demo';
}
