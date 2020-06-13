import express from 'express'
import bodyParser from 'body-parser'
import multer from 'multer'
import fs from 'fs'
import cors from 'cors'
import morgan from 'morgan'

import Db from './lib/Db'
import S3 from './lib/S3'
import SMS from './lib/SMS'

const upload = multer({ dest: 'uploads/' })

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(morgan('tiny'))

const endUserRoute = (req, res, next) => {
  if (!req.header(`User-Id`)) {
    res.status(400).send(`Missing User-Id header`)
  }
  next()
}

app.get(`/`, (req, res) => res.send(
  Db.addLocation({ userId: `1`, location: `s` }))
)

app.get(`/user/:userId`, (req, res) => res.json(
  Db.getUser({ userId: req.params.userId }))
)

// simulate incoming call
const simulateCall = async (req, res) => {
  const { number, fake } = req.body
  const userId = Db.newUser({ phone: number })

  if (!fake) { // because SMSes are expensive
    await SMS({
      to: `65${number}`,
      from: `SCDF`,
      body: `Please share your location with our 995 operator by pressing this link: https://scdf.tech/l/${userId}`
    })
  }

  return res.send(userId)
}
app.route(`/call`)
  .post(simulateCall)
  .options(simulateCall)

const receiveLocation = (req, res) => {
  const userId = req.header(`User-Id`)
  const { location } = req.body
  return res.json(Db.addLocation({ location, userId }))
}
app.route(`/location`)
  .put(endUserRoute, receiveLocation)
  .options(receiveLocation)

const receiveOrientation = (req, res) => {
  const userId = req.header(`User-Id`)
  const { orientation } = req.body
  return res.json(Db.setOrientation({ orientation, userId }))
}
app.route(`/orientation`)
  .put(endUserRoute, receiveOrientation)
  .options(receiveOrientation)

app.put(`/battery`, endUserRoute, (req, res) => {

})

const receivePhoto = async (req, res) => {
  if (!req.file || req.file.length === 0) {
    return res.status(400).send(`No file uploaded`)
  }

  const userId = req.header(`User-Id`)

  const { file } = req
  const fileData = fs.readFileSync(file.path)

  const url = await S3.uploadFile({
    fileName: file.filename,
    body: fileData
  })
  console.log(url)

  const result = await Db.addPhoto({
    userId,
    photoURL: url,
  })
  console.log(result)
  return res.send(url)
}
app.route(`/photo`)
  .post(endUserRoute, upload.single('photo'), receivePhoto)
  .options(receivePhoto)

app.listen(
  8000,
  () => console.log(`ACES Go Places server listening at port 8000`)
)