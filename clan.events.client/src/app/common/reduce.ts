import { BehaviorSubject } from 'rxjs';

export function reducer<T>(subj: BehaviorSubject<T>, patch: Partial<T>): void {
  subj.next({ ...subj.value, ...patch });
}
