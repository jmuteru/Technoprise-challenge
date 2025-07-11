import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-post-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './create-post-modal.component.html',
  styleUrl: './create-post-modal.component.css'
})
export class CreatePostModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() postCreated = new EventEmitter<void>();

  // form fields
  title = '';
  date = '';
  slug = '';
  content = '';
  imageFile: File | null = null;
  imagePreview: string | null = null;

  // Validation state
  errors: { [key: string]: string } = {};
  submitting = false;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  // Handle file input
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.type.match(/^image\/(jpeg|png)$/)) {
        this.errors['image'] = 'Only PNG or JPEG images are allowed.';
        this.imageFile = null;
        this.imagePreview = null;
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.errors['image'] = 'Image must be less than 2MB.';
        this.imageFile = null;
        this.imagePreview = null;
        return;
      }
      this.errors['image'] = '';
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Generate slug from title
  onTitleChange() {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Validate form
  validate(): boolean {
    this.errors = {};
    if (!this.title.trim()) this.errors['title'] = 'Title is required.';
    if (!this.date.trim()) this.errors['date'] = 'Date is required.';
    if (!this.slug.trim()) this.errors['slug'] = 'Slug is required.';
    if (!this.content.trim()) this.errors['content'] = 'Content is required.';
    if (!this.imageFile) this.errors['image'] = 'Image is required.';
    return Object.keys(this.errors).length === 0;
  }

  // Submit form
  async onSubmit() {
    if (!this.validate()) return;
    this.submitting = true;

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('slug', this.slug);
    formData.append('date', this.date);
    formData.append('content', this.content);
    if (this.imageFile) formData.append('image', this.imageFile);

    this.http.post('http://localhost:8080/api/posts', formData).subscribe({
      next: (res) => {
        this.submitting = false;
        this.toastr.success('Blog post created successfully!', 'Success');
        this.postCreated.emit();
        this.close.emit();
      },
      error: (err) => {
        this.submitting = false;
        this.toastr.error('Failed to create blog post.', 'Error');
      }
    });
  }

  // Close modal
  onClose() {
    this.close.emit();
  }
} 