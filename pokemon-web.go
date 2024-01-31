package main

import (
	"log"
	"os"
	"path/filepath"

	"github.com/ghargrove/pokemon-web/http"
	"github.com/ghargrove/pokemon-web/http/rest"
	"github.com/ghargrove/pokemon-web/internal"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
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

	err = godotenv.Load(filepath.Join(exPath, ".env"))
	if err != nil {
		log.Fatal("Error loading env file")
	}

	db := internal.CreateDB()
	db.MustExec(internal.Schema)

	r := gin.Default()

	// Statically serve the compiled assets
	r.Static("/assets", filepath.Join(exPath, "frontend/dist/assets"))

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders: []string{"Content-Type", "Origin"},
	}))
	r.Use(http.Intercept404AndServeReact)

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
