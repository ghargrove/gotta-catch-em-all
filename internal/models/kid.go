package models

type Kid struct {
	Id    int    `json:"id"`
	Name  string `json:"name"`
	Cards []Card `json:"cards"`
}
