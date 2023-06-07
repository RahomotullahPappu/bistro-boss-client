import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect } from "react";
import { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";


const CheckoutForm = ({ price }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [axiosSecure] = useAxiosSecure()
  const [cardError, setCardError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [processing, setProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState('');


  useEffect( () => {
    console.log(price);
      axiosSecure.post('/create-payment-intent', { price })
      .then(res => {
        console.log(res.data.clientSecret);
        setClientSecret(res.data.clientSecret);
      })
  },[])

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return
    }

    const card = elements.getElement(CardElement);
    if (card === null) {
      return
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card
    })

    if (error) {
      console.log('error', error);
      setCardError(error.message);
    }
    else {
      setCardError('');
      console.log('payment method', paymentMethod);
    }
  }


  // const { paymentIntent, error:confirmError } = await stripe.confirmCardPayment(
  //   clientSecret,
  //   {
  //     payment_method: {
  //       card: card,
  //       biling_details: {
  //         email: user?.email || 'unknown',
  //         name: user?.displayName || 'anonymous'
  //       },
  //     },
  //   },
  // );

  // if(confirmError){
  //   console.log(confirmError);
  // }
  // console.log(paymentIntent);



  useEffect(() => {
    
    setProcessing(true)

    const confirmPaymentIntent = async () => {
      if (clientSecret && stripe) {
        try {
          const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
            clientSecret,
            {
              payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                  email: user?.email || 'unknown',
                  name: user?.displayName || 'anonymous'
                }
              }
            }
          );

          if (confirmError) {
            console.log(confirmError);
          }
          console.log('payment intent', paymentIntent);
          setProcessing(false)
          if(paymentIntent.status === 'succeeded'){
            setTransactionId(paymentIntent.id);
            // const transactionId = paymentIntent.id;
            // TODO next steps
          }

        } 
        catch (error) {
          console.log('Error confirming payment:', error);
        }
      }
    };

    confirmPaymentIntent();
  
  }, []);
  // clientSecret, stripe, elements, user


  
  return (
    <>
      <form className="w-2/3 m-8" onSubmit={handleSubmit}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
        <button className="btn btn-primary mt-4 btn-sm" type="submit" disabled={!stripe || !clientSecret || processing}>
          Pay
        </button>
      </form>

      {cardError && <p className="text-red-600 ml-8">{cardError}</p> }
      {transactionId && <p className="text-green-600 ml-8">Transaction complete with transactionId: {transactionId}</p>}
    </>
  );
};

export default CheckoutForm;  