import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService, BlogPost } from '../../services/blog';

@Component({
  selector: 'app-blog-post',
  imports: [CommonModule],
  templateUrl: './blog-post.component.html',
  styleUrl: './blog-post.component.css'
})
export class BlogPostDetail implements OnInit {
  post: BlogPost | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.loadPost(slug);
      }
    });
  }

  loadPost(slug: string): void {
    this.loading = true;
    this.error = '';
    
    this.blogService.getBlogPost(slug).subscribe({
      next: (post: BlogPost) => {
        this.post = post;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Blog post not found or failed to load.';
        this.loading = false;
        console.error('Error loading post:', err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
