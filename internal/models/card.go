package models

type Card struct {
	Id    int    `json:"id"`
	TcgId string `db:"tcg_id" json:"tcg_id"`
	Name  string `json:"name"`
}
