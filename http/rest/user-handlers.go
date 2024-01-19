package rest

import (
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"net/http"
)

type User struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type AllUsersResponse struct {
	Users []*User `json:"users"`
}

type SingleUserResponse struct {
	User *User `json:"user"`
}

/**
 * HTTP GET /api/users
 *
 * Retrieve all users
 */
func HandleAllUsers(c *gin.Context, db *sqlx.DB) {
	var result []User

	db.Select(&result, "SELECT id, name FROM users")

	// Map the values in pointers
	var users []*User
	for _, user := range result {
		users = append(users, &user)
	}

	c.JSON(http.StatusOK, AllUsersResponse{users})
}

/**
 * HTTP GET /api/users/:id
 *
 * Retrieve an individual user
 */
func HandleIndividualUser(c *gin.Context, db *sqlx.DB) {
	var result User

	db.Get(&result, "SELECT id, name FROM users WHERE id = $1", c.Param("id"))

	// Return a 404 if the user doesn't exist
	if result.Id == 0 {
		c.AbortWithStatus(http.StatusNotFound)

		return
	}

	c.JSON(http.StatusOK, SingleUserResponse{&result})
}
