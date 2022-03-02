let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
const { User : db } = require('../config/db')

function createHash(userpass){
    return bcrypt.hash(userpass, 10, null)
}

function validPassword(user, userpass){
    console.log('user', user)
    console.log('userpass', userpass)
    return bcrypt.compareSync(userpass, user.userpass)
}

passport.use('signup', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'username',
    passwordField: 'userpass'
}, async (req, username, userpass, done) =>{
    
    try{ 
        let userData = await db.findOne({username : username}) // the second username comes as a param from routes
        // console.log(`DESDE PASSPORT signup ${userData}`)
        if(userData) {
            console.log(`El usuario ya existe!`)
            return done(null, false)
        }  else {
            let object = req.body
            object.userpass = await createHash(userpass)
            await db.create(object)
            let userData = await db.findOne({username : username})
            return done(null, userData) 
        }
    } 
    catch (err) {
        console.log('error al guardar el item ', err) 
    }
}))

passport.use('login', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'username',
    passwordField: 'userpass'
    }, async (req, username, userpass, done) =>{
       try{ 
        console.log(`Antes de la base de datos`)
        let userData = await db.findOne({username : username}) // the second username comes as a param from routes
        console.log('console log de user respuesta',userData)
        if(!validPassword(userData, userpass)){
            
            console.log('Invalid password')
            return done(null, false)
        }else{
            return done(null, userData)
        };
        } catch (err) {
            console.log(err)
        }
}))

const checkForAuth = (req, res, next) =>{
    if(req.isAuthenticated()){
        next()
    } else {
    res.redirect('/api/login')
    }
}


passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser((id, done) => {
    db.find({_id: id}, (err, user) => {
    done(null, user)
})
})

module.exports = checkForAuth;



////



// passport.serializeUser(function(user, done){
//     done(null, user.id)
//   }) 
  
//   passport.deserializeUser(function(id, done){
//     usersModel.findById(id).then(user => {
      
//       done(null, user)
//       })
//   })