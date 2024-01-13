package rest

import (
	tcg "github.com/PokemonTCG/pokemon-tcg-sdk-go-v2/pkg"
	"github.com/PokemonTCG/pokemon-tcg-sdk-go-v2/pkg/request"
	"github.com/ghargrove/pokemon-web/internal"
	"github.com/gin-gonic/gin"

	"fmt"
	"net/http"
)

type CardsResponse struct {
	Cards []*tcg.PokemonCard `json:"cards"`
}

/** Retrieve cards */
func HandleCardsForSet(c *gin.Context) {
	setId := c.Param("id")

	cards, err := internal.ApiClient.GetCards(
		request.Query(fmt.Sprintf("set.id:%s", setId)),
	)
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)

		return
	}

	c.JSON(http.StatusOK, CardsResponse{cards})
}
