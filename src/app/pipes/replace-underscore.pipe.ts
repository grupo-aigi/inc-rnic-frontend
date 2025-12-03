import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceUnderscores',
  standalone: true,
})
export class ReplaceUnderscoresPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return value;
    }
    return value.replace(/_/g, ' ');
  }
}
