package main

import (
	"fmt"
	"os"

	core "github.com/iden3/go-iden3-core"
	"github.com/iden3/go-iden3-crypto/keccak256"
)

func main() {

	schemaBytes, _ := os.ReadFile("./organisation.json-ld")

	var sHash core.SchemaHash
	h := keccak256.Hash(schemaBytes, []byte("Organisation"))

	copy(sHash[:], h[len(h)-16:])

	sHashHex, _ := sHash.MarshalText()

	fmt.Println(string(sHashHex))
}