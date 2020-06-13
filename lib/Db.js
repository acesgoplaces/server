// replace lowdb later with a proper DB

import lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

const adapter = new FileSync(`db.json`)
const db = lowdb(adapter)

const getUser = ({ userId }) => db.get(`users`).find({ id: userId }).value()

const addLocation = ({
  location,
  userId
}) => db.get(`users`)
  .find({ id: userId })
  .update(`locations`, locations => [...locations, location])
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
}) => db.get(`users`)
  .find({ id: userId })
  .update(`photos`, photos => [...photos, photoURL])
  .write()

export default {
  getUser,
  addLocation,
  setOrientation,
  setBattery,
  addPhoto
}