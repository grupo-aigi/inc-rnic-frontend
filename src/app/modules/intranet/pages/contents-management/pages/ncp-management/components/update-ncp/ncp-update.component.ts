import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { NCPInfo } from '../../../../../../../../services/landing/ncp/ncp.interfaces';
import { UploadOrReuseImageComponent } from '../../../../../shared/components/upload-or-reuse-image/upload-or-reuse-image.component';
import { ResourcesService } from '../../../../../../../../services/shared/resources/resource.service';
import { LangService } from '../../../../../../../../services/shared/lang/lang.service';
import labels from './npc-update.lang';

@Component({
  standalone: true,
  selector: 'app-ncp-update',
  templateUrl: './ncp-update.component.html',
  imports: [ReactiveFormsModule, UploadOrReuseImageComponent],
})
export class NCPUpdateComponent implements OnInit {
  @Input() public ncpInfo: NCPInfo | undefined;
  @Input() public ncpImage: string = '';
  @Output() public onPublish: EventEmitter<NCPInfo> = new EventEmitter();

  public paragraphEditMode: { paragraphIndex: number } | undefined = undefined;
  public urlEditMode: { urlIndex: number } | undefined = undefined;
  public paragraphs: string[] = [];
  public allImages: string[] = [];
  public selectedImageIndex: number = -1;
  public links: { url: string; description: string }[] = [];

  public formGroup: FormGroup = this.formBuilder.group({
    id: ['', []],
    title: ['', [Validators.maxLength(300)]],
    subtitle: ['', [Validators.maxLength(300)]],
    paragraph: ['', []],
    videoUrl: [
      'https://www.facebook.com/facebook/videos/1150901328975069/',
      [this.validateUrl, this.validYoutubeLink],
    ],
    email: ['', [Validators.email]],
    urlTitle: ['', [Validators.minLength(3)]],
    url: ['', [this.validateUrl]],
    imageName: ['', []],
  });

  public constructor(
    private formBuilder: FormBuilder,
    private toastService: ToastrService,
    private langService: LangService,
    private resourcesService: ResourcesService,
  ) {}

  public ngOnInit(): void {
    if (!this.ncpInfo) return;
    this.formGroup.get('id')?.setValue(this.ncpInfo.id);
    this.formGroup.get('title')?.setValue(this.ncpInfo.title);
    this.formGroup.get('subtitle')?.setValue(this.ncpInfo.subtitle);
    this.paragraphs = this.ncpInfo.paragraphs;
    this.formGroup
      .get('videoUrl')
      ?.setValue(`https://www.youtube.com/watch?v=${this.ncpInfo.videoUrl}`);
    this.formGroup.get('email')?.setValue(this.ncpInfo.email);
    this.links = this.ncpInfo.links;
    this.formGroup.get('imageName')?.setValue(this.ncpInfo.imageName);
  }

  private validateUrl(control: FormControl): ValidationErrors | null {
    const url = control.value;
    if (url) {
      // Regular expression pattern for valid YouTube URLs
      const urlPattern =
        /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!-)[A-Z0-9-]{1,63}(?<!-)\.?)+[A-Z]{2,6}(?::\d{1,5})?(?:[/?#]\S*)?$/i;

      return urlPattern.test(url) ? null : { invalidUrl: true };
    }
    return null;
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public handleAddParagraph() {
    const paragraphText = this.formGroup.get('paragraph');
    if (!paragraphText?.value) {
      this.toastService.error(
        'Error',
        'Debe ingresar texto en el campo de párrafo',
      );
      return;
    }
    if (this.paragraphEditMode) {
      this.paragraphs[this.paragraphEditMode.paragraphIndex] =
        paragraphText.value;
      this.paragraphEditMode = undefined;
      paragraphText.setValue('');
      return;
    }
    this.paragraphs.push(paragraphText.value);
    paragraphText.setValue('');
  }

  public get imageUrl() {
    return this.resourcesService.getImageUrlByName(
      'ncp',
      this.formGroup.get('imageName')?.value,
    );
  }

  public handleAddUrl() {
    const urlTitle = this.formGroup.get('urlTitle');
    const url = this.formGroup.get('url');
    if (!urlTitle?.value || !url?.value) {
      this.toastService.error(
        'Error',
        'Debe ingresar texto en los textos de título y enlace',
      );
      return;
    }
    if (this.urlEditMode) {
      this.links[this.urlEditMode.urlIndex].url = url.value;
      this.links[this.urlEditMode.urlIndex].description = urlTitle.value;
      this.urlEditMode = undefined;
      url.setValue('');
      urlTitle.setValue('');
      return;
    }
    this.links.push({
      url: url.value,
      description: urlTitle.value,
    });
    url.setValue('');
    urlTitle.setValue('');
  }

  public handleEditParagraph(i: number) {
    this.paragraphEditMode = { paragraphIndex: i };
    this.formGroup.get('paragraph')?.setValue(this.paragraphs[i]);
  }

  public handleEditUrl(i: number) {
    this.urlEditMode = { urlIndex: i };
    this.formGroup.get('url')?.setValue(this.links[i].url);
    this.formGroup.get('urlTitle')?.setValue(this.links[i].description);
  }

  public handleDeleteParagraph(indexToRemove: number) {
    this.paragraphs = this.paragraphs.filter(
      (_element, index) => index !== indexToRemove,
    );
  }

  public handleDeleteUrl(indexToRemove: number) {
    this.links = this.links.filter(
      (_element, index) => index !== indexToRemove,
    );
  }

  private validYoutubeLink(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const youtubeRegex =
        /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([^"&?\n\s]{11})$/;

      if (!youtubeRegex.test(control.value)) {
        return { invalidYoutubeLink: true };
      }

      // If the value matches the regex, consider it as valid
      return null;
    };
  }

  public extractVideoId(videoLink: string): string {
    if (!videoLink) return '';
    // Use a regular expression to extract the video ID from the link
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = videoLink.match(regex);
    return match ? match[1] : '';
  }

  public handleSubmit() {
    if (this.formGroup.invalid) {
      this.toastService.error(
        'Error',
        'El formulario contiene campos inválidos',
      );
      this.formGroup.markAllAsTouched();
      return;
    }
    const ncpInfo: NCPInfo = {
      id: this.formGroup.get('id')?.value,
      title: this.formGroup.get('title')?.value,
      subtitle: this.formGroup.get('subtitle')?.value,
      paragraphs: this.paragraphs,
      videoUrl: this.extractVideoId(
        this.formGroup.get('videoUrl')?.value || '',
      ),
      email: this.formGroup.get('email')?.value,
      links: this.links,
      imageName: this.formGroup.get('imageName')?.value,
      updatedAt: new Date(),
    };

    this.onPublish.emit(ncpInfo);
    // this.formGroup.reset();

    // this.paragraphs = [];
    // this.links = [];
  }

  public handleSetNCPImage(selectedImage: string) {
    this.formGroup.get('imageName')?.setValue(selectedImage);
  }

  public isFieldInvalid(fieldName: string): any {
    return (
      this.formGroup.get(fieldName)?.errors &&
      this.formGroup.get(fieldName)?.touched
    );
  }

  public handleCleanFields(event: MouseEvent) {
    event.preventDefault();
    this.formGroup.reset();
    this.paragraphs = [];
    this.links = [];
    this.formGroup.get('imageName')?.reset();
  }
}
