import React from 'react'
import StripeCheckout from 'react-stripe-checkout'
import axios from 'axios'
const stripeBtn = props => {
  const publishableKey = 'pk_test_LNFLm8rQEiYilbbqhXUX8Ogf00025ngOE8'

  const onToken = token => {
    const body = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':
          'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
      },
      amount: 999,
      token: token
    }

    axios({
      method: 'post',
      crossdomain: true,
      config: {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods':
            'GET, POST, PATCH, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
        }
      },
      url: 'http://54.146.20.242',
      data: body
    })
      .then(response => {
        // Success
        props.onSuccess()
      })
      .catch(error => {
        console.log('Payment Error: ', error)
        alert('Payment Error')
      })
  }
  return (
    <StripeCheckout
      label="Buy Model Conversions" //Component button text
      name="Infinite Red, Inc." //Modal Header
      description="Purchase 12 model conversions"
      panelLabel="12 Conversions" //Submit button in modal
      amount={999} //Amount in cents $9.99
      token={onToken}
      currency="USD"
      alipay // accept Alipay (default false)
      bitcoin // accept Bitcoins (default false)
      stripeKey={publishableKey}
      image="logo192.png" //Pop-in header image
      billingAddress={false}
    />
  )
}
export default stripeBtn
