import { Injectable } from '@angular/core';
import { AppComponent } from '../app.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class InternshipsService {
  private baseUrl = AppComponent.baseUrl + '/gestion_entropots/entropots';
  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + this.tokenStorageService.getToken(),
    }),
  };
  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) {}

  getInternships() {
    return this.http.get(`${this.baseUrl}`, this.httpOptions);
  }

  getInternshipByInternshipId(internshipId: number) {
    return this.http.get(
      `${this.baseUrl}/id=${internshipId}`,
      this.httpOptions
    );
  }

  addInternship(internship: any) {
    return this.http.post(`${this.baseUrl}`, internship, this.httpOptions);
  }

  updateInternship( newInternship: any) {
    return this.http.put(
      `${this.baseUrl}`,
      newInternship,
      this.httpOptions
    );
  }

  deleteInternship(internshipId: number) {
    return this.http.delete(
      `${this.baseUrl}/${internshipId}`,
      this.httpOptions
    );
  }
}
