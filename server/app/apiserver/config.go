package apiserver

// Config struct
type Config struct {
	Addr       string `toml:"addr"`
	LogLevel   string `toml:"log_level"`
	SessionKey string `toml:"session_key"`
}

// NewConfig - init new config
func NewConfig() *Config {
	return &Config{
		Addr:     "8081",
		LogLevel: "debug",
	}
}
