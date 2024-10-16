
const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const env = require('../../../config/environment');



module.exports.createSessions = async function (req, res) {

    try{
    let user = await User.findOne({email: req.body.email});

    if(!user || user.password != req.body.password){
        return res.json(422, {
            message: "Invaild Username or Password"
        });
    }

    return res.json(200, {
        message: "Sign in sucessfully, here is your token, please take it",
        data: {
            token: jwt.sign(user.toJSON(), env.jwt_secret, {expiresIn: '100000'})
        }
    });

}catch(err){
    console.log('******', err);
    return res.json(500, {
        message: "Internal Server Error"
    })
}
}