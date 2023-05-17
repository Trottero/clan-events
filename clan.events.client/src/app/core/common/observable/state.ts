import { BehaviorSubject } from 'rxjs';

export class State<T> extends BehaviorSubject<T> {
  constructor(initialState: T) {
    super(initialState);
  }

  public override next(state: Partial<T>) {
    super.next({
      ...this.value,
      ...state,
    });
  }
}
