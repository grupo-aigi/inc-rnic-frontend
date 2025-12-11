import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ToastrService } from 'ngx-toastr';

import { ContentTarget } from '../../../../../../../../../../../../services/shared/contents/contents.interfaces';
import { LangService } from '../../../../../../../../../../../../services/shared/lang/lang.service';
import { ScientificEcosystemDetailContact } from '../../../../../../../../../../../../services/landing/scientific-ecosystem/scientific-ecosystem.interfaces';
import labels from './app-set-scientific-ecosystem-contact.lang';

@Component({
  standalone: true,
  selector: 'app-set-scientific-ecosystem-contact',
  templateUrl: './app-set-scientific-ecosystem-contact.component.html',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
})
export class SetScientificEcosystemContactComponent {
  @Input() public target!: ContentTarget;
  @Output()
  public onFormChange: EventEmitter<ScientificEcosystemDetailContact> =
    new EventEmitter();

  public contacts: ScientificEcosystemDetailContact['contacts'] = [];
  public editingIndex: number = -1;

  public formGroup = this.formBuilder.group({
    name: ['', Validators.required],
    role: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  public constructor(
    private formBuilder: FormBuilder,
    private langService: LangService,
    private toastService: ToastrService,
  ) {}

  public get lang() {
    return this.langService.language;
  }

  public get labels() {
    return labels;
  }

  public handleAddContact() {
    if (this.formGroup.invalid) {
      this.toastService.error('El formulario contiene campos inválidos');
      return;
    }

    const { name, role, email } = this.formGroup.value;

    if (this.editingIndex >= 0) {
      // Editar contacto existente
      this.contacts[this.editingIndex] = {
        name: name!,
        role: role!,
        email: email!,
      };
      this.toastService.success('Contacto actualizado correctamente');
      this.editingIndex = -1;
    } else {
      this.contacts.push({
        name: name!,
        role: role!,
        email: email!,
      });
      this.toastService.success('Contacto agregado correctamente');
    }
    this.onFormChange.emit({ TYPE: 'CONTACTO', contacts: this.contacts });

    this.formGroup.reset();
  }

  public handleEditContact(index: number) {
    const contact = this.contacts[index];
    this.editingIndex = index;

    this.formGroup.patchValue({
      name: contact.name,
      role: contact.role,
      email: contact.email,
    });

    this.toastService.info('Editando contacto');
  }

  public handleDeleteContact(index: number) {
    if (confirm('¿Está seguro de eliminar este contacto?')) {
      this.contacts.splice(index, 1);
      this.onFormChange.emit({
        TYPE: 'CONTACTO',
        contacts: this.contacts,
      });

      this.toastService.success('Contacto eliminado');

      if (this.editingIndex === index) {
        this.cancelEdit();
      }
    }
  }

  public cancelEdit() {
    this.editingIndex = -1;
    this.formGroup.reset();
  }

  handleReset() {
    this.contacts = [];
    this.editingIndex = -1;
    this.formGroup.reset();
  }
}
