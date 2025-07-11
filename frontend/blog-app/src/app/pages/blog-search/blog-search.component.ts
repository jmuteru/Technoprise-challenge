import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BlogService, BlogPost } from '../../services/blog';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-blog-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './blog-search.component.html',
  styleUrl: './blog-search.component.css'
})
export class BlogSearchComponent implements OnInit {
  posts: BlogPost[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  totalResults = 0;

  constructor(private blogService: BlogService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['q'] || '';
      this.searchPosts();
    });
  }

  searchPosts(): void {
    this.loading = true;
    this.error = '';
    this.blogService.getBlogPosts(1, 100, this.searchTerm).subscribe({
      next: (response: any) => {
        this.posts = response.posts || [];
        this.totalResults = this.posts.length;
        if (this.posts.length === 0) {
          this.error = 'No blogs found.';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load search results.';
        this.loading = false;
      }
    });
  }

  onSearchInputChange(event: any): void {
    this.router.navigate([], { queryParams: { q: this.searchTerm }, queryParamsHandling: 'merge' });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
} 