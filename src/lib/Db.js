import dotenv from 'dotenv'
dotenv.config()

// replace lowdb later with a proper DB
import lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

import Utils from './Utils'

const adapter = new FileSync(`${process.env.DB_PATH}/db.json`)
const db = lowdb(adapter)

db.defaults({ users: [] }).write()

const newUser = ({ phone }) => {
  const id = Utils.randomString(5)
  db.get(`users`)
    .push({
      id,
      phone,
      location: null,
      photos: [],
      orientation: null,
      battery: null,
    })
    .write()
  return id
}


const getUser = ({ userId }) => db.get(`users`).find({ id: userId }).value()

const addLocation = ({
  location,
  userId
}) => db.get(`users`)
  .find({ id: userId })
  .set(`location`, location)
  .write()

const setOrientation = ({
  orientation,
  userId
}) => db.get(`users`)
  .find({ id: userId })
  .set(`orientation`, orientation)
  .write()

const setBattery = ({
  battery,
  userId
}) => db.get(`users`)
  .find({ id: userId })
  .set(`battery`, battery)
  .write()

const addPhoto = ({
  photoURL,
  userId,
}) => {
  const photos = db.get(`users`)
    .find({ id: userId })
    .get(`photos`)
    .value()
  console.log(photos, typeof photos)
  return db.get(`users`)
    .find({ id: userId })
    .set(`photos`, [...photos, photoURL])
}

export default {
  getUser,
  addLocation,
  setOrientation,
  setBattery,
  addPhoto,
  newUser,
}