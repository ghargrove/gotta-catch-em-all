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

func HandleAllUsers(c *gin.Context, db *sqlx.DB) {
	var result []User

	db.Select(&result, "SELECT id, name FROM users")

	// Map the values in pointers
	var users []*User
	for _, user := range u {
		users = append(users, &user)
	}

	c.JSON(http.StatusOK, AllUsersResponse{users})
}
