BINARY=devbhoomi-api
CMD=./cmd/api

.PHONY: run build tidy test create-admin

run:
	GIN_MODE=debug go run $(CMD)/main.go

build:
	go build -o $(BINARY) $(CMD)/main.go

tidy:
	go mod tidy

test:
	go test ./...

# Create an admin user. Usage: make create-admin EMAIL=admin@devbhoomi.com PASSWORD=Admin@123456
create-admin:
	@go run ./cmd/admin-seed/main.go -email=$(EMAIL) -password=$(PASSWORD)
