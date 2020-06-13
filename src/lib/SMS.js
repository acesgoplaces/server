import dotenv from 'dotenv'
dotenv.config()

import axios from 'axios'

const { SMS_API } = process.env

const sendSMS = ({
  from,
  to,
  body
}) => axios.post(SMS_API, { from, to, body })

export default sendSMS