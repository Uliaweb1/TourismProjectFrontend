import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  snapshotURL = "http://localhost:4200/assets/files/TourismProject.pdf"
  constructor(private router: Router, public apiService: ApiService) {}

  redirectToTours() {
    this.router.navigate(['/tours']);
  }

  downloadFile() {
    const a = document.createElement('a');
    a.href = this.snapshotURL;
    a.download = 'TourismProject-snapshot.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
