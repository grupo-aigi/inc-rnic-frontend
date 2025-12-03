import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import {
  NavigationCancel,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';

import { ToastrModule } from 'ngx-toastr';
import { filter } from 'rxjs';

import { AuthService } from './services/auth/auth.service';
import { ThemeService } from './services/shared/theme/theme.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, ToastrModule],
  templateUrl: './app.component.html',
  providers: [
    Location,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
  ],
})
export class AppComponent implements OnInit {
  public location: any;
  public routerSubscription: any;
  public apiLoaded = false;

  public constructor(
    private router: Router,
    public authService: AuthService,
    private themeService: ThemeService,
  ) {}

  public ngOnInit(): void {
    this.authService.refreshAuth().subscribe({
      error: (error) => {
        this.authService.logout();
      },
    });

    this.recallJsFunctions();

    if (!this.apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }
  }

  public get currentTheme() {
    return this.themeService.currentTheme;
  }

  private recallJsFunctions(): void {
    this.routerSubscription = this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationEnd || event instanceof NavigationCancel,
        ),
      )
      .subscribe((event) => {
        this.location = this.router.url;
        if (!(event instanceof NavigationEnd)) {
          return;
        }

        // window.scrollTo(0, 0);
      });
  }
}
