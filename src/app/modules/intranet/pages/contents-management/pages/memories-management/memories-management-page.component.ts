
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';

import { MemoryInfo } from '../../../../../../services/landing/memories/memories.interfaces';
import { MemoriesService } from '../../../../../../services/landing/memories/memories.service';
import { LangService } from '../../../../../../services/shared/lang/lang.service';
import { CreateMemoryComponent } from './components/create-memory/create-memory.component';
import { ListMemoriesComponent } from './components/list-memories/list-memories.component';
import labels from './memories-management.lang';

@Component({
  standalone: true,
  templateUrl: './memories-management-page.component.html',
  imports: [ListMemoriesComponent, CreateMemoryComponent],
})
export class MemoriesManagementPage implements OnInit {
  public activeTabIndex: number = 0;
  @ViewChild('memoriesLI')
  public memoriesLI!: ElementRef<HTMLLIElement>;
  public memoryToEdit: MemoryInfo | undefined;

  public constructor(
    private title: Title,
    private memoryService: MemoriesService,
    private langService: LangService,
    private toastService: ToastrService,
  ) {}

  public ngOnInit(): void {
    this.title.setTitle(labels.pageTitle[this.lang]);
    this.langService.language$.subscribe((lang) => {
      this.title.setTitle(labels.pageTitle[lang]);
    });
  }

  public get labels() {
    return labels;
  }

  public get lang() {
    return this.langService.language;
  }

  public changeActiveTab(index: number): void {
    if (index === 0 && this.memoryToEdit) {
      this.memoryToEdit = undefined;
    }
    this.activeTabIndex = index;
  }

  public handleEditMemory(memory: MemoryInfo) {
    this.memoryToEdit = memory;
    this.changeActiveTab(1);
  }

  public submitMemory(memory: MemoryInfo) {
    if (this.memoryToEdit) {
      return this.memoryService.updateMemory(memory).subscribe({
        next: (value) => {
          this.toastService.success(
            labels.memoryUpdatedSuccessfully[this.lang],
          );
          this.memoriesLI.nativeElement.click();
          this.activeTabIndex = 0;
          this.memoryToEdit = undefined;
        },
        error: (_err) => {
          this.toastService.error(
            this.labels.errorUpdatingMemory[this.lang],
            'Error',
          );
        },
      });
    }
    return this.memoryService.createMemory(memory).subscribe({
      next: (value) => {
        this.toastService.success(labels.memoryCreatedSuccessfully[this.lang]);
        this.memoriesLI.nativeElement.click();
        this.activeTabIndex = 0;
      },
      error: (_err) => {
        this.toastService.error(
          this.labels.errorCreatingMemory[this.lang],
          'Error',
        );
      },
    });
  }
}
