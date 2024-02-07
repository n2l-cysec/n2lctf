package request

import "github.com/elabosak233/pgshub/models/entity"

type ImageCreateRequest struct {
	Name        string              `json:"name"`
	CPULimit    float64             `json:"cpu_limit"`
	MemoryLimit int64               `json:"memory_limit"`
	Description string              `json:"description"`
	Ports       []PortCreateRequest `json:"ports"`
	Envs        []entity.Env        `json:"envs"`
}
