import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {

  private addZeros(dateNumber: string): string {
    if(dateNumber.length === 1) {
      return '0' + dateNumber;
    }
    else return dateNumber;
  }

  transform(value: Date, ...args: number[]): unknown {
    // TODO 1
    let newDate = new Date(value).toLocaleDateString();
    const sepDate = newDate.split("/");
    const correctMonth = this.addZeros(sepDate[0]);
    const correctDay = this.addZeros(sepDate[1]);
    switch (args[0]) {
      case 1:
        return correctDay + correctMonth + sepDate[2];
      case 2:
        return correctDay + ' / ' + correctMonth + ' / ' + sepDate[2];
      case 3:
        return correctDay + '/' + correctMonth + '/' + sepDate[2];
      case 4:
        return sepDate[2] + '-' + correctMonth + '-' + correctDay;
      default:
        return null;
    }
  }
}
