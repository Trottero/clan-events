export interface Response<T> {
  data: T;
  timestamp: Date;
  executionTime: Date;
}
