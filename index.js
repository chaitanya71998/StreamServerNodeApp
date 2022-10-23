const express = require("express")
const app = express()
const port = 5000
var cors = require("cors")
let stream = require("getstream")

app.use(cors())
app.use(express.json())

const getStreamPOC = {
  API_KEY: "5nr74n2ybm7z",
  APP_ID: "1215105",
  API_SECRET:
    "37q398r9fn9h26w7f4canjjqcfwjzafgeb83nemqsbxyht7xjbybq6sw2gdmt2n8",
}

const getStreamPOC1 = {
  API_KEY: "dgmpkecxffef",
  API_SECRET:
    "9vbkm8zj7a7uqgee73szhp9znf5xvmfqnqvytbvc44ggz8ffephech6y6d3hsedq",
  APP_ID: "1215400",
}
const { API_KEY, API_SECRET, APP_ID } = getStreamPOC

const getClient = stream.connect(API_KEY, API_SECRET, APP_ID)

app.get("/", async (request, response) => {
  response.sendFile("index.html", { root: __dirname })
  try {
    response.send({ userToken: userToken })
  } catch (e) {
    response.send({ e })
  }
})

app.get("/getTokenFromUser/:user_name", async (request, response) => {
  // Instantiate a new client (client side)
  try {
    let client = getClient
    const { user_name } = request.params
    console.log(user_name, "username")

    let userToken = client.createUserToken(`${user_name}`)
    let user = client.user(user_name).getOrCreate({
      name: user_name,
      occupation: "Software Engineer",
      gender: "male",
    })

    response.send({ user_token: userToken })
  } catch (e) {
    console.log(e)
  }
})

app.post("/getUser/:user_name", async (request, response) => {
  // Instantiate a new client (client side)
  try {
    let client = getClient
    const { user_name } = request.params
    let user = client.get(`${user_name}`)
    response.send({ user })
  } catch (e) {
    console.log(e)
  }
})

app.post("/addBatchFeed/", async (request, response) => {
  try {
    let client = getClient

    const { data } = request.body

    const { activity, feeds_ist } = JSON.parse(JSON.parse(data))
    console.log(activity, "activity")

    const success = await client.addToMany(activity, feeds_ist)
    response.send({})
  } catch (e) {
    response.send(e)
  }
})

app.post("/hashtags/:hash_tag", async (request, response) => {
  // Instantiate a new client (client side)
  try {
    let client = getClient

    const { hash_tag } = request.params
    const { data } = request.body
    const { activity } = JSON.parse(JSON.parse(data))
    console.log(activity, "activity")
    let hashToken = client.createUserToken(`${hash_tag}`)
    client.user(hash_tag).update({
      name: hash_tag,
    }) // To add activities to hash tags
    hashtags = client.feed("hashtags", hash_tag, hashToken)
    const feeds = [`"hashtags":${hash_tag}`]
    const success = await client.addToMany(activity, feeds)
    response.send({ hash_tag: hashToken })
  } catch (e) {
    console.log(e)
  }
})

app.post("/mentions/:mention", async (request, response) => {
  // Instantiate a new client (client side)
  try {
    let client = getClient
    const { mention } = request.params
    console.log(mention, "activity")
    const { data } = request.body
    const { activity } = JSON.parse(JSON.parse(data))
    console.log(activity, "activity")
    // since mention user may or may not exist i was creating him again
    let mentionUser = client.createUserToken(`${mention}`)
    client.user(mention).update({
      name: mention,
    })
    mentionUser = client.feed("mentions", hash_tag, hashTag)
    const feeds = [`"mentions":${mention}`]
    const success = await client.addToMany(activity, feeds)
    response.send({ mention_token: mentionUser })
  } catch (e) {
    console.log(e)
  }
})

app.get("/followers/:user_name", async (request, response) => {
  // Instantiate a new client (client side)
  try {
    let client = getClient
    const { user_name } = request.params

    user1 = await client.feed("timeline", user_name)
    let followers = await user1.followers()
    response.send({ followers: followers })
  } catch (e) {
    console.log(e)
  }
})

app.get("/followings/:user_name", async (request, response) => {
  // Instantiate a new client (client side)
  try {
    let client = getClient
    const { user_name } = request.params

    user1 = await client.feed("timeline", user_name)
    let followings = await user1.following()
    response.send({ followings: followings })
  } catch (e) {
    console.log(e)
  }
})

app.get(
  "/follow/timeline/:user_name/:follow_user",
  async (request, response) => {
    // Instantiate a new client (client side)
    try {
      let client = getClient
      const { user_name, follow_user } = request.params

      user1 = await client.feed("notification", follow_user)
      await user1.follow("timeline", user_name)
      user2 = await client.feed("notification", follow_user)
      let followings = await user2.following({ limit: "10", offset: "0" })
      response.send({ followings: followings })
    } catch (e) {
      console.log(e)
    }
  }
)

app.get("/followStats/:user_name", async (request, response) => {
  // Instantiate a new client (client side)
  try {
    let client = getClient
    const { user_name } = request.params

    user1 = await client.feed("timeline", user_name)
    let followings = await user1.followStats()
    response.send({ followings: followings })
  } catch (e) {
    console.log(e)
  }
})

app.post(
  "/followRelationShip/:user_name/:feed_slug/:follow_user/:follow_feed_slug",
  async (request, response) => {
    try {
      const { user_name, feed_slug, follow_user, follow_feed_slug } =
        request.params
      console.log(feed_slug, user_name, follow_feed_slug, follow_user)
      const userFeed = getClient.feed(feed_slug, user_name)
      const userFeed1 = await userFeed.follow(follow_feed_slug, follow_user)
      response.send(userFeed1)
    } catch (e) {
      response.send(e)
    }
  }
)

app.post(
  "/unFollow/:user_name/:feed_slug/:unfollow_user/:unfollow_feed_slug",
  async (request, response) => {
    try {
      const { user_name, feed_slug, unfollow_user, unfollow_feed_slug } =
        request.params
      console.log(feed_slug, user_name, unfollow_user, unfollow_feed_slug)
      const userFeed = getClient.feed(feed_slug, user_name)
      const userFeed1 = await userFeed.unfollow(
        unfollow_feed_slug,
        unfollow_user
      )
      response.send(userFeed1)
    } catch (e) {
      response.send(e)
    }
  }
)

app.get(
  "/follow_Suggestions/:user_name/:feed_slug",
  async (request, response) => {
    try {
      const { user_name, feed_slug } = request.params
      const params = { user_id: user_name, feed_slug: feed_slug }
      await getClient.personalization
        .get("personalized_feed", params)
        .then((responsebody) => responsebody.json())
        .then((responseData) => {
          response.send(responseData)
        })
        .catch((e) => {
          response.send(e)
        })
    } catch (e) {
      response.send(e)
    }
  }
)
app.post("/addActivities", () => {})

app.listen(port, () => {
  //server starts listening for any attempts from a client to connect at port: {port}
  console.log(`Now listening on port ${port}`)
})
