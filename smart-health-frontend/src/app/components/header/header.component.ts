import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isMenuCollapsed = true;
  activeLink = 'home';
  logoPath = 'assets/img/logo.png';

  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  setActive(link: string) {
    this.activeLink = link;
    this.isMenuCollapsed = true; // Close menu when a link is clicked (for mobile)
  }
}