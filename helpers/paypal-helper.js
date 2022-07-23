const paypal = require("@paypal/checkout-server-sdk");

// Creating an environment
let clientId =
  "ARz16vurh-I1DCFeNf1FPSG_1JnelI8ZHZcQB-871tcukXS2ny-Q2QOP1WcepBCjonJMPqB8m4l1y_Ur";

let clientSecret =
  "EK-iGOAtSsQbbyIuLwJ6ZvVPa8YJedz4EJb7K2E76Uu4uYz3zyqQViMk40dL_kAIA8WKRB707g9kJIac";

// This sample uses SandboxEnvironment. In production, use LiveEnvironment
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

// Construct a request object and set desired parameters
// Here, OrdersCreateRequest() creates a POST request to /v2/checkout/orders
let request = new paypal.orders.OrdersCreateRequest();
module.exports.Request = request;
module.exports.Client = client;
request.requestBody({
  intent: "CAPTURE",
  purchase_units: [
    {
      amount: {
        currency_code: "USD",
        value: "100.00",
      },
    },
  ],
});

// Call API with your client and get a response for your call
let createOrder = async function () {
  let response = await client.execute(request);
  console.log(`Response: ${JSON.stringify(response)}`);

  // If call returns body in response, you can get the deserialized version from the result attribute of the response.
  console.log(`Order: ${JSON.stringify(response.result)}`);
};
createOrder();

let captureOrder = async function (orderId) {
  request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});
  // Call API with your client and get a response for your call
  let response = await client.execute(request);
  console.log(`Response: ${JSON.stringify(response)}`);
  // If call returns body in response, you can get the deserialized version from the result attribute of the response.
  console.log(`Capture: ${JSON.stringify(response.result)}`);
};

let capture = captureOrder("REPLACE-WITH-APPROVED-ORDER-ID");
