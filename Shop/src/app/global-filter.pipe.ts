import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'globalFilter'
})
export class GlobalFilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
