import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { City } from '../../models';
import { CityService } from '../../core/services/city.service';

@Component({
  selector: 'app-establishment-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './establishment-signup.component.html',
  styleUrl: './establishment-signup.component.scss'
})
export class EstablishmentSignupComponent implements OnInit {
  signupForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  filteredCities$!: Observable<City[]>;
  cityControl = this.fb.control('', [Validators.required]);

  constructor(
    private fb: FormBuilder,
    private cityService: CityService
  ) {
    this.signupForm = this.fb.group({
      businessName: ['', [Validators.required, Validators.minLength(3)]],
      cnpj: ['', [Validators.required, this.cnpjValidator]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, this.phoneValidator]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: this.cityControl,
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      termsAccepted: [false, [Validators.requiredTrue]]
    });
  }

  ngOnInit(): void {
    // Setup city autocomplete
    this.filteredCities$ = this.cityControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (typeof value === 'string' && value.length >= 2) {
          return this.cityService.searchCities(value);
        }
        return new Observable<City[]>(subscriber => subscriber.next([]));
      })
    );
  }

  // Custom validators
  cnpjValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const cnpj = control.value.replace(/[^\d]/g, '');
    
    if (cnpj.length !== 14) {
      return { invalidCnpj: true };
    }

    // Check for known invalid CNPJs
    if (/^(\d)\1+$/.test(cnpj)) {
      return { invalidCnpj: true };
    }

    // CNPJ validation algorithm
    let length = cnpj.length - 2;
    let numbers = cnpj.substring(0, length);
    const digits = cnpj.substring(length);
    let sum = 0;
    let pos = length - 7;

    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) {
      return { invalidCnpj: true };
    }

    length = length + 1;
    numbers = cnpj.substring(0, length);
    sum = 0;
    pos = length - 7;

    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) {
      return { invalidCnpj: true };
    }

    return null;
  }

  phoneValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const phone = control.value.replace(/[^\d]/g, '');
    
    // Brazilian phone: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
    if (phone.length < 10 || phone.length > 11) {
      return { invalidPhone: true };
    }

    return null;
  }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const password = control.value;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return { weakPassword: true };
    }

    return null;
  }

  // Format CNPJ input
  formatCNPJ(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^\d]/g, '');
    
    if (value.length <= 14) {
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
      this.signupForm.patchValue({ cnpj: value }, { emitEvent: false });
    }
  }

  // Format phone input
  formatPhone(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^\d]/g, '');
    
    if (value.length <= 11) {
      if (value.length <= 10) {
        value = value.replace(/^(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
      } else {
        value = value.replace(/^(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
      }
      this.signupForm.patchValue({ phone: value }, { emitEvent: false });
    }
  }

  // Getters for form controls
  get businessName() {
    return this.signupForm.get('businessName');
  }

  get cnpj() {
    return this.signupForm.get('cnpj');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get phone() {
    return this.signupForm.get('phone');
  }

  get address() {
    return this.signupForm.get('address');
  }

  get city() {
    return this.signupForm.get('city');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get termsAccepted() {
    return this.signupForm.get('termsAccepted');
  }

  // Error messages
  getBusinessNameErrorMessage(): string {
    if (this.businessName?.hasError('required')) {
      return 'Razão social é obrigatória';
    }
    return this.businessName?.hasError('minlength') 
      ? 'Razão social deve ter no mínimo 3 caracteres' 
      : '';
  }

  getCnpjErrorMessage(): string {
    if (this.cnpj?.hasError('required')) {
      return 'CNPJ é obrigatório';
    }
    return this.cnpj?.hasError('invalidCnpj') ? 'CNPJ inválido' : '';
  }

  getEmailErrorMessage(): string {
    if (this.email?.hasError('required')) {
      return 'Email é obrigatório';
    }
    return this.email?.hasError('email') ? 'Email inválido' : '';
  }

  getPhoneErrorMessage(): string {
    if (this.phone?.hasError('required')) {
      return 'Telefone é obrigatório';
    }
    return this.phone?.hasError('invalidPhone') ? 'Telefone inválido' : '';
  }

  getAddressErrorMessage(): string {
    if (this.address?.hasError('required')) {
      return 'Endereço é obrigatório';
    }
    return this.address?.hasError('minlength') 
      ? 'Endereço deve ter no mínimo 5 caracteres' 
      : '';
  }

  getPasswordErrorMessage(): string {
    if (this.password?.hasError('required')) {
      return 'Senha é obrigatória';
    }
    if (this.password?.hasError('minlength')) {
      return 'Senha deve ter no mínimo 8 caracteres';
    }
    return this.password?.hasError('weakPassword') 
      ? 'Senha deve conter maiúsculas, minúsculas, números e caracteres especiais' 
      : '';
  }

  displayCity(city: City | string): string {
    if (typeof city === 'string') {
      return city;
    }
    return city ? `${city.name} - ${city.state}` : '';
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isLoading = true;
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        console.log('Signup form submitted:', this.signupForm.value);
        // Navigate to success page or home after successful registration
      }, 1500);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.signupForm.controls).forEach(key => {
        this.signupForm.get(key)?.markAsTouched();
      });
    }
  }
}

