export type AuditEngineResult = {
  DNSTime: number;
  TCPTime: number;
  TLSTime: number;
  TTFB: number;
  TotalTime: number;
  P50: number;
  P95: number;
  P99: number;
  StdDev: number;
  StatusCode: number;
};
