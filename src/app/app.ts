import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from './components/app-header.component';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, AppHeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('gestao-escolar-ui');
}
