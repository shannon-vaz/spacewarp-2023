package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"math/big"
	"os"

	core "github.com/iden3/go-iden3-core"
	"github.com/iden3/go-iden3-crypto/babyjub"
	"github.com/iden3/go-iden3-crypto/keccak256"
	poseidon "github.com/iden3/go-iden3-crypto/poseidon"
	"github.com/iden3/go-merkletree-sql"
)

type signedClaim struct {
	Claim        *core.Claim `json:"claim"`
	SignatureR8X string      `json:"sigR8x"`
	SignatureR8Y string      `json:"sigR8y"`
	SignatureS   string      `json:"sigS"`
}

func main() {

	// to generate a random private key
	// privKey := babyjub.NewRandPrivKey()

	var issuerPrivKey babyjub.PrivateKey
	privKHex := "21a5e7321d0e2f3ca1cc6504396e6594a2211544b08c206847cdee96f832421a"

	hex.Decode(issuerPrivKey[:], []byte(privKHex))

	// issue claim for SP setting 1 in data slot for isMember
	dataSlotA, _ := core.NewElemBytesFromInt(big.NewInt(1))

	// add a random nonce to avoid rainbow attacks
	RandomInt, _ := rand.Prime(rand.Reader, 128)
	dataSlotC, _ := core.NewElemBytesFromInt(RandomInt)

	var schemaHash core.SchemaHash
	schemaHashString := calculateClaimSchemaHash()

	// Add the schema hash for sp org membership claim standard
	schemaBytes, _ := hex.DecodeString(schemaHashString)

	copy(schemaHash[:], schemaBytes)

	orgMembershipClaim, _ := core.NewClaim(
		schemaHash,
		core.WithIndexData(dataSlotA, core.ElemBytes{}),
		core.WithValueData(dataSlotC, core.ElemBytes{}))

	hashIndex, hashValue, _ := claimsIndexValueHashes(*orgMembershipClaim)

	commonHash, _ := merkletree.HashElems(hashIndex, hashValue)

	// Issuer signs the claim
	claimSignature := issuerPrivKey.SignPoseidon(commonHash.BigInt())
	// https://github.com/iden3/go-iden3-crypto/blob/master/babyjub/eddsa.go#L289
	// Signature used EdDSA hash schema

	signedClaimData := signedClaim{
		Claim:        orgMembershipClaim,
		SignatureR8X: claimSignature.R8.X.String(),
		SignatureR8Y: claimSignature.R8.Y.String(),
		SignatureS:   claimSignature.S.String(),
	}

	signedClaimDataJSON, _ := json.Marshal(signedClaimData)

	fmt.Println(string(signedClaimDataJSON))
}

func claimsIndexValueHashes(c core.Claim) (*big.Int, *big.Int, error) {
	index, value := c.RawSlots()
	indexHash, err := poseidon.Hash(core.ElemBytesToInts(index[:]))
	if err != nil {
		return nil, nil, err
	}
	valueHash, err := poseidon.Hash(core.ElemBytesToInts(value[:]))
	return indexHash, valueHash, err
}

func calculateClaimSchemaHash() string {
	schemaBytes, _ := os.ReadFile("../claim_schemas/sp-org-membership.json-ld")
	var sHash core.SchemaHash
	// Hash of claim schema = hash(schemaBytes, credentialType)
	h := keccak256.Hash(schemaBytes, []byte("SPOrgMembership"))
	copy(sHash[:], h[len(h)-16:])
	sHashHex, _ := sHash.MarshalText()
	return (string(sHashHex))
}
