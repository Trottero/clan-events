import { BehaviorSubject } from 'rxjs';

export function reducer<T>(subj: BehaviorSubject<T>, patch: Partial<T>) {
  subj.next({ ...subj.value, ...patch });
}
