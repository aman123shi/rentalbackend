const paypal = require("@paypal/checkout-server-sdk");

// Creating an environment
let clientId =
  "ARz16vurh-I1DCFeNf1FPSG_1JnelI8ZHZcQB-871tcukXS2ny-Q2QOP1WcepBCjonJMPqB8m4l1y_Ur";
let clientSecret =
  "EK-iGOAtSsQbbyIuLwJ6ZvVPa8YJedz4EJb7K2E76Uu4uYz3zyqQViMk40dL_kAIA8WKRB707g9kJIac";

// This sample uses SandboxEnvironment. In production, use LiveEnvironment
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);
let request = new paypal.orders.OrdersCreateRequest();

app.post("/api/orders", async (req, res) => {
  let propertyType = req.body.propertyType;
  let propertyId = req.body.propertyId;
  let price = 100;
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        custom_id: "123abcd",
        amount: {
          currency_code: "USD",
          value: price,
        },
      },
    ],
    application_context: { return_url: "localhost:3000/api/orders/capture" },
  });
  let response = await client.execute(request);
  console.log(`Order: ${JSON.stringify(response.result)}`);
});

// capture payment & store order information or fullfill order
app.post("/api/orders/:orderID/capture", async (req, res) => {
  const { orderID } = req.params;
  const captureData = await capturePayment(orderID);
  // TODO: store payment information such as the transaction ID
});
