import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TutorsService } from '../../services/tutors.service';
import { TokenStorageService } from '../../services/token-storage.service';
import {ActivatedRoute, Router} from '@angular/router';
import { CompaniesService } from '../../services/companies.service';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
  selector: 'app-tutors',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './tutors.component.html',
  styleUrl: './tutors.component.css',
})
export class TutorsComponent implements OnInit {
  companyForm = new FormGroup({
    id: new FormControl(''),
    id_client: new FormGroup({
      id: new FormControl('')
    })
  });

  displayedColumns: string[] = [
    'ID',
    'id_client',
    'Actions',
  ];

  tutorsList: any[] = [];
  companiesList: any[] = [];
  editMode = false;
  currentSiretNumber: number = 0;
  currentTutorNumber: number = 0;
  entropotId: number = 0;

  constructor(
    private companiesService: TutorsService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.entropotId = +idParam;
        this.getTutors();
      } else {
        console.error('ID de l\'entrepôt manquant dans l\'URL.');
      }
    });
  }

  getTutors() {
    this.companiesService.getEntropot(this.entropotId).subscribe({ next: (data : any)  => {
        this.companiesList = data;
      }});
  }

  getCompanies() {
    return this.companiesService.getCompanies().subscribe({
      next: (data: any) => {
        this.companiesList = data;
      },
      error: (err) => {
        if (err.status === 403) {
          this.tokenStorageService.logout();
        }
      },
    });
  }

  handleSearch(event: any) {
    const keyWord = event.target.value.toString(); // Convert keyWord to a string

    if (keyWord) {
      this.companiesList = this.companiesList.filter((entreprise: any) => {
        return  entreprise.id_produit.toString().includes(keyWord);
      });
    } else {
      this.getCompanies();
    }
  }



  getCompanyBySiretNumber(siretNumber: number) {
    return this.companiesService
      .getCompanyBySiretNumber(siretNumber)
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
    this.companyForm.patchValue(entreprise);
  }

  addCompany() {
    if (this.companyForm.valid) {
      this.companiesService.addCompany(this.companyForm.value).subscribe({
        next: (data: any) => {
          this.getCompanies();
          this.companyForm.reset();
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
    this.companiesService
      .updateCompany(this.companyForm.value)
      .subscribe({
        next: (data: any) => {
          this.getCompanies();
          this.editMode = false;
          this.companyForm.reset();
        },
        error: (e: any) => {
          if (e.status === 403) {
            this.tokenStorageService.logout();
          }
        },
      });
  }

  deleteCompany(siretNumber: number) {
    this.companiesService.deleteCompany(siretNumber).subscribe({
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
}
