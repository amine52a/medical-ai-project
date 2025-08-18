import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  imports: [HeaderComponent]
})
export class AboutComponent implements OnInit {

  departments = [
    {
      icon: 'img/icon/feature_2.svg',
      title: 'Emergency Care',
      description: 'Our 24/7 emergency department provides immediate medical attention with state-of-the-art equipment and experienced medical professionals.'
    },
    {
      icon: 'img/icon/feature_2.svg',
      title: 'Specialized Surgery',
      description: 'Advanced surgical procedures performed by board-certified surgeons using minimally invasive techniques for faster recovery.'
    },
    {
      icon: 'img/icon/feature_2.svg',
      title: 'Pediatric Care',
      description: 'Comprehensive healthcare services for children from infancy through adolescence with child-friendly facilities and specialized staff.'
    },
    {
      icon: 'img/icon/feature_2.svg',
      title: 'Cardiology',
      description: 'Complete cardiovascular care including diagnosis, treatment, and prevention of heart diseases with advanced cardiac technologies.'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}