import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Observable, Subscription, fromEvent } from 'rxjs';

const MAX_ZOOM = 5;
const MIN_ZOOM = 0.1;
const SCROLL_SENSITIVITY = 0.0005;

@Component({
  selector: 'app-board-canvas',
  templateUrl: './board-canvas.component.html',
  styleUrls: ['./board-canvas.component.scss'],
})
export class BoardCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('boardCanvas')
  boardCanvas?: ElementRef<HTMLCanvasElement>;
  boardCanvasContext?: CanvasRenderingContext2D;

  onMouseDown$?: Observable<MouseEvent>;
  onTouchStart$?: Observable<TouchEvent>;
  onMouseUp$?: Observable<MouseEvent>;
  onTouchEnd$?: Observable<TouchEvent>;
  onMouseMove$?: Observable<MouseEvent>;
  onTouchMove$?: Observable<TouchEvent>;
  onWheel$?: Observable<WheelEvent>;

  onWindowResize$?: Observable<Event>;
  onWindowScroll$?: Observable<Event>;
  onCanvasResize$?: Observable<Event>;

  cameraOffset = { x: 0, y: 0 };
  canvasOffset = { x: 0, y: 0 };
  cameraZoom = 1;

  isDragging = false;
  dragStart = { x: 0, y: 0 };

  initialPinchDistance?: number;
  lastZoom = this.cameraZoom;

  private subscriptions = new Subscription();

  ngAfterViewInit(): void {
    this.boardCanvasContext =
      this.boardCanvas?.nativeElement.getContext('2d') ?? undefined;

    if (!this.boardCanvasContext || !this.boardCanvas) {
      return;
    }

    this.calculateCanvasOffset();

    // set initial camera offset to the centre of the canvas
    // this.cameraOffset = {
    //   x: this.boardCanvas.nativeElement.width / 2,
    //   y: this.boardCanvas.nativeElement.height / 2,
    // };

    this.registerEventListeners(this.boardCanvas.nativeElement);
    this.registerSubscriptions();

    this.draw();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  draw() {
    if (!this.boardCanvasContext || !this.boardCanvas) {
      return;
    }

    const rect = this.boardCanvas.nativeElement.getBoundingClientRect();
    this.boardCanvas.nativeElement.width = rect.width;
    this.boardCanvas.nativeElement.height = rect.height;

    const width = this.boardCanvas.nativeElement.width;
    const height = this.boardCanvas.nativeElement.height;

    // Translate to the canvas centre before zooming - so you'll always zoom on what you're looking directly at
    // this.boardCanvasContext.translate(width / 2, height / 2);
    // this.boardCanvasContext.scale(this.cameraZoom, this.cameraZoom);
    // this.boardCanvasContext.translate(
    //   -width / 2 + this.cameraOffset.x,
    //   -height / 2 + this.cameraOffset.y
    // );

    // Store the current transformation matrix
    this.boardCanvasContext.save();

    // Use the identity matrix while clearing the canvas
    this.boardCanvasContext.setTransform(1, 0, 0, 1, 0, 0);
    this.boardCanvasContext.clearRect(0, 0, width, height);

    // Restore the transform
    this.boardCanvasContext.restore();

    // translate to the camera offset
    this.boardCanvasContext.translate(width / 2, height / 2);
    this.boardCanvasContext.translate(this.cameraOffset.x, this.cameraOffset.y);
    this.boardCanvasContext.scale(this.cameraZoom, this.cameraZoom);

    // draw a rectangle
    this.boardCanvasContext.fillStyle = 'green';
    this.boardCanvasContext.fillRect(20, 20, 100, 100);

    // draw a red circle
    this.boardCanvasContext?.beginPath();
    this.boardCanvasContext?.arc(0, -20, 50, 0, Math.PI * 2, true);
    this.boardCanvasContext?.closePath();
    this.boardCanvasContext.fillStyle = 'red';
    this.boardCanvasContext?.fill();

    requestAnimationFrame(() => this.draw());
  }

  reset() {
    this.cameraOffset = { x: 0, y: 0 };
    this.cameraZoom = 1;
  }

  // Gets the relevant location from a mouse or single touch event
  getEventLocation(e: MouseEvent | TouchEvent) {
    const offset = this.canvasOffset;

    if (e instanceof MouseEvent) {
      return { x: e.clientX - offset.x, y: e.clientY - offset.y };
    } else if (e instanceof TouchEvent && e.touches.length == 1) {
      return {
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      };
    }

    return undefined;
  }

  onPointerDown(e: MouseEvent | TouchEvent) {
    console.log('onPointerDown');
    this.isDragging = true;
    const location = this.getEventLocation(e);
    if (!location) return;

    this.dragStart.x = location.x / this.cameraZoom - this.cameraOffset.x;
    this.dragStart.y = location.y / this.cameraZoom - this.cameraOffset.y;
  }

  onPointerUp(e: MouseEvent | TouchEvent) {
    this.isDragging = false;
    this.initialPinchDistance = undefined;
    this.lastZoom = this.cameraZoom;
  }

  onPointerMove(e: MouseEvent | TouchEvent) {
    if (this.isDragging) {
      const location = this.getEventLocation(e);
      if (!location) return;

      this.cameraOffset.x = location.x / this.cameraZoom - this.dragStart.x;
      this.cameraOffset.y = location.y / this.cameraZoom - this.dragStart.y;
    }
  }

  handleTouch(e: TouchEvent, singleTouchHandler: (e: TouchEvent) => void) {
    if (e.touches.length == 1) {
      singleTouchHandler(e);
    } else if (e.type == 'touchmove' && e.touches.length == 2) {
      this.isDragging = false;
      this.handlePinch(e);
    }
  }

  handlePinch(e: TouchEvent) {
    e.preventDefault();

    let touch1 = {
      x: e.touches[0].clientX - this.canvasOffset.x,
      y: e.touches[0].clientY - this.canvasOffset.y,
    };
    let touch2 = {
      x: e.touches[1].clientX - this.canvasOffset.x,
      y: e.touches[1].clientY - this.canvasOffset.y,
    };

    // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
    let currentDistance =
      (touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2;

    if (this.initialPinchDistance == null) {
      this.initialPinchDistance = currentDistance;
    } else {
      this.adjustZoom(undefined, currentDistance / this.initialPinchDistance);
    }
  }

  adjustZoom(zoomAmount?: number, zoomFactor?: number) {
    if (!this.isDragging) {
      if (zoomAmount) {
        this.cameraZoom += zoomAmount;
      } else if (zoomFactor) {
        console.log(zoomFactor);
        this.cameraZoom = zoomFactor * this.lastZoom;
      }

      this.cameraZoom = Math.min(this.cameraZoom, MAX_ZOOM);
      this.cameraZoom = Math.max(this.cameraZoom, MIN_ZOOM);

      console.log(this.cameraZoom);
    }
  }

  private calculateCanvasOffset() {
    const rect = this.boardCanvas?.nativeElement.getBoundingClientRect();
    if (!rect) return;

    this.canvasOffset = {
      x: rect.left,
      y: rect.top,
    };
  }

  private registerEventListeners(el: HTMLCanvasElement) {
    this.onMouseDown$ = fromEvent<MouseEvent>(el, 'mousedown');
    this.onTouchStart$ = fromEvent<TouchEvent>(el, 'touchstart');
    this.onMouseUp$ = fromEvent<MouseEvent>(el, 'mouseup');
    this.onTouchEnd$ = fromEvent<TouchEvent>(el, 'touchend');
    this.onMouseMove$ = fromEvent<MouseEvent>(el, 'mousemove');
    this.onTouchMove$ = fromEvent<TouchEvent>(el, 'touchmove');
    this.onWheel$ = fromEvent<WheelEvent>(el, 'wheel');
    this.onWindowResize$ = fromEvent(window, 'resize');
    this.onWindowScroll$ = fromEvent(window, 'scroll');
    this.onCanvasResize$ = fromEvent(el, 'resize');
  }

  private registerSubscriptions() {
    this.subscriptions.add(
      this.onMouseDown$?.subscribe(e => this.onPointerDown(e))
    );
    this.subscriptions.add(
      this.onTouchStart$?.subscribe(e =>
        this.handleTouch(e, this.onPointerDown)
      )
    );
    this.subscriptions.add(
      this.onMouseUp$?.subscribe(e => this.onPointerUp(e))
    );
    this.subscriptions.add(
      this.onTouchEnd$?.subscribe(e => this.handleTouch(e, this.onPointerUp))
    );
    this.subscriptions.add(
      this.onMouseMove$?.subscribe(e => this.onPointerMove(e))
    );
    this.subscriptions.add(
      this.onTouchMove$?.subscribe(e => this.handleTouch(e, this.onPointerMove))
    );
    this.subscriptions.add(
      this.onWheel$?.subscribe(e =>
        this.adjustZoom(-e.deltaY * SCROLL_SENSITIVITY)
      )
    );
    this.subscriptions.add(
      this.onWindowResize$?.subscribe(e => this.calculateCanvasOffset())
    );
    this.subscriptions.add(
      this.onWindowScroll$?.subscribe(e => this.calculateCanvasOffset())
    );
    this.subscriptions.add(
      this.onCanvasResize$?.subscribe(e => this.calculateCanvasOffset())
    );
  }
}
