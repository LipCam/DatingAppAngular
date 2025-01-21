import { Component, inject, OnInit, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { TextInputComponent } from "../_forms/text-input/text-input.component";
import { DatePickerComponent } from "../_forms/date-picker/date-picker.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent, DatePickerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {  
  accountService = inject(AccountService);
  cancelRegister = output<boolean>();
  
  registerForm: FormGroup = new FormGroup({});
  private fb = inject(FormBuilder);
  
  maxDate = new Date();
  router = inject(Router);
  validationErrors: string[] | undefined;

  ngOnInit(): void {
    this.onInitializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  onInitializeForm(){
    this.registerForm = this.fb.group({
      gender: ['male'],
      userName: ['', [Validators.required, Validators.minLength(4)]],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
    });

    this.registerForm.controls["password"].valueChanges.subscribe({
      next: () => this.registerForm.controls["confirmPassword"].updateValueAndValidity()
    })
  }

  matchValues(matchTo: string): ValidatorFn{
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : { isMatching: true }
    }
  }

  onRegister() {
    const dob = this.onGetDateOnly(this.registerForm.get('dateOfBirth')?.value); //tratando o formato da data para yyyy-mm-dd
    this.registerForm.patchValue({ dateOfBirth: dob }); //setando o valor corrigido no formulario
    this.accountService.onRegister(this.registerForm.value).subscribe(
      {
        next: _ => this.router.navigateByUrl("/members"),
        error: error => this.validationErrors = error
        // error: err => {
        //   console.log(err.error.errors);
        //   for(var key in err.error.errors){
        //     this.toastr.error(err.error.errors[key]);
        //   }
        // }
      }
    );
  }

  onCancel(){
    this.cancelRegister.emit(false);
  }

  private onGetDateOnly(dt: string | undefined){
    if(!dt) 
      return;

    return new Date(dt).toISOString().slice(0,10);
  }
}
