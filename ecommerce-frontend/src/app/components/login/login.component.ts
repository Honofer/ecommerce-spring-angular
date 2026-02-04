import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styles: [`
    .login-container {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      background: white;
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    this.error = '';
    this.isLoading = true;

    this.authService.login(this.username, this.password).subscribe({
      next: (users) => {
        if (this.authService.isLoggedIn()) {
          console.log('Connexion réussie');
          this.router.navigate(['/dashboard']);
        } else {
          this.error = 'Utilisateur non trouvé dans la liste';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur de connexion', err);
        if (err.status === 401 || err.status === 403) {
          this.error = 'Identifiants incorrects';
        } else {
          this.error = 'Une erreur est survenue lors de la connexion au serveur';
        }
        this.isLoading = false;
      }
    });
  }
}
