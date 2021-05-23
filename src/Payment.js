import {React,useState,useEffect} from 'react';
import CheckProduct from './CheckoutProduct';
import './Payment.css';
import {Link,useHistory} from "react-router-dom";
import {useStateValue} from "./StateProvider";
import {CardElement,useStripe,useElements} from "@stripe/react-stripe-js"

import axios from "./axios";
import CurrencyFormat from "react-currency-format";
import {getBasketTotal} from "./reducer";

function Payment() {
   const [{ basket,user},dispatch]=useStateValue();
   const history = useHistory();

   const stripe= useStripe();
   const elements = useElements();

   const [succeeded, setSucceeded] = useState(false);
   const [processing, setProcessing] = useState("");
   const[error,setError]=useState(null);
   const[disabled,setDisabled]=useState(true);
   const [clientSecret, setClientSecret] = useState(true);

   useEffect(() => {
    const getClientSecret = async () => {
        const response = await axios({
            method: 'post',
            url: `/payments/create?total=${getBasketTotal(basket) * 100}`
        });
        setClientSecret(response.data.clientSecret)
    }

    getClientSecret();
}, [basket])




   const handleSubmit= async (event)=>{
               event.preventDefault();
               setProcessing(true);
            
          const payload=await stripe.confirmCardPayment(clientSecret,{
            payment_method:{
              card: elements.getElement(CardElement)
            }
          }
          ).then(({paymentIntent})=>{
          setSucceeded(true);
          setError(null);
          setProcessing(false);

          history.replace('/orders')
          })
   }

   const handleChange=event=>{
       setDisabled(event.empty);
       setError(event.error? event.error.message: "") ;


   }

    return (
        <div className='payment'>
           <div className='payment__continer'>
               <h1>
                   Checkout(
                       <Link to="checkout">{basket?.length} items</Link>
                   )
               </h1>

              <div className='payment__section'>
                    <div className='payment__title'>
                        <h3>Delivery Address</h3>
                    </div>
                    <div className='payment__address'>
                      <p>{user?.email}</p>
                      <p>123 React Lane</p>
                      <p> Los Angeles, CA</p>
                    </div>
              </div>
              <div className='payment__section'>
                 <div className='payment__title'>
                   <h3>Review items and delivery</h3>
                 </div>
                 <div className='payment__items'>
                     {basket.map(item=> (
                       <CheckProduct
                         id={item.id}
                         title={item.title}
                         image={item.image}
                         price={item.price}
                         rating={item.rating}
                       />
                     ))}
                 </div>
              </div>
              <div className='payment__section'>
                    <div className="payment__title">
                       <h3>Payment Method</h3>
                    </div>
                    <div className="payment__details">
                       <form onSubmit={handleSubmit}>
                           <CardElement onClick={handleChange} />
                           <div className="payment__priceContainer">
                             <CurrencyFormat
                               renderText={(value)=>(
                                   <>
                                   <h3>Order Total: {value}
                                   </h3>
                                   </>
                                  )
                               }
                               decimalScale={2}
                               value={getBasketTotal(basket)} // Part of the homework
                               displayType={"text"}
                               thousandSeparator={true}
                               prefix={"$"}
                             />
                             <button disabled={processing || disabled || succeeded}>
                                 <span >{processing ? <p> Processing</p> :
                                        "Buy Now"
                                 }</span>
                             </button>
                           </div>
                           { error && <div>{error}</div>}
                       </form>
                    </div>
              </div>
            </div> 
        </div>
    )
}

export default Payment
