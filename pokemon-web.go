package main

import (
	"github.com/ghargrove/pokemon-web/http/rest"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading env file")
	}

	r := gin.Default()

	r.GET("/sets", rest.HandleAllSets)
	r.GET("/sets/:id", rest.HandleSingleSet)
	r.GET("/sets/:id/cards", rest.HandleCardsForSet)
	r.Run(":8082")
}
