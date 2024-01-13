package rest

import (
	"encoding/json"
	"fmt"
	tcg "github.com/PokemonTCG/pokemon-tcg-sdk-go-v2/pkg"
	"github.com/PokemonTCG/pokemon-tcg-sdk-go-v2/pkg/request"
	"github.com/ghargrove/pokemon-web/internal"
	"net/http"
)

// I originally wrote these handlers using the net/http packge
// and im just keeping them here for reference
// http.HandleFunc("/", handler)
// http.HandleFunc("/card-sets", retrievePokemonSets)
// log.Fatal(http.ListenAndServe(":8082", nil))

type Res struct {
	Cards []*tcg.PokemonCard `json:"cards"`
}

func handler(w http.ResponseWriter, r *http.Request) {
	cards, err := internal.ApiClient.GetCards(
		request.Query("set.id:sv4"),
	)

	if err != nil {
		fmt.Fprintf(w, "Could not find cards")

		return
	}

	response := &Res{cards}
	mResponse, _ := json.Marshal(response)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, string(mResponse))

	// fmt.Fprintf(w, json.Marshal(d_cards))

	// for _, card := range cards {

	// }
}

/** Retrive all pokemon sets */
func retrievePokemonSets(w http.ResponseWriter, r *http.Request) {
	cardSets, err := internal.ApiClient.GetSets()

	// Fail with a 500 if the sets couldn't be retrieved
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)

		return
	}

	response, err := json.Marshal(SetsResponse{cardSets})

	// Fail with a 500 if the marshal fails
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)

		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, string(response))

}
