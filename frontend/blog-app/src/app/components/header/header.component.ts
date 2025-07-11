import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [FormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class Header {
  @Output() createPostRequested = new EventEmitter<void>();
  headerSearchTerm = '';
  constructor(private router: Router) {}

  openCreatePostModal() {

    this.createPostRequested.emit();
  }

  onHeaderSearch() {
    if (this.headerSearchTerm && this.headerSearchTerm.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.headerSearchTerm.trim() } });
    }
  }


}
