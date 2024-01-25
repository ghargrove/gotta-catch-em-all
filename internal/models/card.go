package models

type CardPrices struct {
	High   float64 `json:"high"`
	Low    float64 `json:"low"`
	Market float64 `json:"market"`
	Mid    float64 `json:"mio"`
}

type Card struct {
	Id    int    `json:"id"`
	TcgId string `db:"tcg_id" json:"tcg_id"`
	Name  string `json:"name"`
	Price struct {
		Low    float64 `json:"low"`
		Mid    float64 `json:"mid"`
		High   float64 `json:"high"`
		Market float64 `json:"market"`
	} `json:"price"`
}
