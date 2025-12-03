import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { LangService } from '../../../../../services/shared/lang/lang.service';
import labels from './complete-pagination.lang';

@Component({
  standalone: true,
  selector: 'app-complete-pagination',
  templateUrl: './complete-pagination.component.html',
  imports: [CommonModule],
})
export class CompletePaginationComponent {
  @Input() public totalElements!: number;
  @Input() public pageSize!: number;
  @Input() public currentPage!: number;
  @Input() public showTotalRecords!: boolean;
  @Input() public showNoResults: boolean = true;

  @Output() public onPageChange: EventEmitter<number> = new EventEmitter();

  public constructor(
    private langService: LangService,
    private toastService: ToastrService,
  ) {}

  public get lang() {
    return this.langService.language;
  }
  public get labels() {
    return labels;
  }

  public get totalPages() {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  public handleGoToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    if (page === this.currentPage) return;
    this.onPageChange.emit(page);
  }

  public handleNextPage() {
    if (this.currentPage + 1 >= this.totalPages) return;
    this.onPageChange.emit(this.currentPage + 1);
  }

  public handlePreviousPage() {
    if (this.currentPage - 1 <= 1) return;
    this.onPageChange.emit(this.currentPage - 1);
  }
}
