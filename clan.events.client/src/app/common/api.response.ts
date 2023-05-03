export interface ApiResponse<T = any> {
  data: T;
  timestamp: number;
  executionTime: number;
}
