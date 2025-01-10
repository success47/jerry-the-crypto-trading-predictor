import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prediction } from '../models/prediction';
import { PredictionHistory } from '../models/prediction-history';


@Injectable({ providedIn: 'root' })
export class PredictionService {
  private predictionUrl = 'http://localhost:3001/api/prediction';
  private predictionHistoryUrl = 'http://localhost:3001/api/prediction-history';

  constructor(private http: HttpClient) {}

  getCurrentPrediction(): Observable<Prediction> {
    return this.http.get<Prediction>(this.predictionUrl);
  }

  getPredictionHistory(): Observable<PredictionHistory[]> {
    return this.http.get<PredictionHistory[]>(this.predictionHistoryUrl);
  }
}