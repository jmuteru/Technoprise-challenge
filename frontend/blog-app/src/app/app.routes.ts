import { Routes } from '@angular/router';
import { BlogList } from './pages/blog-list/blog-list.component';
import { BlogPostDetail } from './pages/blog-post/blog-post.component';
import { BlogSearchComponent } from './pages/blog-search/blog-search.component';

export const routes: Routes = [
  { path: '', component: BlogList },
  { path: 'posts/:slug', component: BlogPostDetail },
  { path: 'search', component: BlogSearchComponent },
  { path: '**', redirectTo: '' }
];
