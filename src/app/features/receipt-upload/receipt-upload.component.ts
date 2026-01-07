import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ProdutoNotaFiscalService, ProdutoNotaFiscal } from '../../core/services/produto-nota-fiscal.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-receipt-upload',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './receipt-upload.component.html',
  styleUrl: './receipt-upload.component.scss'
})
export class ReceiptUploadComponent implements OnInit, OnDestroy {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: SafeUrl | null = null;
  isDragging = false;
  isLoading = false;
  maxFileSize = 5 * 1024 * 1024; // 5MB
  allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
  produtosNotaFiscal: ProdutoNotaFiscal[] = [];
  currentPage = 0;
  isLoadingProducts = false;
  private destroy$ = new Subject<void>();

  categories = [
    'Alimentação',
    'Supermercado',
    'Farmácia',
    'Combustível',
    'Vestuário',
    'Eletrônicos',
    'Casa e Decoração',
    'Outros'
  ];

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private produtoNotaFiscalService: ProdutoNotaFiscalService,
    private snackBar: MatSnackBar
  ) {
    this.uploadForm = this.fb.group({
      receiptDate: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      storeName: ['', [Validators.required, Validators.minLength(2)]],
      category: ['', [Validators.required]],
      description: ['']
    });
  }

  ngOnInit(): void {
    // Set default date to today
    this.uploadForm.patchValue({
      receiptDate: new Date()
    });
  }

  // Drag and drop handlers
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileSelection(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFileSelection(input.files[0]);
    }
  }

  handleFileSelection(file: File): void {
    // Validate file type
    if (!this.allowedFileTypes.includes(file.type)) {
      alert('Tipo de arquivo não permitido. Use JPG, PNG, WEBP ou PDF.');
      return;
    }

    // Validate file size
    if (file.size > this.maxFileSize) {
      alert('Arquivo muito grande. Tamanho máximo: 5MB.');
      return;
    }

    this.selectedFile = file;

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(
            e.target.result as string
          );
        }
      };
      reader.readAsDataURL(file);
    } else {
      // For PDF, show a placeholder
      this.imagePreview = null;
    }
  }

  openFileDialog(): void {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    // Reset file input
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  isImageFile(): boolean {
    return this.selectedFile?.type.startsWith('image/') ?? false;
  }

  // Form getters
  get receiptDate() {
    return this.uploadForm.get('receiptDate');
  }

  get amount() {
    return this.uploadForm.get('amount');
  }

  get storeName() {
    return this.uploadForm.get('storeName');
  }

  get category() {
    return this.uploadForm.get('category');
  }

  get description() {
    return this.uploadForm.get('description');
  }

  // Error messages
  getAmountErrorMessage(): string {
    if (this.amount?.hasError('required')) {
      return 'Valor é obrigatório';
    }
    return this.amount?.hasError('min') ? 'Valor deve ser maior que zero' : '';
  }

  getStoreNameErrorMessage(): string {
    if (this.storeName?.hasError('required')) {
      return 'Nome do estabelecimento é obrigatório';
    }
    return this.storeName?.hasError('minlength') 
      ? 'Nome deve ter no mínimo 2 caracteres' 
      : '';
  }

  formatCurrency(value: string): string {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^\d,]/g, '');
    // Format as Brazilian currency
    if (numericValue) {
      const number = parseFloat(numericValue.replace(',', '.'));
      if (!isNaN(number)) {
        return number.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      }
    }
    return value;
  }

  onAmountInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = this.formatCurrency(input.value);
    this.uploadForm.patchValue({ amount: formatted }, { emitEvent: false });
  }

  onSubmit(): void {
    if (this.uploadForm.valid && this.selectedFile) {
      this.isLoading = true;

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('receiptDate', this.receiptDate?.value.toISOString());
      formData.append('amount', this.amount?.value.toString().replace(/\./g, '').replace(',', '.'));
      formData.append('storeName', this.storeName?.value);
      formData.append('category', this.category?.value);
      formData.append('description', this.description?.value || '');

      // TODO: Replace with actual API call when backend is ready
      // For now, simulate API call
      setTimeout(() => {
        this.isLoading = false;
        console.log('Receipt upload form submitted:', {
          file: this.selectedFile?.name,
          ...this.uploadForm.value
        });
        
        // After successful upload, load products from receipt
        this.loadProdutosNotaFiscal();
        
        this.snackBar.open('Receipt uploaded successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        
        this.resetForm();
      }, 2000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.uploadForm.controls).forEach(key => {
        this.uploadForm.get(key)?.markAsTouched();
      });

      if (!this.selectedFile) {
        this.snackBar.open('Please select a file.', 'Close', {
          duration: 3000
        });
      }
    }
  }

  /**
   * Load products from receipt (nota fiscal)
   */
  loadProdutosNotaFiscal(page: number = 0): void {
    this.isLoadingProducts = true;
    this.currentPage = page;

    this.produtoNotaFiscalService.getProdutosNotaFiscal(page)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (produtos) => {
          if (page === 0) {
            this.produtosNotaFiscal = produtos;
          } else {
            this.produtosNotaFiscal = [...this.produtosNotaFiscal, ...produtos];
          }
          this.isLoadingProducts = false;
        },
        error: (error) => {
          console.error('Error loading products from receipt:', error);
          this.isLoadingProducts = false;
          // Error is already handled by ErrorInterceptor
        }
      });
  }

  /**
   * Load more products (pagination)
   */
  loadMoreProducts(): void {
    this.loadProdutosNotaFiscal(this.currentPage + 1);
  }

  resetForm(): void {
    this.uploadForm.reset();
    this.uploadForm.patchValue({
      receiptDate: new Date()
    });
    this.removeFile();
    this.produtosNotaFiscal = [];
    this.currentPage = 0;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

