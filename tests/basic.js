'use strict'

const tap = require('tap')

const GoogleRecaptcha = require('../google-recaptcha')

// eslint-disable-next-line no-process-env
const TEST_SECRET = process.env.TEST_SECRET
const FAKE_SECRET = 'fake_secret_key'

const errors = {
  INCORRECT: new Error('Did not throw correct error.')
, NONE: new Error('Did not throw error.')
}

// Methods
function testError(error, expectedError) {
  if (!error) {
    throw errors.NONE
  }

  if (typeof expectedError === 'string' && error.message !== expectedError) {
    throw errors.INCORRECT
  }

  if (
     Array.isArray(expectedError)
  && error.message !== `Failed to verify: ${expectedError.join(', ')}`
  ) {
    throw errors.INCORRECT
  }
}

// Positives
tap.test('should throw missing secret key', (t) => {
  t.throws(() => {
    // eslint-disable-next-line no-new
    new GoogleRecaptcha()
  })

  t.end()
})

tap.test('should throw missing response object', (t) => {
  const googleRecaptcha = new GoogleRecaptcha({
    secret: FAKE_SECRET
  })

  googleRecaptcha.verify({}, (error) => {
    testError(error, 'Missing response object.')

    t.end()
  })
})

tap.test('should fail to verify due to invalid secret', (t) => {
  const googleRecaptcha = new GoogleRecaptcha({
    secret: FAKE_SECRET
  })

  const response = {}

  googleRecaptcha.verify({response}, (error) => {
    testError(error, [
      'missing-input-response'
    , 'invalid-input-secret'
    ])

    t.end()
  })
})

tap.test('should fail to verify due to missing response', (t) => {
  const googleRecaptcha = new GoogleRecaptcha({
    secret: TEST_SECRET
  })

  const response = {}

  googleRecaptcha.verify({response}, (error) => {
    testError(error, ['missing-input-response'])

    t.end()
  })
})

tap.test('should fail to verify due to invalid response', (t) => {
  const googleRecaptcha = new GoogleRecaptcha({
    secret: TEST_SECRET
  })

  const response = 'invalid response'

  googleRecaptcha.verify({response}, (error) => {
    testError(error, ['invalid-input-response'])

    t.end()
  })
})

// Negatives
tap.test('should make a new recaptcha instance', (t) => {
  // eslint-disable-next-line no-new
  new GoogleRecaptcha({
    secret: FAKE_SECRET
  })

  t.end()
})
