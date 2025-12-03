import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { ToastrModule, ToastrService } from 'ngx-toastr';

import { RegisterService } from '../../../../services/auth/register.service';
import { LangService } from '../../../../services/shared/lang/lang.service';
import labels from './preregister-agreements-page.lang';

@Component({
  templateUrl: './preregister-agreements-page.component.html',
  styleUrls: ['./preregister-agreements-page.component.scss'],
  standalone: true,
  imports: [CommonModule, ToastrModule],
})
export class PreregisterAgreementsPage implements OnInit {
  public acceptAgreements: boolean | null = null;

  public constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private registerService: RegisterService,
    private langService: LangService,
    private title: Title,
    private toastService: ToastrService,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(labels.pageTitle[this.langService.language]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(labels.pageTitle[lang]);
    });

    const charsetMeta = this.renderer.createElement('meta');
    this.renderer.setAttribute(charsetMeta, 'charset', 'utf-8');

    const generatorMeta = this.renderer.createElement('meta');
    this.renderer.setAttribute(generatorMeta, 'name', 'generator');
    this.renderer.setAttribute(generatorMeta, 'content', 'pdf2htmlEX');

    const compatibilityMeta = this.renderer.createElement('meta');
    this.renderer.setAttribute(
      compatibilityMeta,
      'http-equiv',
      'X-UA-Compatible',
    );
    this.renderer.setAttribute(
      compatibilityMeta,
      'content',
      'IE=edge,chrome=1',
    );

    const headElement = this.elementRef.nativeElement.ownerDocument.head;
    this.renderer.appendChild(headElement, charsetMeta);
    this.renderer.appendChild(headElement, generatorMeta);
    this.renderer.appendChild(headElement, compatibilityMeta);
  }

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleCheckTermsAndConditions(event: Event) {
    const element = event.target as HTMLInputElement;
    this.acceptAgreements = element.checked;
  }

  public handleContinue(event: MouseEvent) {
    event.preventDefault();
    if (this.acceptAgreements === null) {
      this.acceptAgreements = false;
      return;
    }
    if (this.acceptAgreements === false) {
      this.toastService.warning(this.labels.noAcceptedTerms[this.lang]);
      return;
    }
    this.registerService.acceptedAgreements = true;
    this.router.navigate(['/auth/register']);
  }
}
