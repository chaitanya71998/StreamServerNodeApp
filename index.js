const express = require("express")
const app = express()
const port = 5000
var cors = require("cors")
let stream = require("getstream")

app.use(cors())
app.use(express.json())

app.get("/", (request, response) => {
  res.sendFile("index.html", { root: __dirname })
})

app.post("/getTokenFromUser/", async (request, response) => {
  // Instantiate a new client (client side)
  try {
    let client = stream.connect(
      "wwfzfuma9356",
      "ts9ke7dw3kqzzfq3z6zzwv8pedhhfd68m7vj6xkxywb3mbs4myhwwk76qrpjudau",
      "1209187"
    )
    const { data } = request.body
    const { user_name } = JSON.parse(JSON.parse(data))
    console.log(user_name, "username")

    let userToken = client.createUserToken(`${user_name}`)

    // to make user follow the coding practice
    userFeed = client.feed("timeline", user_name, userToken)
    await userFeed.follow("codingPractice", "cp_1")

    response.send({ user_token: userToken })
  } catch (e) {
    console.log(e)
  }
})

app.post("/addBatchFeed/", async (request, response) => {
  try {
    let client = stream.connect(
      "wwfzfuma9356",
      "ts9ke7dw3kqzzfq3z6zzwv8pedhhfd68m7vj6xkxywb3mbs4myhwwk76qrpjudau",
      "1209187"
    )
    const feeds = ["codingPractice:cp_1"]
    const { data } = request.body

    const { activity } = JSON.parse(JSON.parse(data))
    console.log(activity, "activity")

    const success = await client.addToMany(activity, feeds)
    response.send({})
  } catch (e) {
    response.send(e)
  }
})

app.listen(port, () => {
  //server starts listening for any attempts from a client to connect at port: {port}
  console.log(`Now listening on port ${port}`)
})
