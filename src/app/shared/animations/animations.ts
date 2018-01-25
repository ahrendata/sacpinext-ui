import { animate, group, keyframes, state, style, transition, trigger } from '@angular/animations';

export const showStateTrigger = trigger('showState', [
  transition(':enter', [
    style({
      opacity: 0
    }),
    animate('300ms ease-out')
  ]),
  transition(':leave', animate('300ms ease-in', style({
    opacity: 0
  })))
]);
