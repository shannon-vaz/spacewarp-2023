const express = require("express")
const routes = require("./routes.js")
const cors = require("cors")

const app = express()
const PORT = 5000
const baseURL = "/api"

app.use(express.json())
app.use(cors())

app.use(baseURL, routes)

app.use((req, res) => {
    return res.status(404).send({
        error: "not found",
    })
})

app.listen(PORT, () => {
    console.log("server started on port", PORT)
})
