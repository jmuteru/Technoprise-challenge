import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header.component';
import { CommonModule } from '@angular/common';
import { CreatePostModalComponent } from './components/create-post-modal/create-post-modal.component';
import { ToastrModule } from 'ngx-toastr';
import { Footer } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Header, CreatePostModalComponent, ToastrModule, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('blog-');

  showCreatePostModal = false;

  onCreatePostRequested() {
    this.showCreatePostModal = true;
  }

  closeCreatePostModal() {
    this.showCreatePostModal = false;
  }
}
