export type AuditEngineResult = {
  dns_time: number;
  tcp_time: number;
  tls_time: number;
  ttfb: number;
  total_time: number;
  p50: number;
  p95: number;
  p99: number;
  std_dev: number;
  status_code: number;
};
