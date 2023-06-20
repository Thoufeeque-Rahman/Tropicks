var db = require('../config/connection')
var collection = require('../config/collection')
var bcrypt = require('bcrypt')
const {IMAGE_COLLECTION} = require("../config/collection");
const {ObjectId} = require("mongodb");


module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {

            let username = await db.get().collection(collection.USER_COLLECTION).findOne({username: userData.username})
            console.log(username)
            if (username) {
                resolve({ status: false })
            } else {
                userData.password = await bcrypt.hash(userData.password, 10)
                db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                    userData.status=true
                    resolve(userData)

                })


            }
        })

    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        console.log("login success");
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log("login Failed");
                        resolve({ status: false })
                    }
                })
            } else {
                console.log("login failed");
                resolve({ status: false })
            }
        })
    },
    
}