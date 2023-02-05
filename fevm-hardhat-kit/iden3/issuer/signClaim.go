package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"math/big"
	"os"

	"github.com/iden3/go-circuits"
	core "github.com/iden3/go-iden3-core"
	"github.com/iden3/go-iden3-crypto/babyjub"
	"github.com/iden3/go-iden3-crypto/keccak256"
	poseidon "github.com/iden3/go-iden3-crypto/poseidon"
	"github.com/iden3/go-merkletree-sql"
)

type verifyClaimCircuitInputs struct {
	Claim        *core.Claim `json:"claim"`
	SignatureR8X string      `json:"sigR8x"`
	SignatureR8Y string      `json:"sigR8y"`
	SignatureS   string      `json:"sigS"`
	PubKeyX      string      `json:"pubKeyX"`
	PubKeyY      string      `json:"pubKeyY"`
	ClaimSchema  string      `json:"claimSchema"`
	SlotIndex    int         `json:"slotIndex"`
	Operator     int         `json:"operator"`
	Value        []*big.Int  `json:"value"`
}

type signedClaim struct {
	Claim        *core.Claim `json:"claim"`
	SignatureR8X string      `json:"sigR8x"`
	SignatureR8Y string      `json:"sigR8y"`
	SignatureS   string      `json:"sigS"`
}

func main() {

	// // to generate a random private key
	// privKey := babyjub.NewRandPrivKey()

	var privKey babyjub.PrivateKey

	privKHex := "21a5e7321d0e2f3ca1cc6504396e6594a2211544b08c206847cdee96f832421a"

	hex.Decode(privKey[:], []byte(privKHex))

	X := privKey.Public().X
	Y := privKey.Public().Y

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

	// Define the query for the verifier
	// SlotIndex identifies the location inside the claim of the queried data
	// Values identifies the queried value
	// Operator 1 means "equals"
	query := circuits.Query{
		SlotIndex: 2,
		Values:    []*big.Int{new(big.Int).SetInt64(1)},
		Operator:  1,
	}

	q := make([]*big.Int, 63)
	for i := 0; i < 63; i++ {
		q[i] = big.NewInt(0)
	}

	values := append(query.Values, q...)

	// Issuer signs the claim
	claimSignature := privKey.SignPoseidon(commonHash.BigInt())
	// https://github.com/iden3/go-iden3-crypto/blob/master/babyjub/eddsa.go#L289
	// Signature used EdDSA hash schema

	circuitInputs := verifyClaimCircuitInputs{
		Claim:        orgMembershipClaim,
		SignatureR8X: claimSignature.R8.X.String(),
		SignatureR8Y: claimSignature.R8.Y.String(),
		SignatureS:   claimSignature.S.String(),
		PubKeyX:      X.String(),
		PubKeyY:      Y.String(),
		ClaimSchema:  orgMembershipClaim.GetSchemaHash().BigInt().String(),
		SlotIndex:    query.SlotIndex,
		Operator:     query.Operator,
		Value:        values,
	}

	signedClaimData := signedClaim{
		Claim:        orgMembershipClaim,
		SignatureR8X: claimSignature.R8.X.String(),
		SignatureR8Y: claimSignature.R8.Y.String(),
		SignatureS:   claimSignature.S.String(),
	}

	circuitInputsJSON, _ := json.Marshal(circuitInputs)
	signedClaimDataJSON, _ := json.Marshal(signedClaimData)

	fmt.Println(string(circuitInputsJSON))
	fmt.Println()
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

// TODO
// - create function to generate claim for issuer
// - create function to generateProof for holder