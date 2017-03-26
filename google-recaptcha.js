'use strict'

const debug = require('debug')
const request = require('request')

class GoogleRecaptcha {
  constructor({
    apiUrl
  , secret
  , logger
  }) {
    if (!secret) {
      throw new Error('Missing secret key.')
    }

    this.secret = secret
    this.apiUrl = apiUrl || this.DEFAULT_API_URL
    this.logger = logger || debug('recaptcha')

    this.logger('Google Recaptcha initialized:', this.secret, this.apiUrl)
  }

  verify({
    response
  , remoteIp
  }, callback) {
    const secret = this.secret

    if (!response) {
      return callback && callback(new Error('Missing response object.'), null)
    }

    const form = {secret, response, remoteip: remoteIp}

    const requestOptions = {
      url: this.apiUrl
    , form
    , json: true
    }

    this.logger('Making POST request to Google:', requestOptions)

    request.post(requestOptions, (error, response, body) => {
      this.logger('Received POST response:', error, response.statusCode, body)

      if (error) {
        return callback && callback(error, null)
      }

      if (response.statusCode !== 200) {
        return callback && callback(
          new Error(`Bad response code: ${response.statusCode}`)
        , null
        )
      }

      if (!body.success) {
        const errorCodes = body['error-codes']

        const errorCodesList = Array.isArray(errorCodes) 
          ? errorCodes.join(', ')
          : 'Unknown'

        return callback && callback(
          new Error(`Failed to verify: ${errorCodesList}`)
        , body
        )
      }

      return callback && callback(null, body)
    })
  }
}

GoogleRecaptcha.prototype
  .DEFAULT_API_URL = 'https://www.google.com/recaptcha/api/siteverify'

module.exports = GoogleRecaptcha
