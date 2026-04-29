package prober

import (
	"crypto/tls"
	"net/http"
	"net/http/httptrace"
	"time"
)

func TraceURL(url string) (*ProbeMetrics, error) {
	var dnsStart, dnsDone, connStart, connDone, tlsStart, tlsDone, firstByte time.Time

	req, _ := http.NewRequest("GET", url, nil)

	trace := &httptrace.ClientTrace{
		DNSStart: func(_ httptrace.DNSStartInfo) {
			dnsStart =
				time.Now()
		},
		DNSDone: func(_ httptrace.DNSDoneInfo) {
			dnsDone =
				time.Now()
		},
		ConnectStart: func(_, _ string) {
			connStart =
				time.Now()
		},
		ConnectDone: func(_, _ string, _ error) {
			connDone =
				time.Now()
		},
		TLSHandshakeStart: func() {
			tlsStart =
				time.Now()
		},
		TLSHandshakeDone: func(_ tls.ConnectionState, _ error) {
			tlsDone =
				time.Now()
		},
		GotFirstResponseByte: func() {
			firstByte =
				time.Now()
		},
	}

	req = req.WithContext(httptrace.WithClientTrace(req.Context(), trace))
	start := time.Now()
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	total := time.Since(start)

	return &ProbeMetrics{
		DNS:   dnsDone.Sub(dnsStart),
		TCP:   connDone.Sub(connStart),
		TLS:   tlsDone.Sub(tlsStart),
		TTFB:  firstByte.Sub(connDone),
		Total: total,
	}, nil

}


