import { Routes } from '@angular/router';
import { PredictionsComponent } from './predictions/predictions.component';

export const routes: Routes = [
  { path: '', component: PredictionsComponent },
  { path: 'prediction', component: PredictionsComponent }
];
