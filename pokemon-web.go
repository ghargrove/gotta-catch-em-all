package main

import (
	"github.com/ghargrove/pokemon-web/http/rest"
	"github.com/ghargrove/pokemon-web/internal"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
)

/** Represents a pokemon */
type Pokemon struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

/** Represents a user */
type User struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading env file")
	}

	allPokemon := []Pokemon{}

	db := internal.CreateDB()
	db.Select(&allPokemon, "SELECT id, name FROM pokemon")
	for _, pokemon := range allPokemon {
		log.Printf("%d: %s (from sqlx)", pokemon.Id, pokemon.Name)
	}

	r := gin.Default()

	r.GET("/sets", rest.HandleAllSets)
	r.GET("/sets/:id", rest.HandleSingleSet)
	r.GET("/sets/:id/cards", rest.HandleCardsForSet)
	r.Run(":8082")
}
