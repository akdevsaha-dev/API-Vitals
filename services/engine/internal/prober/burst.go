package prober

import (
	"sync"
	"time"
)

func runBurst(url string, count int) []time.Duration {
	var wg sync.WaitGroup
	latencies := make([]time.Duration, count)

	sem := make(chan struct{}, 10)

	for i := 0; i < count; i++ {
		wg.Add(1)
		go func(idx int) {
			defer wg.Done()
			sem <- struct{}{}
			res, err := TraceURL(url)
			if err == nil {
				latencies[idx] = res.Total
			}
			<-sem
		}(i)
	}
	wg.Wait()
	return latencies
}
