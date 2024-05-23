import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  isLoginFormVisible: boolean = true;
  loginUsername: string = '';
  loginPassword: string = '';
  registerUsername: string = '';
  registerEmail: string = '';
  registerPassword: string = '';

  username: string = '';
  password: string = '';
  isLoginError: boolean = false;

  toggleForm() {
    this.isLoginFormVisible = !this.isLoginFormVisible;
  }

  onLoginSubmit() {
    this.apiService.login(this.loginUsername, this.loginPassword).subscribe((success) => {
      if (success) {
        console.log('Login sent');
      } else {
        this.isLoginError = true;
        console.log('Login failed');
      }
    });
  }

  onRegisterSubmit() {
    console.log('Register - Username:', this.registerUsername);
    console.log('Register - Email:', this.registerEmail);
    console.log('Register - Password:', this.registerPassword);
    this.apiService.register(this.registerUsername, this.registerEmail, this.registerPassword).subscribe((success) => {
      if (success) {
        console.log('Register sent');
      } else {
        this.isLoginError = true;
        console.log('Register failed');
      }
    });
  }

  logout() {
    this.apiService.logout();
  }
  
  constructor(public apiService: ApiService) {}
}
