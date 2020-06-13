import express from 'express'
import bodyParser from 'body-parser'
import multer from 'multer'

import Db from './lib/Db'

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

app.post(`/location`, (req, res) => {
  // const userId = req.header(`User-Id`)
  const userId = `1`

  const { location } = req.body
  return res.json(Db.addLocation({ location, userId }))
})

app.post(`/orientation`, (req, res) => {
  const { orientation } = req.body
  return res.json(Db.setOrientation({ orientation, userId }))
})

app.post(`/battery`, (req, res) => {

})

app.post(`/photo`, upload.single('photo'), (req, res) => {
  console.log(req.file)
  if (!req.file) {
    return res.status(400).send(`No file uploaded`)
  }
  return res.send(`ok`)
})

app.listen(
  8000,
  () => console.log(`ACES Go Places server listening at port 8000`)
)