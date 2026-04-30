package prober

func ExecuteAudit(targetUrl string) (*AuditResult, error) {
	mainTrace, err := TraceURL(targetUrl)
	if err != nil {
		return nil, err
	}
	burstLatencies := runBurst(targetUrl, 100)
	p50, p95, p99, stdDev := GetStats(burstLatencies)

	return &AuditResult{
		DNSTime:    float64(mainTrace.DNS.Nanoseconds()) / 1e6,
		TCPTime:    float64(mainTrace.TCP.Nanoseconds()) / 1e6,
		TLSTime:    float64(mainTrace.TLS.Nanoseconds()) / 1e6,
		TTFB:       float64(mainTrace.TTFB.Nanoseconds()) / 1e6,
		TotalTime:  float64(mainTrace.Total.Nanoseconds()) / 1e6,
		P50:        p50,
		P95:        p95,
		P99:        p99,
		StdDev:     stdDev,
		StatusCode: float64(mainTrace.StatusCode),
	}, nil
}
