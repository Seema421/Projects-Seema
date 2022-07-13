//--------------------------Exports------------------------//
const jwt = require("jsonwebtoken");


//-------------------------------Authentication-------------------------//

const auth = async (req, res, next) => {
    try{
        let token = req.headers["x-api-key"]
        if(!token) token =req.headers['X-Api-Key'];
        if(!token) return res.status(401).send({status:false,msg:"Login Required"});
        //-----------decodedToken--------------//
        jwt.verify(token, "Project-3", (err, decoded) => {
            if (err) {
                return res.status(401).send({ status: false, message: err.message })
            } 
            else {
                req["Userid"] = decoded.Userid;
                next()
            }
        })
        
    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
}

//-----------------------Exports-----------------------//
module.exports={auth}


