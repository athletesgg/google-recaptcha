'use strict'

const debug = require('debug')
const request = require('request')

class GoogleRecaptcha {
  constructor(options) {
    options = options || {}

    if (!options.secret) {
      throw new Error('Missing secret key.')
    }

    this.secret = options.secret
    this.apiUrl = options.apiUrl || this.DEFAULT_API_URL
    this.logger = options.logger || debug('recaptcha')

    this.logger('Google Recaptcha initialized:', this.secret, this.apiUrl)
  }

  verify(options, callback) {
    const self = this

    options = options || {}

    const secret = self.secret
    const response = options.response
    const remoteip = options.remoteIp

    if (!response) {
      return callback && callback(new Error('Missing response object.'), null)
    }

    const form = {secret, response, remoteip}

    function handleResponse(error, response, body) {
      self.logger('Received POST response:', error, response.statusCode, body)

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
        return callback && callback(
          new Error(`Failed to verify: ${body['error-codes'].join(', ')}`)
        , body
        )
      }

      return callback && callback(null, body)
    }

    const requestOptions = {
      url: self.apiUrl
    , form
    , json: true
    }

    self.logger('Making POST request to Google:', requestOptions)

    request.post(requestOptions, handleResponse)
  }
}

GoogleRecaptcha.prototype
  .DEFAULT_API_URL = 'https://www.google.com/recaptcha/api/siteverify'

module.exports = GoogleRecaptcha
