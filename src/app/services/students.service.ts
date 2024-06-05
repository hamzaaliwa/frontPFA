import { Injectable } from '@angular/core';
import { AppComponent } from '../app.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  private baseUrl = AppComponent.baseUrl + '/gestion_commandes/fournisseurs';
  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + this.tokenStorageService.getToken(),
    }),
  };

  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) {}

  getstocks() {
    return this.http.get(`${this.baseUrl}`, this.httpOptions);
  }

  getstockBystockId(internshipId: number) {
    return this.http.get(
      `${this.baseUrl}/id=${internshipId}`,
      this.httpOptions
    );
  }

  addstock(internship: any) {
    return this.http.post(`${this.baseUrl}`, internship, this.httpOptions);
  }

  updatestock( newstock: any) {
    return this.http.put(
      `${this.baseUrl}`,
      newstock,
      this.httpOptions
    );
  }

  deletestock(internshipId: number) {
    return this.http.delete(
      `${this.baseUrl}/${internshipId}`,
      this.httpOptions
    );
  }
}
