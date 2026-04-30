package prober

import (
	"math"
	"sort"
	"time"
)

func GetStats(latencies []time.Duration) (p50, p95, p99, stdDev float64) {
	var validLatencies []float64
	var sum float64

	for _, l := range latencies {
		if l > 0 {
			ms := float64(l.Nanoseconds()) / 1e6
			validLatencies = append(validLatencies, ms)
			sum += ms
		}
	}

	n := len(validLatencies)
	if n == 0 {
		return 0, 0, 0, 0
	}

	sort.Float64s(validLatencies)

	getIndex := func(p float64) int {
		i := int(math.Ceil(p*float64(n))) - 1

		if i < 0 {
			i = 0
		}
		if i >= n {
			i = n - 1
		}
		return i
	}

	if n%2 == 0 {
		mid := n / 2
		p50 = (validLatencies[mid-1] + validLatencies[mid]) / 2
	} else {
		p50 = validLatencies[n/2]
	}

	p95 = validLatencies[getIndex(0.95)]
	p99 = validLatencies[getIndex(0.99)]

	mean := sum / float64(n)

	var sdSum float64
	for _, l := range validLatencies {
		diff := l - mean
		sdSum += diff * diff
	}

	if n > 1 {
		stdDev = math.Sqrt(sdSum / float64(n-1))
	} else {
		stdDev = 0
	}

	return
}
