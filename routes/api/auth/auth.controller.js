const jwt = require('jsonwebtoken')
const User = require('../../../models/user')
/*
    POST /api/auth/register
    {
        username,
        password
    }
*/
exports.register = (req, res) => {
    const {username, password} = req.body;
    console.log('user info > ',username,password)
    let newUser = null;

    const create = (user)=>{
        if(user){
            throw new Error('username exists!')
        }else{
            return User.create(username,password);
        }
    }

    const count = (user)=>{
        newUser = user;
        return User.count({}).exec();
    }

    const assign = (count)=>{
        console.log('count',count);
        if(count===1){
            return newUser.assignAdmin()
        }else{
            return Promise.resolve(false)
        }
    }
    const respond =(isAdmin)=>{
        res.json({
            message :'registered successfully',
            admin : isAdmin?true:false
        })
    }
    const onError =(error) =>{
        res.status(409).json({
            message : error.message
        })
    }
    User.findOneByUsername(username)
    .then(create)
    .then(count)
    .then(assign)
    .then(respond)
    .catch(onError);
}

/*
    POST /api/auth/login
    {
        username,
        password
    }
*/
/*
    JWT options
    options
        algorithm : HS2156[Default]
        expiresIn : exp 값을 x초 후, rauchg/ms 형태로 설정
                    (60,2 days, 10h, 7d)
        notbefore : nbf를 x초 후 또는 rauchg/ms 형태로 설졍
        audience
        issuer
        jwtid
        subject
        noTimestamp
        header
*/
//jwt.sign(payload, secret, options, [callback](err,token) =>{})
exports.login =(req,res)=>{
    const {username, password} = req.body
    const secret = req.app.get('jwt-secret');
    const check =(user) =>{
        if(!user){
            throw new Error('loogin failed!')
        }else{
            console.log(user,'인증하냐???',user.verify(password,user.password))
            if(user.verify(password,user.password)){
                const p = new Promise((resolve,reject)=>{
                    jwt.sign(
                        {
                            _id : user._id,
                            username : user.username,
                            admin : user.admin
                        },
                        secret,
                        {
                            expiresIn:'7d',
                            issuer :'velopert.com',
                            subject :'userInfo'
                        },(err,token)=>{
                            if(err){
                                reject(err)
                            }
                            resolve(token);
                        }
                    )
                })
                return p;
            }else{
                throw new Error('login failed')
            }
        }
    }
    const respond = (token) =>{
        res.json({
            message : 'logged in successfully',
            token : token
        })
    }
    const onError = (error)=>{
        res.status(403).json({
            message : error.message
        })
    }
    User.findOneByUsername(username)
    .then(check)
    .then(respond)
    .catch(onError)
}
/*
    GET /api/auth/check
*/
exports.check =(req,res)=>{
    res.json({
        success : true,
        info : req.decoded 
    })
}

// {    //read the token from header or url
//     const token = req.headers['x-access-token'] || req.query.token

//     //token does not exist
//     if(!token){
//         return res.status(403).json({
//             success : false,
//             message : 'login auth fail!'
//         })
//     }

//     //create a promise that decodes the token
//     const p = new Promise(
//         (resolve,reject)=>{
//             jwt.verify(token,req.app.get('jwt-secret'),(err,decoded)=>{
//                 if(err){
//                     reject(err)
//                 }
//                 resolve(decoded)
//             })
//         }
//     )
//     //if token is valid, it will respond with its info
//     const respond =(token) =>{
//         res.json({
//             success : true,
//             info : token
//         })
//     }
//     //if it has failed to verify, it will return an error message
//     const onError =(error) =>{
//         res.status(403).json({
//             success : false,
//             message : error.message
//         })
//     }

//     //process the promise
//     p.then(respond)
//     .catch(onError);
// }
