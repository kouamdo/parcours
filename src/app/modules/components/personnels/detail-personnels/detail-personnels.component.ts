import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPersonnel } from 'src/app/modele/personnel';
import { PersonnelsService } from 'src/app/services/personnels/personnels.service';

@Component({
  selector: 'app-detail-personnels',
  templateUrl: './detail-personnels.component.html',
  styleUrls: ['./detail-personnels.component.css'],
})
export class DetailPersonnelsComponent {
  personnel: IPersonnel | undefined;

  constructor(
    private route: ActivatedRoute,
    private personnelService: PersonnelsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idPersonnel = params.get('idPersonnel');
      if (idPersonnel) {
        this.loadPersonnelDetails(idPersonnel);
      }
    });
  }

  loadPersonnelDetails(idPersonnel: string): void {
    this.personnelService
      .getPersonnelById(idPersonnel)
      .subscribe((personnel) => {
        this.personnel = personnel;
      });
  }
}
