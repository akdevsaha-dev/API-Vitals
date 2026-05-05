export interface AuditResultData {
  dnsTime: number;
  tlsTime: number;
  ttfb: number;
  p50: number;
  p99: number;
  stdDev: number;
  statusCode: number;
}

export interface Suggestion {
  severity: "critical" | "warning" | "info";
  title: string;
  actionable_advice: string;
}

export function generateInsights(data: AuditResultData): Suggestion[] {
  const suggestions: Suggestion[] = [];

  // 1. The "Distance / Routing" Check
  if (data.tlsTime > 100) {
    suggestions.push({
      severity: "warning",
      title: "Slow TLS Handshake",
      actionable_advice: `Your TLS handshake took ${data.tlsTime.toFixed(0)}ms. Consider upgrading to TLS 1.3, moving your servers closer to your users, or using an Edge Network (like Cloudflare) to terminate SSL closer to the client.`
    });
  }

  // 2. The "Backend Bottleneck" Check
  if (data.ttfb > 300) {
    suggestions.push({
      severity: "critical",
      title: "High Server Processing Time (TTFB)",
      actionable_advice: `The server took ${data.ttfb.toFixed(0)}ms to start sending data. This usually indicates slow Database queries or heavy CPU processing. Look into adding database indexes or caching frequent responses with Redis.`
    });
  }

  // 3. The "Tail Latency" Check (The p99 vs p50 gap)
  // If p99 is more than 3x the p50, your edge-case users are suffering.
  if (data.p99 > data.p50 * 3) {
    suggestions.push({
      severity: "warning",
      title: "Severe Tail Latency",
      actionable_advice: `While most users experience ${data.p50.toFixed(0)}ms, your 1% slowest requests take over ${data.p99.toFixed(0)}ms. This is often caused by Garbage Collection (GC) pauses, resource locks, or unoptimized DB joins on edge-case data.`
    });
  }

  // 4. The "Stability / Jitter" Check
  // If StdDev is more than 50% of the median response time, it's highly unstable.
  if (data.stdDev > data.p50 * 0.5) {
    suggestions.push({
      severity: "warning",
      title: "High API Jitter",
      actionable_advice: `A standard deviation of ${data.stdDev.toFixed(0)}ms means your API's performance is highly unpredictable under load. Check if your server is hitting CPU limits, or if you are running on a shared "noisy neighbor" cloud instance.`
    });
  }

  // 5. The "Rate Limiting / Crash" Check
  if (data.statusCode !== 200) {
    suggestions.push({
      severity: "critical",
      title: `Failed Requests (Code: ${data.statusCode})`,
      actionable_advice: `The burst test resulted in non-200 status codes. If this is a 429, you are hitting a rate limit. If it's a 50x, your server crashed under the concurrency load. Check your auto-scaling rules.`
    });
  }

  // Fallback for a perfect API
  if (suggestions.length === 0) {
    suggestions.push({
      severity: "info",
      title: "All Systems Optimized",
      actionable_advice: "Your API is responding efficiently with excellent stability and routing. Keep it up!"
    });
  }

  return suggestions;
}
