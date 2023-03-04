
var admin = require("firebase-admin");
var serviceAccount = require("./boxtraders-firebase-adminsdk-77fki-876798336a.json");

const DEFAULT_REQUEST_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': '*/*',
};
const API_BASE_URL = "https://api.boxtraders.com/api"

const initFirebase = () => {
    try {
      return admin.getApp();
    } catch (e) {
      //@ts-ignore
      return admin.initializeApp({
        //@ts-ignore
        credential: admin.credential.cert(serviceAccount)
        //@ts-ignore        
      });
    }
};



module.exports = {
  DEFAULT_REQUEST_HEADERS, API_BASE_URL, initFirebase
}
