// Package middleware provides reusable Gin middleware for authentication,
// CORS handling, rate limiting, and request blocking.
package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// BlockBadRequests blocks malicious paths, suspicious file extensions,
// and known harmful user agents to prevent automated scanning and bot activity.
func BlockBadRequests() gin.HandlerFunc {
	return func(c *gin.Context) {
		path := c.Request.URL.Path
		ua := c.Request.Header.Get("User-Agent")

		blockedPrefixes := []string{
			"/xmlrpc.php",
			"/wp-admin",
			"/wp-login.php",
			"/wp-includes",
			"/blog/wp-includes",
			"/wordpress/wp-includes",
			"/cms/wp-includes",
			"/site/wp-includes",
			"/media/wp-includes",
			"/shop/wp-includes",
			"/admin",
			"/robots.txt",
		}

		blockedExtensions := []string{
			".php",
			".phtml",
			".xml",
			".txt",
		}

		for _, prefix := range blockedPrefixes {
			if strings.HasPrefix(path, prefix) {
				c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "forbidden"})
				return
			}
		}

		for _, ext := range blockedExtensions {
			if strings.HasSuffix(path, ext) {
				c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "forbidden"})
				return
			}
		}

		blockedAgents := []string{"IbouBot", "bot@ibou.io", "curl", "wget", "python-requests"}
		for _, bad := range blockedAgents {
			if strings.Contains(strings.ToLower(ua), strings.ToLower(bad)) {
				c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "forbidden"})
				return
			}
		}

		c.Next()
	}
}
