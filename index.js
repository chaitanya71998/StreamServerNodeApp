// const express = require("express")
// const app = express()

// app.listen(3001)

const express = require("express") //Import the express dependency
const app = express() //Instantiate an express app, the main work horse of this server
const port = 5000 //Save the port number where your server will be listening
let stream = require("getstream")
app.use(express.json())
//Idiomatic expression in express to route and respond to a client request
app.get("/", (req, res) => {
  //get requests to the root ("/") will route here
  res.sendFile("index.html", { root: __dirname }) //server responds by sending the index.html file to the client's browser
  //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile
})

app.get("/getTokenFromUser", async (request, response) => {
  // Instantiate a new client (client side)
  try {
    let client = stream.connect(
      "wwfzfuma9356",
      "ts9ke7dw3kqzzfq3z6zzwv8pedhhfd68m7vj6xkxywb3mbs4myhwwk76qrpjudau",
      "1209187"
    )
    const { userName } = request
    // Find your API keys here https://getstream.io/dashboard/
    let userToken = client.createUserToken(userName)

    response.send({ user_token: userToken })
  } catch (e) {}
})

app.post("/addBatchFeed", async (request, response) => {
  try {
    let client = stream.connect(
      "wwfzfuma9356",
      "ts9ke7dw3kqzzfq3z6zzwv8pedhhfd68m7vj6xkxywb3mbs4myhwwk76qrpjudau",
      "1209187"
    )
    const feeds = ["codingPractice:cp_1"]
    const { activity } = request.body
    const success = await client.addToMany(activity, feeds)
    response.send({})
  } catch (e) {}
})
app.listen(port, () => {
  //server starts listening for any attempts from a client to connect at port: {port}
  console.log(`Now listening on port ${port}`)
})
