package models

type Value struct {
	Low    float64 `json:"low"`
	Mid    float64 `json:"mid"`
	High   float64 `json:"high"`
	Market float64 `json:"market"`
}

type Kid struct {
	Id       int    `json:"id"`
	Name     string `json:"name"`
	AvatarId int    `json:"avatar_id"`
	Cards    []Card `json:"cards"`
	Value    Value  `json:"value"`
}
