import { Observable, fromEvent } from 'rxjs';

export interface CanvasObservables {
  onMouseDown$: Observable<MouseEvent>;
  onTouchStart$: Observable<TouchEvent>;
  onMouseUp$: Observable<MouseEvent>;
  onTouchEnd$: Observable<TouchEvent>;
  onMouseMove$: Observable<MouseEvent>;
  onTouchMove$: Observable<TouchEvent>;
  onWindowResize$: Observable<Event>;
  onWindowScroll$: Observable<Event>;
  onCanvasResize$: Observable<Event>;
}

export function getCanvasObservables(el: HTMLCanvasElement): CanvasObservables {
  return {
    onMouseDown$: fromEvent<MouseEvent>(el, 'mousedown'),
    onTouchStart$: fromEvent<TouchEvent>(el, 'touchstart'),
    onMouseUp$: fromEvent<MouseEvent>(el, 'mouseup'),
    onTouchEnd$: fromEvent<TouchEvent>(el, 'touchend'),
    onMouseMove$: fromEvent<MouseEvent>(el, 'mousemove'),
    onTouchMove$: fromEvent<TouchEvent>(el, 'touchmove'),
    onWindowResize$: fromEvent(window, 'resize'),
    onWindowScroll$: fromEvent(window, 'scroll'),
    onCanvasResize$: fromEvent(el, 'resize'),
  };
}
