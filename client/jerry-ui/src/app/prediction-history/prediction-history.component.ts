import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PredictionService } from '../services/predictions.service';
import { PredictionHistory } from '../models/prediction-history';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-prediction-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prediction-history.component.html',
  styleUrl: './prediction-history.component.css'
})
export class PredictionHistoryComponent implements OnInit, OnDestroy {
  @Input() historyList: PredictionHistory[] = [];
  private intervalId: any;
  private subscription: Subscription = new Subscription();

  constructor(private predictionService: PredictionService) {}

  ngOnInit(): void {
    this.fetchPredictionHistory();
    this.intervalId = setInterval(() => {
      this.fetchPredictionHistory();
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.subscription.unsubscribe();
  }

  fetchPredictionHistory(): void {
    this.subscription.add(
      this.predictionService.getPredictionHistory().subscribe(history => {
        this.historyList = history
          .filter(item => item.prediction !== 'Hold')
          .slice(0, 5)
          .map(item => ({
            ...item,
            change: this.calculateChange(item.openPrice, item.currentPrice)
          }));
      })
    );
  }

  calculateChange(openPrice: number, currentPrice: number): string {
    const change = ((currentPrice - openPrice) / openPrice) * 100;
    return `${change.toFixed(2)}%`;
  }
}