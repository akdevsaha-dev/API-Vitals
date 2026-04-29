package prober

import "time"

type ProbeMetrics struct {
	DNS        time.Duration
	TCP        time.Duration
	TLS        time.Duration
	TTFB       time.Duration
	Total      time.Duration
	StatusCode int
}

type AuditResult struct {
	DNSTime    float64 `json:"dns_time"`
	TCPTime    float64 `json:"tcp_time"`
	TLSTime    float64 `json:"tls_time"`
	TTFB       float64 `json:"ttfb"`
	TotalTime  float64 `json:"total_time"`
	P50        float64 `json:"p50"`
	P95        float64 `json:"p95"`
	P99        float64 `json:"p99"`
	StdDev     float64 `json:"std_dev"`
	StatusCode float64 `json:"status_code"`
}
