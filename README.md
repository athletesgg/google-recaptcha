# Google Recaptcha

[![Build Status](https://travis-ci.org/martin-experiments/google-recaptcha.svg?branch=master)](https://travis-ci.org/martin-experiments/google-recaptcha)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/d134a5d7d1504e30a0950878f897e076)](https://www.codacy.com/app/MartinExperiments/google-recaptcha?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=martin-experiments/google-recaptcha&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/d134a5d7d1504e30a0950878f897e076)](https://www.codacy.com/app/suitupalex/google-recaptcha?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=martin-experiments/google-recaptcha&amp;utm_campaign=Badge_Coverage)

A simple and framework agnostic way to verify Google Recaptcha data.
This package currently supports
[Google Recaptcha V2](https://developers.google.com/recaptcha/intro).

## Installation

```bash
$ yarn add google-recaptcha
```

## Usage

```js 
const GoogleRecaptcha = require('google-recaptcha')

const googleRecaptcha = new GoogleRecaptcha({secret: 'RECAPTCHA_SECRET_KEY'})

// Some pseudo server code:

http.on('POST', (request, response) => {
  const recaptchaResponse = request.body['g-recaptcha-response']

  googleRecaptcha.verify({response: recaptchaResponse}, (error) => {
    if (error) {
      return response.send({isHuman: false})
    }

    return response.send({isHuman: true})
  })
})
```

### Methods and Variables

#### constructor(*Object* options)

Creates an instance of the Google Recaptcha verifier. Here are the options:

* *String* `secret` (required): Your Google Recaptcha secret key.
* *String* `apiUrl`: The API URL to verify with. This option defaults to
  `GoogleRecaptcha.DEFAULT_API_URL`.
* *Object* `logger`: Any `console.log` compatible logger. Defaults to using
  the [debug](https://npmjs.org/package/debug) package. The `debug` namespace is
  `recaptcha`.

#### googleRecaptcha.verify(*Object* options, *Function* callback)

Runs a verification of the Recaptcha response. Here are the options:

* *String* `response` (required): The Recaptcha response token.
* *String* `remoteIp`: The user's IP address.

The callback can take an *Error* `error` as its first parameter and a *Object*
body as its second parameter. The body is a raw response from the Recaptcha
verification.
[Specific details can be found here.](https://developers.google.com/recaptcha/docs/verify)

#### *Static String* GoogleRecaptcha.DEFAULT_API_URL

The default API URL to verify with. The value is
https://www.google.com/recaptcha/api/siteverify.

### License

Copyright (c) 2016 Martin Experiments LLC

MIT (http://www.opensource.org/licenses/mit-license.php)
