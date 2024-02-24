package rest

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"

	"github.com/ghargrove/pokemon-web/internal"
	"github.com/ghargrove/pokemon-web/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

type AllKidsResponse struct {
	Kids []*models.Kid `json:"kids"`
}

type SingleKidResponse struct {
	Kid *models.Kid `json:"kid"`
}

type KidNotFound struct {
	Message string
}

func (e KidNotFound) Error() string {
	return e.Message
}

type KidQueryResult struct {
	Id          int            `json:"id"`
	Name        string         `json:"name"`
	AvatarId    int            `json:"avatar_id" db:"avatar_id"`
	CardId      sql.NullInt64  `json:"card_id" db:"card_id"`
	TcgId       sql.NullString `json:"tcg_id" db:"tcg_id"`
	Kind        sql.NullString `json:"kind"`
	PokemonName sql.NullString `json:"pokemon_name" db:"pokemon_name"`
}

/** Get the correct value struct based on the card type */

// Retrieve a kid for the provided id
func queryKidById(db *sqlx.DB, id string) (models.Kid, error) {
	query := `
		SELECT k.id, k.name, k.avatar_id, c.id AS card_id, c.tcg_id, c.kind, p.name AS pokemon_name
		FROM kids AS k
		LEFT JOIN cards_kids AS ck ON k.id = ck.kid_id
		LEFT JOIN cards AS c ON ck.card_id = c.id
		LEFT JOIN pokemon AS p ON c.pokemon_id = p.id
		WHERE k.id = $1
	`

	results := []KidQueryResult{}
	queryResult := KidQueryResult{}

	rows, err := db.Queryx(query, id)
	if err != nil {
		return models.Kid{}, KidNotFound{"Kids query failed"}
	}

	for rows.Next() {
		err := rows.StructScan(&queryResult)
		if err != nil {
			return models.Kid{}, KidNotFound{"Kid failed to decode"}
		}

		results = append(results, queryResult)
	}

	if len(results) == 0 {
		return models.Kid{}, KidNotFound{"Kid not found"}
	}

	kid := models.Kid{
		Id:       results[0].Id,
		Name:     results[0].Name,
		AvatarId: results[0].AvatarId,
		Cards:    []models.Card{},
	}

	for _, k := range results {
		if k.CardId.Valid {
			card, err := internal.ApiClient.GetCardByID(k.TcgId.String)
			if err != nil {
				return models.Kid{}, KidNotFound{"Error retrieving card data"}
			}

			cardModel := models.Card{
				Id:     int(k.CardId.Int64),
				TcgId:  k.TcgId.String,
				Name:   k.PokemonName.String,
				Kind:   k.Kind.String,
				Images: card.Images,
				Set: struct {
					Id     string `json:"id"`
					Name   string `json:"name"`
					Series string `json:"series"`
				}{
					Id:     card.Set.ID,
					Name:   card.Set.Name,
					Series: card.Set.Series,
				},
			}

			prices := card.TCGPlayer.Prices

			cardModel.LookupValues(prices)
			kid.Cards = append(kid.Cards, cardModel)

			// Update the portfolio value
			kid.Value.Low += internal.RoundFloat(cardModel.Prices.Low, 2)
			kid.Value.Mid += internal.RoundFloat(cardModel.Prices.Mid, 2)
			kid.Value.High += internal.RoundFloat(cardModel.Prices.High, 2)
			kid.Value.Market += internal.RoundFloat(cardModel.Prices.Market, 2)
		}
	}

	return kid, nil
}

/**
 * HTTP GET /api/kids
 *
 * Retrieve all kids
 */
