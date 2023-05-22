import { BehaviorSubject, map } from 'rxjs';
import { BoardRenderer } from './board-renderer';

type RendererPriority = {
  renderer: BoardRenderer;
  priority: number;
};

export class RendererPriorityMap extends BehaviorSubject<
  Map<string, RendererPriority>
> {
  constructor(initialValue: Map<string, RendererPriority> = new Map()) {
    super(initialValue);
  }

  renderers$ = this.pipe(
    map(map => Array.from(map.values())),
    map(renderers =>
      renderers.sort((a, b) => (a.priority > b.priority ? 1 : -1))
    ),
    map(renderers => renderers.map(({ renderer }) => renderer))
  );

  set(name: string, renderer: BoardRenderer, priority: number): void {
    const map = new Map(this.value);

    if (map.has(name)) {
      map.get(name)?.renderer.destroy();
    }

    map.set(name, { renderer, priority });
    this.next(map);
  }

  delete(name: string): void {
    const map = new Map(this.value);
    map.get(name)?.renderer.destroy();
    map.delete(name);
    this.next(map);
  }

  clear(): void {
    this.value.forEach(({ renderer }) => renderer.destroy());
    this.next(new Map());
  }

  has(name: string): boolean {
    return this.value.has(name);
  }

  get(name: string): BoardRenderer | undefined {
    return this.value.get(name)?.renderer;
  }
}
