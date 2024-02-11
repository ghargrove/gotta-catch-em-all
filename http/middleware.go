package http

import (
	gin "github.com/gin-gonic/gin"
	"os"
	"path/filepath"
)

/**
 * If a route doesn't match the /api pattern and isn't a static
 * asset I want to send to the index.html page and let the client
 * side handle it without the api server returning a 404.
 *
 * This middleware looks for those http 404s and serves the index
 *
 * reference: https://hackandsla.sh/posts/2021-11-06-serve-spa-from-go/
 */
func Intercept404AndServeReact(c *gin.Context) {
	// Ignoring this error because we would have seen it already
	ex, _ := os.Executable()

	// If we have a 404 then serve the index page and
	// let client side routing take over
	if c.Writer.Status() == 404 {
		fname := filepath.Join(
			filepath.Dir(ex),
			"frontend/dist/index.html")

		c.File(fname)
		c.Abort()
	}
}