func HandleAllKids(c *gin.Context, db *sqlx.DB) {
	var results []KidQueryResult

	query := `
		SELECT k.id, k.name, k.avatar_id, c.id AS card_id, c.tcg_id, c.kind, p.name AS pokemon_name
		FROM kids AS k
		LEFT JOIN cards_kids AS ck ON k.id = ck.kid_id
		LEFT JOIN cards AS c ON ck.card_id = c.id
		LEFT JOIN pokemon AS p ON c.pokemon_id = p.id
		ORDER BY k.id ASC
	`

	rows, err := db.Queryx(query)
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)

		return
	}

	queryResult := KidQueryResult{}
	for rows.Next() {
		err := rows.StructScan(&queryResult)
		if err != nil {
			c.AbortWithStatus(http.StatusInternalServerError)

			return
		}

		results = append(results, queryResult)
	}

	// Store the kids by their id into a map
	kidMap := make(map[string]*models.Kid)
	for _, result := range results {
		kid, kidExists := kidMap[strconv.Itoa(result.Id)]
		// If we don't have a kid already the create it and add it to the map
		if !kidExists {
			kid = &models.Kid{
				Id:       result.Id,
				Name:     result.Name,
				AvatarId: result.AvatarId,
				Cards:    []models.Card{},
			}

			kidMap[strconv.Itoa(kid.Id)] = kid
		}

		if result.CardId.Valid {
			card, err := internal.ApiClient.GetCardByID(result.TcgId.String)
			if err != nil {
				c.AbortWithStatus(http.StatusBadRequest)

				return
			}

			cardModel := models.Card{
				Id:     int(result.CardId.Int64),
				TcgId:  result.TcgId.String,
				Name:   result.PokemonName.String,
				Kind:   result.Kind.String,
				Images: card.Images,
			}

			cardModel.LookupValues(card.TCGPlayer.Prices)
			kid.Cards = append(kid.Cards, cardModel)
		}
	}

	// Map the values in pointers
	var kids []*models.Kid

	for _, kid := range kidMap {
		// Add up all of the users cards
		for _, card := range kid.Cards {
			// Update the portfolio value
			kid.Value.Low += internal.RoundFloat(card.Prices.Low, 2)
			kid.Value.Mid += internal.RoundFloat(card.Prices.Mid, 2)
			kid.Value.High += internal.RoundFloat(card.Prices.High, 2)
			kid.Value.Market += internal.RoundFloat(card.Prices.Market, 2)
		}

		kids = append(kids, kid)
	}

	c.JSON(http.StatusOK, AllKidsResponse{kids})
}

/**
 * HTTP GET /api/kids/:id
 *
 * Retrieve an individual kid
 */
func HandleIndividualKid(c *gin.Context, db *sqlx.DB) {
	kid, err := queryKidById(db, c.Param("id"))

	// Return a 404 if the kid doesn't exist
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)

		return
	}

	c.JSON(http.StatusOK, SingleKidResponse{&kid})
}

// Reprsents the kind of card (normal, holofoil, reverse holo)
type CardKind string

const (
	KindHolofoil        CardKind = "holofoil"
	KindReverseHolofoil CardKind = "reverse-holofoil"
	KindNormal          CardKind = "normal"
)

type CreateCardParams struct {
	CardId string   `json:"card_id" binding:"required"`
	Kind   CardKind `binding:"required"`
}

type CreateCardResponse struct {
	Card *models.Card `json:"card"`
}

/**
 * HTTP POST /api/kids/:id/cards
 * { "card_id": "sv4-1", "kind": "normal" }
 *
 */
func CreateKidCard(c *gin.Context, db *sqlx.DB) {
	var json CreateCardParams

	if err := c.BindJSON(&json); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)

		return
	}

	kid, err := queryKidById(db, c.Param("id"))
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)

		return
	}

	card, err := internal.ApiClient.GetCardByID(json.CardId)
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)

		return
	}

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

	stmt, err := db.PrepareNamed("INSERT INTO cards (tcg_id, kind, pokemon_id) VALUES (:tcgId, :kind, :pokemonId) RETURNING id")

	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)

		return
	}

	var cardId int
	err = stmt.Get(&cardId, map[string]interface{}{
		"tcgId":     card.ID,
		"kind":      json.Kind,
		"pokemonId": pokemon.Id,
	})

	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)

		return
	}

	_, err = db.NamedExec("INSERT INTO cards_kids (card_id, kid_id) VALUES (:cardId, :kidId)",
		map[string]interface{}{
			"cardId": cardId,
			"kidId":  kid.Id,
		})

	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)

		return
	}

	var cardModel models.Card
	err = db.Get(&cardModel, "SELECT c.id, c.kind, c.tcg_id, p.name FROM cards AS c JOIN pokemon AS p ON c.pokemon_id = p.id WHERE c.id = $1", cardId)
	cardModel.LookupValues(card.TCGPlayer.Prices)

	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)

		return
	}

	c.JSON(http.StatusOK, CreateCardResponse{&cardModel})
}
