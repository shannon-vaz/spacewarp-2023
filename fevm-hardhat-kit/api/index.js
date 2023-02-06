const express = require("express")
const routes = require("./routes.js")

const app = express()
const PORT = 5000
const baseURL = "/api"

app.use(express.json())

app.use(baseURL, routes)

app.use((req, res) => {
    return res.status(404).send({
        error: "not found",
    })
})

app.listen(PORT, () => {
    console.log("server started on port", PORT)
})
