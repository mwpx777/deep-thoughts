// generate JWT - JSON Web Token

const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhhh';
const expiration = '2h'

module.exports = {
    signToken: function({username, email, _id}){
        const payload = {username, email, _id}

        return jwt.sign({data: payload}, secret, {expiresIn: expiration});
    },
    authMiddleware : function({req}) {
        // allowes token to be sent via req.body, req.query, or headers
        let token= req.body.token || req.query.token ||req.headers.authorization;

        // separate "Bearer" from "<tokenvalue>"
        if(req.headers.authorization) {
            token = token
            .split(' ')
            // .pop removes last element and returns it
            .pop()
            .trim();
        }

        // if no token, return request as is
        if(!token){
            return req;
        }

        try{
            // decode and attach user data to request object
            // if secret on jwt.verify doesn't match secrect from jwt.sign(), the object won't be decoded
            const {data} =jwt.verify(token, secret, {maxAge:expiration});
            req.user = data;
        }catch{
            // this will mute the 'Invalid Token' error so user doesn't see it if token is invalid
            console.log('Invalid Token');
        }
        // return updated request object
        return req;
    }
};