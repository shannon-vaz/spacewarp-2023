# Know your Storage Provider (SP)

Issue claims to SPs that can be verified on-chain on the filecoin network

## Parties Involved

### Issuer (Trusted authority)

- Clients trust credentials issued by the Issuer
- Verifies info about SPs on filecoin network
- Issues claims to SPs e.g. Geolocation claim, Reliability score, Compliance
  claims (GDPR, HIPAA)
- Format of claims (claim schema) is published by Issuer on filecoin
- How to incentivize Issuer? **- TBD**

### Holder (SP)

- SPs receive claims about them from Issuers
- SPs can prove facts about them, derived from info from claims, that can be
  verified on-chain by any actor
- This allows SP to prove any fact about themself to clients on-chain
- Example: SPs could sign up for a consortium of SPs that accept SPs with
  certain verified facts about them 

### Verifier (Clients)
- Clients looking for SPs can filter out potential SPs by requesting SPs to
  requesting proofs of facts about them
- A sample proof request could be:
  - I am looking for Storage Provider with
    - Compliance claim issued by Issuer X
    - Reliability score issued by Issuer Y
    - Geolocation claim issued by Issuer X

## Flows

1. Identity creation for Issuer, SP, Verifier
2. Claim issuance to SP
3. Proof request on chain
3. On-chain proof verification
