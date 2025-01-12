import { Component, OnInit, OnDestroy } from '@angular/core';
import { PredictionService } from '../services/predictions.service';
import { Prediction } from '../models/prediction';
import { PredictionHistory } from '../models/prediction-history';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { PredictionHistoryComponent } from '../prediction-history/prediction-history.component';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-predictions',
  standalone: true,
  imports: [  
    MatCardModule,
    MatListModule,
    MatIconModule,
    CommonModule,
    PredictionHistoryComponent,
    FormsModule,
    MatCheckboxModule 
  ],
  templateUrl: './predictions.component.html',
  styleUrl: './predictions.component.css'
})
export class PredictionsComponent implements OnInit, OnDestroy {

  currentPrediction: Prediction | null = null;
  predictionHistory: PredictionHistory[] = [];
  private intervalId: any;
  private subscription: Subscription = new Subscription();
  showHistory = false;

  constructor(private predictionService: PredictionService) {}

  ngOnInit(): void {
    this.fetchLatestPrediction();
    this.intervalId = setInterval(() => {
      this.fetchLatestPrediction();
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.subscription.unsubscribe();
  }

  fetchLatestPrediction(): void {
    this.subscription.add(
      this.predictionService.getCurrentPrediction().subscribe(prediction => {
        this.currentPrediction = prediction;
      })
    );
  }

  fetchPredictionHistory(): void {
    this.subscription.add(
      this.predictionService.getPredictionHistory().subscribe(history => {
        this.predictionHistory = history;
      })
    );
  }
}
