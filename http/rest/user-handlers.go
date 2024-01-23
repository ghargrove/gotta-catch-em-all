package rest

import (
	"net/http"

	"github.com/ghargrove/pokemon-web/internal"
	"github.com/ghargrove/pokemon-web/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

type AllKidsResponse struct {
	Kids []*models.Kid `json:"kids"`
}

type SingleKidResponse struct {
	User *models.Kid `json:"kid"`
}

type KidNotFound struct {
	Message string
}

func (e KidNotFound) Error() string {
	return e.Message
}

// Retrieve a user for the provided id
func queryKidById(db *sqlx.DB, id string) (models.Kid, error) {
	var result models.Kid

	db.Get(&result, "SELECT id, name FROM kids WHERE id = $1", id)

	if result.Id == 0 {
		return result, KidNotFound{"Kid not found"}
	}

	return result, nil
}

/**
 * HTTP GET /api/kids
 *
 * Retrieve all kids
 */
func HandleAllKids(c *gin.Context, db *sqlx.DB) {
	var result []models.Kid

	db.Select(&result, "SELECT id, name FROM kids")

	// Map the values in pointers
	var users []*models.Kid
	for _, user := range result {
		users = append(users, &user)
	}

	c.JSON(http.StatusOK, AllKidsResponse{users})
}

/**
 * HTTP GET /api/kids/:id
 *
 * Retrieve an individual kid
 */
func HandleIndividualKid(c *gin.Context, db *sqlx.DB) {
	user, err := queryKidById(db, c.Param("id"))

	// Return a 404 if the user doesn't exist
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)

		return
	}

	c.JSON(http.StatusOK, SingleKidResponse{&user})
}

type CreateCardParams struct {
	CardId string `json:"card_id" binding:"required"`
}

type CreateCardResponse struct {
	Card *models.Card `json:"card"`
}

/**
 * HTTP POST /api/kids/:user_id/cards/:tcg_id
 */
func CreateKidCard(c *gin.Context, db *sqlx.DB) {
	var json CreateCardParams

	if err := c.BindJSON(&json); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)

		return
	}

	user, err := queryKidById(db, c.Param("id"))
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)

		return
	}

	card, err := internal.ApiClient.GetCardByID(json.CardId)
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)

		return
	}

	// TODO: Create a `pokemon` if one doesnt exist
	// TODO: Create a `card` and associate it with a Pokemon
	// TODO: Associate the `card` with the user

	// If the pokemon doesn't exist we'll need to create it
	var pokemon models.Pokemon
	db.Get(&pokemon, "SELECT id, name FROM pokemon WHERE name = $1", card.Name)

	if pokemon.Id == 0 {
		// Create the pokemon
		_, err = db.NamedExec("INSERT INTO pokemon (name) VALUES (:name)", card)
		if err != nil {
			c.AbortWithStatus(http.StatusInternalServerError)

			return
		}
	}

	db.Get(&pokemon, "SELECT id, name FROM pokemon WHERE name = $1", card.Name)

	stmt, err := db.PrepareNamed("INSERT INTO cards (tcg_id, pokemon_id) VALUES (:tcgId, :pokemonId) RETURNING id")

	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)

		return
	}

	var cardId int
	err = stmt.Get(&cardId, map[string]interface{}{
		"tcgId":     card.ID,
		"pokemonId": pokemon.Id,
	})

	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)

		return
	}

	_, err = db.NamedExec("INSERT INTO cards_kids (card_id, kid_id) VALUES (:cardId, :kidId)",
		map[string]interface{}{
			"cardId": cardId,
			"kidId":  user.Id,
		})

	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)

		return
	}

	var cardModel models.Card
	err = db.Get(&cardModel, "SELECT c.id, c.tcg_id, p.name FROM cards AS c JOIN pokemon AS p ON c.pokemon_id = p.id WHERE c.id = $1", cardId)

	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)

		return
	}

	c.JSON(http.StatusOK, CreateCardResponse{&cardModel})
}
