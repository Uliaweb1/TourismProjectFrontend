import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ToursComponent } from './tours/tours.component';
import { GalleryComponent } from './gallery/gallery.component';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tours', component: ToursComponent }, 
  { path: 'gallery', component: GalleryComponent },
  { path: 'registration', component: RegistrationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
