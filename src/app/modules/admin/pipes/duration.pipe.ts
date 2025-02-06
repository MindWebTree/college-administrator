// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'duration',
//   standalone: true,
// })
// export class DurationPipe implements PipeTransform {
//   transform(minutes: number): string {
//     if (!minutes && minutes !== 0) return '';

//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
    
//     return hours > 0 ? `${hours}:${mins.toString().padStart(2, '0')}` : `0:${mins}`;
//   }
// }
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true,
})
export class DurationPipe implements PipeTransform {
  transform(seconds: number): string {
    if (!seconds && seconds !== 0) return '';

    const totalMinutes = Math.floor(seconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    return hours > 0 ? `${hours}:${mins.toString().padStart(2, '0')}` : `0:${mins.toString().padStart(2, '0')}`;
  }
}
