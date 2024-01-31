package main

import (
	"log"
	"os"
	"path/filepath"

	"github.com/ghargrove/pokemon-web/http"
	"github.com/ghargrove/pokemon-web/http/rest"
	"github.com/ghargrove/pokemon-web/internal"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"fmt"
)

func main() {
	// Usefule for getting the exec path
	// https://stackoverflow.com/questions/18537257/how-to-get-the-directory-of-the-currently-running-file
	ex, err := os.Executable()
	if err != nil {
		log.Fatal("Could not read the executable")
	}
	// The directory we can use to absolutely reference app files
	exPath := filepath.Dir(ex)

	fmt.Printf("path: %s\n", filepath.Join(exPath, ".env"))

	err = godotenv.Load(filepath.Join(exPath, ".env"))
	if err != nil {
		log.Fatal("Error loading env file")
	}

	db := internal.CreateDB()
	db.MustExec(internal.Schema)

	r := gin.Default()

	// Statically serve the compiled assets
	r.Static("/assets", filepath.Join(exPath, "test/dist/assets"))

	r.Use(http.Intercept404AndServeReact)

	r.Use(func(c *gin.Context) {
		// If we have a 404 then serve the index page and
		// let client side routing take over
		if c.Writer.Status() == 404 {
			fname := filepath.Join(exPath, "test/dist/index.html")

			c.File(fname)
			c.Abort()
		}
	})

	r.GET("/api/sets", rest.HandleAllSets)
	r.GET("/api/sets/:id", rest.HandleSingleSet)
	r.GET("/api/sets/:id/cards", rest.HandleCardsForSet)
	r.GET("/api/kids", func(c *gin.Context) {
		rest.HandleAllKids(c, db)
	})
	r.GET("/api/kids/:id", func(c *gin.Context) {
		rest.HandleIndividualKid(c, db)
	})
	r.POST("/api/kids/:id/cards", func(c *gin.Context) {
		rest.CreateKidCard(c, db)
	})

	r.Run(":8082")
}
