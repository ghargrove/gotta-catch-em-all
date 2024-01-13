package internal

import (
	tcg "github.com/PokemonTCG/pokemon-tcg-sdk-go-v2/pkg"
	"os"
)

/** PokemonTCG api client */
var ApiClient tcg.Client = tcg.NewClient(os.Getenv("POKEMON_API_KEY"))
