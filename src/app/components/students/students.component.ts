import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { TokenStorageService } from '../../services/token-storage.service';
import { StudentsService } from '../../services/students.service';
import {PromoService} from "../../services/promo.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})
export class StudentsComponent implements OnInit {
  internshipForm = new FormGroup({
    id: new FormControl(),
    nom: new FormControl(),
    prenom : new FormControl(),
    adresse: new FormControl(),
  });

  displayedColumns: string[] = [
    'ID',
    'Nom',
    'Prénom',
    'Adresse',
    'Actions',
  ];

  companiesList: any[] = [];
  editMode = false;
  currentSiretNumber: number = 0;

  constructor(
    private promoservice
      : StudentsService,
    private tokenStorageService: TokenStorageService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getCompanies();
  }

  getCompanies() {
    return this.promoservice
      .getstocks().subscribe({
        next: (data: any) => {
          this.companiesList = data;
        },
        error: (e: any) => {
          if (e.status === 403) {
            this.tokenStorageService.logout();
          }
        },
      });
  }

  handleSearch(event: any) {
    const keyWord = event.target.value.toString(); // Convert keyWord to a string

    if (keyWord) {
      this.companiesList = this.companiesList.filter((entreprise: any) => {
        return  entreprise.id.toString().includes(keyWord);
      });
    } else {
      this.getCompanies();
    }
  }



  getCompanyBySiretNumber(siretNumber: number) {
    return this.promoservice

      .getstockBystockId(siretNumber)
      .subscribe({
        next: (data: any) => console.log(data),
        error: (e: any) => {
          if (e.status === 403) {
            this.tokenStorageService.logout();
          }
        },
      });
  }



  handleCompanyForm() {
    if (this.editMode) {
      this.updateCompany();
    } else {
      this.addCompany();
    }
  }

  handleUpdateCompany(entreprise: any) {
    this.editMode = true;
    this.currentSiretNumber = entreprise.siretNumber;
    this.internshipForm.patchValue(entreprise);
  }

  addCompany() {
    if (this.internshipForm.valid) {
      this.promoservice
        .addstock(this.internshipForm.value).subscribe({
        next: (data: any) => {
          this.getCompanies();
          this.internshipForm.reset();
        },
        error: (e: any) => {
          if (e.status === 403) {
            this.tokenStorageService.logout();
          }
        },
      });
    } else {
      console.log('invalid form');
    }
  }

  updateCompany() {
    this.promoservice

      .updatestock(this.internshipForm.value)
      .subscribe({
        next: (data: any) => {
          this.getCompanies();
          this.editMode = false;
          this.internshipForm.reset();
        },
        error: (e: any) => {
          if (e.status === 403) {
            this.tokenStorageService.logout();
          }
        },
      });
  }

  deleteCompany(siretNumber: number) {
    this.promoservice
      .deletestock(siretNumber).subscribe({
      next: () => {
        this.getCompanies();
      },
      error: (e: any) => {
        if (e.status === 403) {
          this.tokenStorageService.logout();
        }
      },
    });
  }


  /*navigateToCompany(id: number): void {
    this.router.navigateByUrl(`/commandes/${id}`);
  }*/
}
