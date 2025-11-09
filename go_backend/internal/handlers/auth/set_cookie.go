package auth

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)


func SetCookieHandler(c *gin.Context) {
	var body struct {
		Token string `json:"token"`
	}
	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	frontendOrigin := os.Getenv("FRONTEND_ORIGIN")
	if frontendOrigin == "" {
		frontendOrigin = "http://localhost:3000"
	}

	isLocalhost := strings.Contains(frontendOrigin, "localhost")
	cookieDomain := "localhost"
	if !isLocalhost {
		cookieDomain = "shortly-url-shortener-showcase.vercel.app" // adjust as needed
	}

	secure := !isLocalhost // ✅ Only true in production
	sameSite := http.SameSiteLaxMode
	if secure {
		sameSite = http.SameSiteNoneMode
	}

	c.SetSameSite(sameSite)
	c.SetCookie("token", body.Token, 24*60*60, "/", cookieDomain, secure, true)

	c.JSON(http.StatusOK, gin.H{"message": "Cookie set"})
}
