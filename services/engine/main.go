package main

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/akdevsaha-dev/api-vitals/services/engine/internal/prober"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: ./engine <url>")
		os.Exit(1)
	}

	url := os.Args[1]

	result, err := prober.ExecuteAudit(url)
	if err != nil {
		json.NewEncoder(os.Stdout).Encode(map[string]string{
			"error": err.Error(),
		})
		os.Exit(1)
	}

	enc := json.NewEncoder(os.Stdout)
	enc.SetIndent("", "  ")
	enc.Encode(result)
}
