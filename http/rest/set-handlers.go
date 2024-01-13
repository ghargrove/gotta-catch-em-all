package rest

import (
	tcg "github.com/PokemonTCG/pokemon-tcg-sdk-go-v2/pkg"
	"github.com/ghargrove/pokemon-web/internal"
	"github.com/gin-gonic/gin"
	"net/http"
)

type SetsResponse struct {
	Sets []*tcg.Set `json:"sets"`
}

type SetResponse struct {
	Set *tcg.Set `json:"set"`
}

/** Retrieve all pokemon card sets */
func HandleAllSets(c *gin.Context) {
	sets, err := internal.ApiClient.GetSets()
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)

		return
	}

	c.JSON(http.StatusOK, SetsResponse{sets})
}

/** Retrieve a single set */
func HandleSingleSet(c *gin.Context) {
	id := c.Param("id")

	set, err := internal.ApiClient.GetSetByID(id)
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)

		return
	}

	c.JSON(http.StatusOK, SetResponse{set})
}
