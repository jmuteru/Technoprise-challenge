import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  created_at: string;
  updated_at: string;
  image: string; // URL or filename of the blog post image
}

export interface BlogListResponse {
  posts: BlogPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:8080'; // Your Go backend URL

  constructor(private http: HttpClient) { }

  // Get all blog posts with pagination
  getBlogPosts(page: number = 1, limit: number = 6, search?: string): Observable<BlogListResponse> {
    let url = `${this.apiUrl}/api/posts?page=${page}&limit=${limit}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    return this.http.get<BlogListResponse>(url);
  }

  // Get a single blog post by slug
  getBlogPost(slug: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.apiUrl}/api/posts/${slug}`);
  }

  // Create a new blog post
  createBlogPost(post: Partial<BlogPost>): Observable<BlogPost> {
    return this.http.post<BlogPost>(`${this.apiUrl}/api/posts`, post);
  }

  // Update a blog post
  updateBlogPost(id: number, post: Partial<BlogPost>): Observable<BlogPost> {
    return this.http.put<BlogPost>(`${this.apiUrl}/api/posts/${id}`, post);
  }

  // Delete a blog post
  deleteBlogPost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/posts/${id}`);
  }
}
