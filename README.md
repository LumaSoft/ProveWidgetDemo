
# Unique Trust Check JavaScript and Node.js Example

This demo project provides a code example that allows developers to integrate Prove's Unique Trust Check feature into their own applications. It is intended as a learning tool for developers who are using Prove's service in their own projects.

However, it's important to note that in order to run the demo project, developers will need to input their own API keys, which can be obtained at (add url here). API keys are a set of access credentials that allow developers to authenticate and interact with Prove's Unique Trust Check service.

In summary, the demo project provides a useful resource for developers who want to learn how to integrate Prove's Unique Trust Check into their applications. However, developers will need to obtain their own API keys in order to use the service in their own projects.

## Running the Project

To run the project you must:

1. Run npm i in the terminal of the project folder
2. Add your clientId and secret keys under the function /createWidgetUrl in public.js
3. Run nodemon in the terminal of the project folder

## Documentation

Step #1:
- Create a server side API to retrieve the widget publicToken

```javascript
fetch("https://proveapi.sparkwallet.io/api/auth/production/link/token/create", {
  method: "POST",
  body: JSON.stringify({
    <<your_clientID>>,
    <<Your_Secret>>,
    user: {
        uuid: uuid
    },
    product: "human_check"
  }),
  headers: {
    "Content-Type": "application/json"
  }
})
.then(response => response.json())
.then(data => {
  //use the publicToken returned to pass into the widget
  const publicToken = data.publicToken;
  
  res.send(publicToken);
})
.catch(error => {
  console.error(error);
  res.status(500).send(error);
});
```

Step #2:
- Include shim.js in your HTML page

```javascript
<head>
<script src="https://cdn.sparkwallet.io/shim.js"></script>
</head>

```

Step #3:
- Call your server side API that returns the publicToken and pass it into widget publicToken field

```javascript
if (window.VerifyWithProve && publicToken) {
    window.VerifyWithProve.open({
        publicToken: publicToken,
        onSuccess: () => {
            //User has been successfully verified
            window.VerifyWithProve.closeWidget()
            swal("Verified!", "You have been successfully verified!", {
                icon : "success",
                buttons: {
                    confirm: {
                        text: "Continue",
                        value: true,
                        visible: true,
                        className: "btn btn-success",
                        closeModal: true
                    }
                }
            })
        },
        onFailure: () => {
            //Display a error message letting the user know that they failed the check
            alert('Auth Failed - We are unable to verify you are a human.')
        },
        onExit: () => {
            $("#btnProveDemo").removeClass("is-loading").removeClass("disabled"); 
        }
    });
} else {
    // not ready yet
    console.log("not ready yet")
}
```

Step #4:
- Create a webhook to listen for if the user has been successfully verified
- Webhook must be signed

Signature validation example
```javascript
const crypto = require('crypto');

function authenticateWebhook(url, requestBody, signature) {
  const isValid = verifyRequestSignature(url, requestBody, signature);
  return isValid;
}

function verifyRequestSignature(url, requestBody, webhookSignature) {
  const requestSignature = webhookSignature;
  const requestSignatureBuffer = Buffer.from(requestSignature, 'utf8');
  const contentSignature = calcSignature(url, requestBody);
  const contentSignatureBuffer = Buffer.from(contentSignature, 'utf8');
  return crypto.timingSafeEqual(requestSignatureBuffer, contentSignatureBuffer);
}

function calcSignature(url, data = '') {
  const payload = data !== "" ? JSON.stringify(data) : '';
  const dataToBeSigned = Buffer.from(url + payload);
  const hmac = crypto.createHmac('sha256', PROVE_PORTAL_API_SECRET);
  return hmac.update(dataToBeSigned).digest('hex').toUpperCase();
}
````

**SUCCESS RESPONSE**
```javascript
{
    "webhookType": "HUMAN_CHECK,
    "webhookCode": "STATUS_UPDATED",
    "identityVerificationId": "idv_52xR9LKo77r1Np",
    "verified": true,
    "env": "production" //"production" || "sandbox"
}
````

 
**FAILURE RESPONSE**
```javascript
{
    "webhookType": "HUMAN_CHECK",
    "webhookCode": "STATUS_UPDATED",
    "identityVerificationId": "idv_52xR9LKo77r1Np",
    "verified": false,
    "failureReason": "", //interpeted reason code for Pre-fill (otherwise, just string value)
    "env": "production"
}
````

Webhook Integration Example
```javascript
let webhook_type = req.body.webhook_type;
let webhook_code = req.body.webhook_code;
let user_uuid = req.body.user_uuid;
let verified = req.body.verified;
let environment = req.body.environment;

if(verified == true){
  //User has been successfully verified
}else{
  //User is not valid
}
```

