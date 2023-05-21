import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Subscription, combineLatest, fromEvent, map, switchMap } from 'rxjs';
import { BoardService } from '../board/board.service';
import {
  CanvasObservables,
  getCanvasObservables,
} from './board-canvas-observables';
import { BoardRenderer } from '../board/renderers/board-renderer';
import { BoardCanvasObject } from '../board/renderers/board-canvas-object';
import { notNullOrUndefined } from 'src/app/core/common/operators/not-undefined';

@Component({
  selector: 'app-board-canvas',
  templateUrl: './board-canvas.component.html',
  styleUrls: ['./board-canvas.component.scss'],
})
export class BoardCanvasComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly boardService = inject(BoardService);
  private readonly boardRenderers$ = this.boardService.renderers$;

  private boardRenderers: BoardRenderer[] = [];

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
  grabbedObj?: { renderer: string; index: number };
  objects: { [key: string]: BoardCanvasObject[] } = {};

  initialPinchDistance?: number;

  private subscriptions = new Subscription();

  ngOnInit(): void {
    this.subscriptions.add(
      this.boardRenderers$.subscribe(boardRenderers => {
        this.boardRenderers = boardRenderers;
      })
    );

    this.subscriptions.add(
      this.boardRenderers$
        .pipe(
          notNullOrUndefined(),
          switchMap(boardRenderers =>
            combineLatest(
              boardRenderers.map(x =>
                x.canvasObjects$.pipe(map(objects => ({ [x.name]: objects })))
              )
            )
          )
        )
        .subscribe(objects => {
          this.objects = objects.reduce(
            (prev, curr) => ({ ...prev, ...curr }),
            {}
          );
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

  reset() {
    this.calculateCanvasOffset(true);
  }

  private draw() {
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
    Object.values(this.boardRenderers).forEach(boardRenderer => {
      boardRenderer.render(this.boardCanvasContext!, this.cameraOffset);
    });

    requestAnimationFrame(() => this.draw());
  }

  // Gets the relevant location from a mouse or single touch event
  private getEventOnCameraLocation(e: MouseEvent | TouchEvent) {
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

  private cameraToCanvasLocation(location: { x: number; y: number }) {
    return {
      x: location.x - this.cameraOffset.x,
      y: location.y - this.cameraOffset.y,
    };
  }

  private onPointerDown(e: MouseEvent | TouchEvent) {
    // set panning if middle click
    this.handlePan(e);

    // grab object if left click
    this.handleGrab(e);
  }

  private handlePan(e: MouseEvent | TouchEvent) {
    if (e instanceof MouseEvent && e.button == 1) {
      this.isPanning = true;
      const location = this.getEventOnCameraLocation(e);
      if (!location) return;

      const { x, y } = this.cameraToCanvasLocation(location);

      this.panStart.x = x;
      this.panStart.y = y;
    }
  }

  private handleGrab(e: MouseEvent | TouchEvent) {
    if (e instanceof MouseEvent && e.button == 0) {
      if (!this.boardRenderers) return;

      // get location
      const eventLocation = this.getEventOnCameraLocation(e);
      if (!eventLocation) return;

      const location = this.cameraToCanvasLocation(eventLocation);

      // check if we are grabbing an object in any of the renderers
      const grabbedObject = Object.values(this.boardRenderers).reduce(
        (prev, curr) =>
          prev.index > -1
            ? prev
            : {
                renderer: curr.name,
                index: this.objects[curr.name].findIndex(
                  object =>
                    location.x >= object.x &&
                    location.x <= object.x + object.width &&
                    location.y >= object.y &&
                    location.y <= object.y + object.height
                ),
              },
        { renderer: '', index: -1 }
      );

      if (grabbedObject.index > -1) {
        this.isGrabbing = true;
        this.grabbedObj = grabbedObject;
        this.grabLocation.x = location.x;
        this.grabLocation.y = location.y;

        this.getBoardRenderer(grabbedObject.renderer)?.selectCanvasObject(
          grabbedObject.index
        );
      } else {
        Object.values(this.boardRenderers).forEach(boardRenderer =>
          boardRenderer.selectCanvasObject(undefined)
        );
      }
    }
  }

  private onPointerUp(e: MouseEvent | TouchEvent) {
    if (this.isGrabbing && this.grabbedObj !== undefined) {
      // update it's new location
      const obj = this.objects[this.grabbedObj.renderer][this.grabbedObj.index];
      this.getBoardRenderer(this.grabbedObj.renderer)?.onGrabEnd(
        this.grabbedObj.index,
        obj.x,
        obj.y
      );
    }

    this.isPanning = false;
    this.isGrabbing = false;
    this.initialPinchDistance = undefined;
    this.grabbedObj = undefined;
  }

  private onPointerMove(e: MouseEvent | TouchEvent) {
    if (this.isPanning) {
      const location = this.getEventOnCameraLocation(e);
      if (!location) return;

      this.cameraOffset.x = location.x - this.panStart.x;
      this.cameraOffset.y = location.y - this.panStart.y;
    }

    if (this.isGrabbing && this.grabbedObj !== undefined) {
      const location = this.getEventOnCameraLocation(e);
      if (!location) return;

      location.x = location.x - this.cameraOffset.x;
      location.y = location.y - this.cameraOffset.y;

      this.objects[this.grabbedObj.renderer][this.grabbedObj.index].x +=
        location.x - this.grabLocation.x;
      this.objects[this.grabbedObj.renderer][this.grabbedObj.index].y +=
        location.y - this.grabLocation.y;

      this.getBoardRenderer(this.grabbedObj.renderer)?.onGrabMove(
        this.grabbedObj.index,
        this.objects[this.grabbedObj.renderer][this.grabbedObj.index].x,
        this.objects[this.grabbedObj.renderer][this.grabbedObj.index].y
      );

      this.grabLocation.x = location.x;
      this.grabLocation.y = location.y;
    }
  }

  private handleTouch(
    e: TouchEvent,
    singleTouchHandler: (e: TouchEvent) => void
  ) {
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

  private getBoardRenderer(name: string): BoardRenderer | undefined {
    return this.boardRenderers.find(renderer => renderer.name == name);
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
