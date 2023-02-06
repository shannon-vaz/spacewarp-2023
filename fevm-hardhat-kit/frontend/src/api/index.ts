const API_URL = "http://localhost:5000/api";

export const generateClaim = async function (holder: string) {
  const data = {
    to: holder
  }
  return await fetch(`${API_URL}/generate-claim`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
}

export const generateProof = async function (holder: string, query: any) {
  const data = {
    ...query
  }
  return await fetch(`${API_URL}/generate-proof/${holder}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(json => json.proof)
}
