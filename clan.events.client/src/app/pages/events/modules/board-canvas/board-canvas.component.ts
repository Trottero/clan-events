import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Subscription, fromEvent, switchMap } from 'rxjs';
import { BoardService } from '../board/board.service';
import {
  CanvasObservables,
  getCanvasObservables,
} from './board-canvas-observables';
import { BoardRenderer } from '../board/simple-board-renderer';
import { notNullOrUndefined } from 'src/app/common/operators/not-undefined';

export interface BoardCanvasObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

@Component({
  selector: 'app-board-canvas',
  templateUrl: './board-canvas.component.html',
  styleUrls: ['./board-canvas.component.scss'],
})
export class BoardCanvasComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly boardService = inject(BoardService);
  private readonly boardRenderer$ = this.boardService.boardRenderer$;

  private boardRenderer?: BoardRenderer;

  resetCanvas$ = this.boardService.resetCanvas$;

  @ViewChild('boardCanvas')
  boardCanvas?: ElementRef<HTMLCanvasElement>;
  boardCanvasContext?: CanvasRenderingContext2D;

  private canvasObservables?: CanvasObservables;

  cameraOffset = { x: 0, y: 0 };
  canvasOffset = { x: 0, y: 0 };
  canvasSize = { width: 0, height: 0 };

  isPanning = false;
  panStart = { x: 0, y: 0 };

  isGrabbing = false;
  grabLocation = { x: 0, y: 0 };
  grabbedObjectIndex?: number;
  objects = [] as BoardCanvasObject[];

  initialPinchDistance?: number;

  private subscriptions = new Subscription();

  ngOnInit(): void {
    this.subscriptions.add(
      this.boardRenderer$.subscribe(boardRenderer => {
        this.boardRenderer = boardRenderer;
      })
    );

    this.subscriptions.add(
      this.boardRenderer$
        .pipe(
          notNullOrUndefined(),
          switchMap(boardRenderer => boardRenderer.canvasObjects$)
        )
        .subscribe(objects => {
          this.objects = objects;
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

    this.canvasObservables = getCanvasObservables(
      this.boardCanvas.nativeElement
    );
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

    // render
    this.boardRenderer?.renderBackground(
      this.boardCanvasContext,
      this.cameraOffset
    );
    this.boardRenderer?.render(this.boardCanvasContext);

    requestAnimationFrame(() => this.draw());
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
          location.x <= object.x + object.width &&
          location.y >= object.y &&
          location.y <= object.y + object.height
      );

      if (grabbedObject > -1) {
        this.isGrabbing = true;
        this.grabbedObjectIndex = grabbedObject;
        this.grabLocation.x = location.x;
        this.grabLocation.y = location.y;
        this.boardRenderer?.selectCanvasObject(grabbedObject);
      } else {
        this.boardRenderer?.selectCanvasObject(undefined);
      }
    }
  }

  onPointerUp(e: MouseEvent | TouchEvent) {
    if (this.isGrabbing && this.grabbedObjectIndex !== undefined) {
      const object = this.objects[this.grabbedObjectIndex];
      // update it's new location
      this.boardRenderer?.onGrabEnd(
        this.grabbedObjectIndex,
        object.x,
        object.y
      );
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

      this.boardRenderer?.onGrabMove(
        this.grabbedObjectIndex,
        this.objects[this.grabbedObjectIndex].x,
        this.objects[this.grabbedObjectIndex].y
      );

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

  private registerSubscriptions() {
    if (!this.canvasObservables) return;

    this.subscriptions.add(
      this.canvasObservables.onMouseDown$.subscribe(e => this.onPointerDown(e))
    );
    this.subscriptions.add(
      this.canvasObservables.onTouchStart$.subscribe(e =>
        this.handleTouch(e, this.onPointerDown)
      )
    );
    this.subscriptions.add(
      this.canvasObservables.onMouseUp$.subscribe(e => this.onPointerUp(e))
    );
    this.subscriptions.add(
      this.canvasObservables.onTouchEnd$.subscribe(e =>
        this.handleTouch(e, this.onPointerUp)
      )
    );
    this.subscriptions.add(
      this.canvasObservables.onMouseMove$.subscribe(e => this.onPointerMove(e))
    );
    this.subscriptions.add(
      this.canvasObservables.onTouchMove$.subscribe(e =>
        this.handleTouch(e, this.onPointerMove)
      )
    );
    this.subscriptions.add(
      this.canvasObservables.onWindowResize$.subscribe(e =>
        this.calculateCanvasOffset(true)
      )
    );
    this.subscriptions.add(
      this.canvasObservables.onWindowScroll$.subscribe(e =>
        this.calculateCanvasOffset(true)
      )
    );
    this.subscriptions.add(
      this.canvasObservables.onCanvasResize$.subscribe(e =>
        this.calculateCanvasOffset(true)
      )
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
