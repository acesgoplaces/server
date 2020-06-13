import express from 'express'
import bodyParser from 'body-parser'
import multer from 'multer'
import fs from 'fs'

import Db from './lib/Db'
import S3 from './lib/S3'

const upload = multer({ dest: 'uploads/' })

const app = express()
app.use(bodyParser.json())

// app.use((req, res, next) => {
//   if (!req.header(`User-Id`)) {
//     res.status(400).send(`Missing User-Id header`)
//   }
//   next()
// })

app.get(`/`, (req, res) => res.send(
  Db.addLocation({ userId: `1`, location: `s` }))
)

app.post(`/new`, (req, res) => {
  const userId = Db.newUser()
  return res.send(userId)
})

app.post(`/location`, (req, res) => {
  // const userId = req.header(`User-Id`)
  const userId = `1`

  const { location } = req.body
  return res.json(Db.addLocation({ location, userId }))
})

app.put(`/orientation`, (req, res) => {
  const { orientation } = req.body
  return res.json(Db.setOrientation({ orientation, userId }))
})

app.put(`/battery`, (req, res) => {

})

app.post(`/photo`, upload.single('photo'), async (req, res) => {
  if (!req.file || req.file.length === 0) {
    return res.status(400).send(`No file uploaded`)
  }

  const { file } = req
  const fileData = fs.readFileSync(file.path)

  const url = await S3.uploadFile({
    fileName: file.filename,
    body: fileData
  })

  await Db.addPhoto({
    userId: `1`,
    photoURL: url,
  })
  return res.send(url)
})

app.listen(
  8000,
  () => console.log(`ACES Go Places server listening at port 8000`)
)