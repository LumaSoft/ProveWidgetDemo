const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const middleWare = require('../middleware/auth.middleware');
const apiHelper = require('../middleware/api.helper');

router.get('/', (req, res, next) => {
  res.render('main', {
    title: 'Prove Demo',    
    layout: 'public'
  });
});

router.post('/proveHumanCheckWebhook', (req, res, next) => {  
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
 
});

router.post('/createWidgetUrl', (req, res, next) => {  
  const uuid = req.body.uuid;
  // Call the API with the UUID and include your clientId and secret from the Prove Portal  
  fetch("https://proveapi.sparkwallet.io/api/auth/production/link/token/create", {
    method: "POST",
    body: JSON.stringify({
      clientId: <<your_clientID>>,
      secret:  <<Your_Secret>>,
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
});


module.exports = router;

