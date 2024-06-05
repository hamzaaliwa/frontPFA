import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TokenStorageService } from '../../services/token-storage.service';
import { Router } from '@angular/router';
import { InternshipsService } from '../../services/internships.service';
import { SkillsComponent } from '../skills/skills.component';
import { InternshipsDatesComponent } from '../internships-dates/internships-dates.component';
import { ProfessorsService } from '../../services/professors.service';
import { CompaniesService } from '../../services/companies.service';
import { StudentsService } from '../../services/students.service';
import { TutorsService } from '../../services/tutors.service';
import { PromoService } from '../../services/promo.service';

@Component({
  selector: 'app-internships',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './internships.component.html',
  styleUrl: './internships.component.css',
})
export class InternshipsComponent implements OnInit {
  internshipForm = new FormGroup({
    id: new FormControl(),
    nom: new FormControl(),
    adresse: new FormControl(),
    stock: new FormGroup({
      id: new FormControl()
    }),
    admin: new FormGroup({
      id: new FormControl()
    }),
  });

  displayedColumns: string[] = [
    'ID',
    'Nom',
    'Adresse',
    'Stock',
    'Admin',
    'Actions',
  ];

  companiesList: any[] = [];
  editMode = false;
  currentSiretNumber: number = 0;

  constructor(
    private internshipservice: InternshipsService,
    private tokenStorageService: TokenStorageService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getCompanies();
  }

  getCompanies() {
    return this.internshipservice.getInternships().subscribe({
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
    return this.internshipservice
      .getInternshipByInternshipId(siretNumber)
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
      this.internshipservice.addInternship(this.internshipForm.value).subscribe({
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
    this.internshipservice
      .updateInternship(this.internshipForm.value)
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
    this.internshipservice.deleteInternship(siretNumber).subscribe({
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

  navigateToCompany(id: number): void {
    this.router.navigateByUrl(`/ProdParEntropot/${id}`);
  }
}
