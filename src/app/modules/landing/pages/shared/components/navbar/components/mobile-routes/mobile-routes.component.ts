
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './mobile-routes.lang';

@Component({
  standalone: true,
  selector: 'app-mobile-routes',
  templateUrl: './mobile-routes.component.html',
  imports: [RouterLink, RouterLinkActive],
})
export class MobileRoutesComponent {
  @Output() public onNavigate: EventEmitter<void> = new EventEmitter<void>();
  public activeSection: 'ABOUT' | 'MEMBERS' | 'OTHERS' | '' = '';
  public constructor(private langService: LangService) {}

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleCloseTopBar() {
    this.onNavigate.emit();
  }

  public handleSetActiveSection(activeSection: 'ABOUT' | 'MEMBERS' | 'OTHERS') {
    if (this.activeSection === activeSection) {
      this.activeSection = '';
      return;
    }
    this.activeSection = activeSection;
  }
}
