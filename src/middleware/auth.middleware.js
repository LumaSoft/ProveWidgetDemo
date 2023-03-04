const { response } = require('express');
const { getAuth } = require('firebase-admin/auth');
const apiHelper = require('../middleware/api.helper');

// middleware to check cookie
function checkCookieMiddleware(req, res, next) {

	const sessionCookie = req.cookies.__session || '';

	getAuth().verifySessionCookie(
		sessionCookie, true).then((decodedClaims) => {
			req.decodedClaims = decodedClaims;
			next();
		})
		.catch(error => {
			// Session cookie is unavailable or invalid. Force user to login.
            // return res.status(httpCodes.FORBIDDEN).json({ error_code: e.message || 'forbidden', message: 'Error validating access token. User is not authorized to access this resource.' });
			res.redirect('/');
		});
}

async function verifyTokens(req, res, next) {

try {
	
	const tokens = await apiHelper.refreshToken(req.cookies.access_token, req.cookies.refresh_token);
	
	req.access_token =  tokens.accessToken;
    req.refresh_token = tokens.refreshToken;

	const expiresIn = 60 * 60 * 24 * 5 * 1000;
	const options = {maxAge: expiresIn, httpOnly: true, secure: true, path: '/'};
	res.cookie('access_token', tokens.accessToken, options);
	res.cookie('refresh_token', tokens.refreshToken, options);

	next()

}catch (error){
	console.error(error);	
	
	if (error.response){
		if (error.response.status == 401 || error.response.status == 403) {
			// it is not possible refresh token
			response.redirect("/")
		}else{
			//show the error on the client
		}
	}
	
	
}
    	
}

module.exports = {
    checkCookieMiddleware, verifyTokens
}