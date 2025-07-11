import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BlogService, BlogPost, BlogListResponse } from '../../services/blog';
import { CreatePostModalComponent } from '../../components/create-post-modal/create-post-modal.component';

@Component({
  selector: 'app-blog-list',
  imports: [CommonModule, FormsModule, RouterModule,  CreatePostModalComponent],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.css'
})
export class BlogList implements OnInit {
  posts: BlogPost[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  currentPage = 1;
  totalPages = 1;
  totalPosts = 0;
  postsPerPage = 6;

  showCreatePostModal = false;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  onCreatePostRequested() {
    this.showCreatePostModal = true;
  }

  onPostCreated() {
    this.showCreatePostModal = false;
    this.currentPage = 1;
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;
    this.error = '';
    
    this.blogService.getBlogPosts(this.currentPage, this.postsPerPage, this.searchTerm)
      .subscribe({
        next: (response: any) => {
          // Handle null posts from backend
          if (!response.posts) {
            this.posts = [];
            this.totalPosts = 0;
            this.totalPages = 1;
            this.currentPage = 1;
            this.loading = false;
            return;
          }
          this.posts = response.posts;
          this.totalPosts = response.posts.length;
          this.totalPages = 1;
          this.currentPage = 1;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load blog posts. Please try again.';
          this.loading = false;
          console.error('Error loading posts:', err);
        }
      });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadPosts();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadPosts();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (this.currentPage >= this.totalPages - 2) {
        for (let i = this.totalPages - 4; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = this.currentPage - 2; i <= this.currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  }

  get math() {
    return Math;
  }
}
