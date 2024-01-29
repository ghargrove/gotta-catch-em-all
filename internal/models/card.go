package models

type Card struct {
	Id     int    `json:"id"`
	TcgId  string `db:"tcg_id" json:"tcg_id"`
	Name   string `json:"name"`
	Kind   string `json:"kind"`
	Prices Value  `json:"prices"`
}

/** Find the prices for the card based on its kind (normal, holo, etc) */
func (card *Card) LookupValues(prices TCGPlayerPrices) {
	if card.Kind == "normal" && prices.Normal != nil {
		card.Prices = *prices.Normal
	}

	if card.Kind == "holofoil" && prices.Holofoil != nil {
		card.Prices = *prices.Holofoil
	}

	if card.Kind == "reverse-holofoil" && prices.ReverseHolofoil != nil {
		card.Prices = *prices.ReverseHolofoil
	}
}

type TCGPlayerPrices struct {
	Holofoil *struct {
		Low    float64 `json:"low"`
		Mid    float64 `json:"mid"`
		High   float64 `json:"high"`
		Market float64 `json:"market"`
	} `json:"holofoil,omitempty"`

	ReverseHolofoil *struct {
		Low    float64 `json:"low"`
		Mid    float64 `json:"mid"`
		High   float64 `json:"high"`
		Market float64 `json:"market"`
	} `json:"reverseHolofoil,omitempty"`

	Normal *struct {
		Low    float64 `json:"low"`
		Mid    float64 `json:"mid"`
		High   float64 `json:"high"`
		Market float64 `json:"market"`
	} `json:"normal,omitempty"`
}
