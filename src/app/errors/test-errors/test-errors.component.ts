import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-test-errors',
  standalone: true,
  imports: [],
  templateUrl: './test-errors.component.html',
  styleUrl: './test-errors.component.css'
})
export class TestErrorsComponent {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  validationErrors: string[] = [];

  get400Error(){
    this.http.get(this.baseUrl + "buggy/bad-request").subscribe({
      error: err => {
        console.log(err);
      }
    });
  }

  get401Error(){
    this.http.get(this.baseUrl + "buggy/auth").subscribe({
      error: err => {
        console.log(err);
      }
    });
  }

  get404Error(){
    this.http.get(this.baseUrl + "buggy/not-found").subscribe({
      error: err => {
        console.log(err);
      }
    });
  }

  get500Error(){
    this.http.get(this.baseUrl + "buggy/server-error").subscribe({
      error: err => {
        console.log(err);
      }
    });
  }

  get404ValidationError(){
    this.http.post(this.baseUrl + "account/register", {}).subscribe({
      error: err => {
        console.log(err);
        this.validationErrors = err;
      }
    });
  }
}
