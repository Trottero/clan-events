import { Observable } from 'rxjs';

export abstract class InjectableStream<T> extends Observable<T> {
  protected constructor(stream$: Observable<T>) {
    super(observer => stream$.subscribe(observer));
  }
}
