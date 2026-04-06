// admin-seed creates the initial admin user.
// Usage: go run ./cmd/admin-seed/main.go -email=admin@devbhoomi.com -password=YourPassword
package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"time"

	"devbhoomi/server/internal/config"
	"devbhoomi/server/internal/database"
	"devbhoomi/server/internal/model"
	"devbhoomi/server/internal/repository"

	"golang.org/x/crypto/bcrypt"
)

func main() {
	email := flag.String("email", "", "Admin email (required)")
	password := flag.String("password", "", "Admin password (required, min 8 chars)")
	flag.Parse()

	if *email == "" || *password == "" {
		fmt.Fprintln(os.Stderr, "usage: go run ./cmd/admin-seed/main.go -email=<email> -password=<password>")
		os.Exit(1)
	}
	if len(*password) < 8 {
		fmt.Fprintln(os.Stderr, "password must be at least 8 characters")
		os.Exit(1)
	}

	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	pool, err := database.NewPool(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("db: %v", err)
	}
	defer pool.Close()

	hash, err := bcrypt.GenerateFromPassword([]byte(*password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("hash: %v", err)
	}

	repo := repository.NewUserRepository(pool)
	u := &model.User{
		Name:         "Admin",
		Email:        *email,
		PasswordHash: string(hash),
		Role:         model.RoleAdmin,
	}
	if err := repo.Create(ctx, u); err != nil {
		if err == repository.ErrDuplicateEmail {
			log.Fatalf("user %s already exists", *email)
		}
		log.Fatalf("create admin: %v", err)
	}

	fmt.Printf("admin user created: %s (id: %s)\n", u.Email, u.ID)
}
