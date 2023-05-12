import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { TileResponse } from '@common/events';
import { Observable, Subscription, fromEvent, of, switchMap } from 'rxjs';
import { Memoized } from 'src/app/common/decorators';
import { observeProperty } from 'src/app/common/observable/observe-property';
import { Loadable, filterMapSuccess } from 'src/app/common/operators/loadable';
import { notNullOrUndefined } from 'src/app/common/operators/not-undefined';
import { Response } from '@common/responses';
import { BoardService } from '../board/board.service';

const MAX_ZOOM = 5;
const MIN_ZOOM = 0.1;
const SCROLL_SENSITIVITY = 0.0005;

@Component({
  selector: 'app-board-canvas',
  templateUrl: './board-canvas.component.html',
  styleUrls: ['./board-canvas.component.scss'],
})
export class BoardCanvasComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly boardService = inject(BoardService);

  tiles$ = this.boardService.tiles$.pipe(filterMapSuccess(x => x.value));
  resetCanvas$ = this.boardService.resetCanvas$;

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
  canvasSize = { width: 0, height: 0 };

  isPanning = false;
  panStart = { x: 0, y: 0 };

  isGrabbing = false;
  grabLocation = { x: 0, y: 0 };
  grabbedObjectIndex?: number;

  initialPinchDistance?: number;

  objects: TileResponse[] = [];

  private subscriptions = new Subscription();

  ngOnInit(): void {
    this.subscriptions.add(
      this.tiles$.subscribe(objects => {
        console.log('objects', objects);
        this.objects = objects.data;
      })
    );

    this.subscriptions.add(
      this.resetCanvas$.subscribe(() => {
        this.reset();
      })
    );
  }

  ngAfterViewInit(): void {
    this.boardCanvasContext =
      this.boardCanvas?.nativeElement.getContext('2d') ?? undefined;

    if (!this.boardCanvasContext || !this.boardCanvas) {
      return;
    }

    this.calculateCanvasOffset(true);

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

    this.calculateCanvasOffset();

    // Store the current transformation matrix
    this.boardCanvasContext.save();

    // Use the identity matrix while clearing the canvas
    this.boardCanvasContext.setTransform(1, 0, 0, 1, 0, 0);
    this.boardCanvasContext.clearRect(
      0,
      0,
      this.canvasSize.width,
      this.canvasSize.height
    );

    // Restore the transform
    this.boardCanvasContext.restore();

    // translate to the centre of the canvas for zooming
    this.boardCanvasContext.translate(
      this.canvasSize.width / 2,
      this.canvasSize.height / 2
    );
    this.boardCanvasContext.translate(
      -this.canvasSize.width / 2 + this.cameraOffset.x,
      -this.canvasSize.height / 2 + this.cameraOffset.y
    ); // translate back to the top left

    // draw a rectangle
    this.boardCanvasContext.fillStyle = 'green';
    this.boardCanvasContext.fillRect(20, 20, 100, 100);

    // draw a red circle
    this.boardCanvasContext?.beginPath();
    this.boardCanvasContext?.arc(0, -20, 50, 0, Math.PI * 2, true);
    this.boardCanvasContext?.closePath();
    this.boardCanvasContext.fillStyle = 'red';
    this.boardCanvasContext?.fill();

    if (this.grabLocation) {
      this.boardCanvasContext.fillStyle = 'blue';
      this.boardCanvasContext.fillRect(
        this.grabLocation.x - 5,
        this.grabLocation.y - 5,
        10,
        10
      );
    }

    // draw objects
    this.drawObjects();

    requestAnimationFrame(() => this.draw());
  }

  drawObjects() {
    if (!this.boardCanvasContext) {
      return;
    }

    for (const object of this.objects) {
      this.boardCanvasContext.fillStyle = object.fillColor;
      this.boardCanvasContext.fillRect(object.x, object.y, 100, 100);
    }
  }

  reset() {
    this.calculateCanvasOffset(true);
  }

  // Gets the relevant location from a mouse or single touch event
  getEventOnCameraLocation(e: MouseEvent | TouchEvent) {
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

  cameraToCanvasLocation(location: { x: number; y: number }) {
    return {
      x: location.x - this.cameraOffset.x,
      y: location.y - this.cameraOffset.y,
    };
  }

  onPointerDown(e: MouseEvent | TouchEvent) {
    // set panning if middle click
    if (e instanceof MouseEvent && e.button == 1) {
      this.isPanning = true;
      const location = this.getEventOnCameraLocation(e);
      if (!location) return;

      const { x, y } = this.cameraToCanvasLocation(location);

      this.panStart.x = x;
      this.panStart.y = y;
    }

    // grab object if left click
    if (e instanceof MouseEvent && e.button == 0) {
      // get location
      const eventLocation = this.getEventOnCameraLocation(e);
      if (!eventLocation) return;

      const location = this.cameraToCanvasLocation(eventLocation);

      // check if we are grabbing an object
      const grabbedObject = this.objects.findIndex(
        object =>
          location.x >= object.x &&
          location.x <= object.x + 100 &&
          location.y >= object.y &&
          location.y <= object.y + 100
      );

      if (grabbedObject > -1) {
        this.isGrabbing = true;
        this.grabbedObjectIndex = grabbedObject;
        this.grabLocation.x = location.x;
        this.grabLocation.y = location.y;
        this.boardService.setSelectedTileId(this.objects[grabbedObject].id);
      } else {
        this.boardService.setSelectedTileId(null);
      }
    }
  }

  onPointerUp(e: MouseEvent | TouchEvent) {
    if (this.isGrabbing && this.grabbedObjectIndex !== undefined) {
      const object = this.objects[this.grabbedObjectIndex];
      // update it's new location
      this.boardService.updateTilePosition(object.id, object.x, object.y);
    }

    this.isPanning = false;
    this.isGrabbing = false;
    this.initialPinchDistance = undefined;
    this.grabbedObjectIndex = undefined;
  }

  onPointerMove(e: MouseEvent | TouchEvent) {
    if (this.isPanning) {
      const location = this.getEventOnCameraLocation(e);
      if (!location) return;

      this.cameraOffset.x = location.x - this.panStart.x;
      this.cameraOffset.y = location.y - this.panStart.y;
    }

    if (this.isGrabbing && this.grabbedObjectIndex !== undefined) {
      const location = this.getEventOnCameraLocation(e);
      if (!location) return;

      location.x = location.x - this.cameraOffset.x;
      location.y = location.y - this.cameraOffset.y;

      this.objects[this.grabbedObjectIndex].x +=
        location.x - this.grabLocation.x;
      this.objects[this.grabbedObjectIndex].y +=
        location.y - this.grabLocation.y;

      this.grabLocation.x = location.x;
      this.grabLocation.y = location.y;
    }
  }

  handleTouch(e: TouchEvent, singleTouchHandler: (e: TouchEvent) => void) {
    if (e.touches.length == 1) {
      singleTouchHandler(e);
    } else if (e.type == 'touchmove' && e.touches.length == 2) {
      this.isPanning = false;
    }
  }

  private calculateCanvasOffset(resetZoom: boolean = false) {
    const rect = this.boardCanvas?.nativeElement.getBoundingClientRect();
    if (!rect) return;

    this.canvasSize.width = rect.width;
    this.canvasSize.height = rect.height;

    if (this.boardCanvas) {
      this.boardCanvas.nativeElement.width = this.canvasSize.width;
      this.boardCanvas.nativeElement.height = this.canvasSize.height;
    }

    if (resetZoom) {
      this.cameraOffset.x = this.canvasSize.width / 2;
      this.cameraOffset.y = this.canvasSize.height / 2;
    }

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
      this.onWindowResize$?.subscribe(e => this.calculateCanvasOffset())
    );
    this.subscriptions.add(
      this.onWindowScroll$?.subscribe(e => this.calculateCanvasOffset())
    );
    this.subscriptions.add(
      this.onCanvasResize$?.subscribe(e => this.calculateCanvasOffset())
    );

    if (this.boardCanvas) {
      this.subscriptions.add(
        fromEvent(this.boardCanvas.nativeElement, 'contextmenu').subscribe(e =>
          e.preventDefault()
        )
      );
    }
  }
}
