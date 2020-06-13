import dotenv from 'dotenv'
dotenv.config()

import axios from 'axios'

const { SMS_API } = process.env

const sendSMS = ({
  from,
  to,
  message
}) => axios.post(SMS_API, { from, to, message })

export default sendSMS