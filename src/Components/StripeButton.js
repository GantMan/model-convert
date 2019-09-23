import React from 'react'
import StripeCheckout from 'react-stripe-checkout'
import axios from 'axios'
const stripeBtn = () => {
  const publishableKey = 'pk_test_LNFLm8rQEiYilbbqhXUX8Ogf00025ngOE8'

  const onToken = token => {
    const body = {
      amount: 999,
      token: token
    }
    axios
      .post('http://localhost:8000/payment', body)
      .then(response => {
        console.log(response)
        alert('Payment Success')
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
