import { Injectable } from '@angular/core';
import { AppComponent } from '../app.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  private baseUrl = AppComponent.baseUrl + '/gestion_entropots/Produitentropots';
  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + this.tokenStorageService.getToken(),
    }),
  };

  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService
  ) {}

  getCompanies() {
    return this.http.get(`${this.baseUrl}`, this.httpOptions);
  }

  getCompanyBySiretNumber(siretNumber: number) {
    return this.http.get(
      `${this.baseUrl}/siret=${siretNumber}`,
      this.httpOptions
    );
  }

  getCompanyByBusinessName(businessName: string) {
    return this.http.get(
      `${this.baseUrl}/name=${businessName}`,
      this.httpOptions
    );
  }

  addCompany(company: any) {
    return this.http.post(`${this.baseUrl}`, company, this.httpOptions);
  }

  updateCompany(newCompany: any) {
    return this.http.put(
      `${this.baseUrl}`,
      newCompany,
      this.httpOptions
    );
  }

  deleteCompany(siretNumber: number) {
    return this.http.delete(
      `${this.baseUrl}/${siretNumber}`,
      this.httpOptions
    );
  }

  getEntropot(entropotId: number) {
    return this.http.get(`${this.baseUrl}/prdosuitsbyentropots/${entropotId}`);
  }
}
