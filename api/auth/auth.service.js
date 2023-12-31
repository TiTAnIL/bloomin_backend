const Cryptr = require('cryptr')
const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')
const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')

 const fakeUser = {
     _id: 'fakeUserId',
     username: 'titan',
     fullname: 'titnt2020',
   };


async function login(username, password) {
    console.log('auth.service - login')
    logger.debug(`auth.service - login with username: ${username}`)

    const user = await userService.getByUsername(username)
    if (!user) return Promise.reject('Invalid username or password')
    // TODO: un-comment for real login
    // const match = await bcrypt.compare(password, user.password)
    // if (!match) return Promise.reject('Invalid username or password')

    delete user.password
    user._id = user._id.toString()
    return user
}

// (async ()=>{
//     await signup('bubu', '123', 'Bubu Bi')
//     await signup('mumu', '123', 'Mumu Maha')
// })()
    

async function signup({username, password, fullname, imgUrl}) {
    console.log('auth.service - signup')
    const saltRounds = 10

    logger.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`)
    if (!username || !password || !fullname) return Promise.reject('Missing required signup information')

    const userExist = await userService.getByUsername(username)
    if (userExist) return Promise.reject('Username already taken')

    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({ username, password: hash, fullname, imgUrl })
}


function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))    
}

function validateToken(loginToken) {
     console.log('loginToken:', loginToken)
    try {
        const fakeToken = getLoginToken(fakeUser);
        // console.log('Fake Token:', fakeToken);
        // const json = cryptr.decrypt(loginToken)
         const json = cryptr.decrypt(fakeToken)
        const loggedinUser = JSON.parse(json)
        // console.log('fake loggedInUser:', loggedinUser)
        return loggedinUser

    } catch(err) {
        console.log('Invalid login token', err)
    }
    return null
}


module.exports = {
    signup,
    login,
    getLoginToken,
    validateToken
}