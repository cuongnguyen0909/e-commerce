
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import { memo, useEffect } from "react";
import { apiCreateOrder } from "../../apis";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import path from "../../ultils/path";
// This value is from the props in the UI
const style = { "layout": "horizontal" };

// Custom component to wrap the PayPalButtons and show loading spinner
const ButtonWrapper = ({ currency, showSpinner, amount, payload, setIsSucceed }) => {
    const navigate = useNavigate();
    const [{ isPending, options }, dispatch] = usePayPalScriptReducer();
    useEffect(() => {
        dispatch({
            type: "resetOptions",
            value: {
                ...options,
                currency
            },

        })
    }, [currency, showSpinner])
    const handleSaveOrder = async () => {
        const response = await apiCreateOrder(payload);
        if (response.status) {
            setIsSucceed(true)
            Swal.fire({
                icon: 'success',
                title: 'Order Success',
                text: 'Thank you for your order',
                confirmButtonText: 'Go to Home',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(`/${path.HOME}`)
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    navigate(`/${path.MEMBER}/${path.MY_ORDER}`)
                }
            })
        }
    }
    return (
        <>
            {(showSpinner && isPending) && <div className="spinner"></div>}
            <PayPalButtons
                style={style}
                disabled={false}
                forceReRender={[style, currency, amount]}
                fundingSource={undefined}
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    currency_code: currency,
                                    value: amount,
                                },
                            },
                        ]
                    }).then(orderID => orderID)
                }}
                onApprove={(data, actions) => {
                    return actions.order.capture().then(async (response) => {
                        if (response.status === "COMPLETED") {
                            handleSaveOrder();
                        }
                    });
                }}
            />
        </>
    );
}

const PayPal = ({ amount, payload, setIsSucceed }) => {
    return (
        <div style={{ maxWidth: "750px", minHeight: "200px" }}>
            <PayPalScriptProvider options={{ clientId: "test", components: "buttons", currency: "USD" }}>
                <ButtonWrapper setIsSucceed={setIsSucceed} payload={payload} curreny={'USD'} amount={amount} />
            </PayPalScriptProvider>
        </div>
    );
}

export default PayPal