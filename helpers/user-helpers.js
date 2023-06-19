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
    addImage: async (_id, imageData, callback)=>{
        // console.log(product);
        if(_id){
            let user = await db.get().collection(IMAGE_COLLECTION).findOne({_id:_id})
            console.log(user)
            if(!user){
                let imageId = new ObjectId()
                // imageData.push(imageId)
                let caption = imageData.caption
                let tags = imageData.tags
                // console.log(caption,tags)
                let imageDatas = {
                    imageId,
                    caption,
                    tags
                }

                // console.log(imageDatas)
                db.get().collection(IMAGE_COLLECTION).insertOne({_id:_id,images:[imageDatas]}).then((data)=>{
                    // console.log(data.images)
                    callback(imageId)
                })
            }else{
                let imageId = new ObjectId()
                // imageData.push(imageId)
                let caption = imageData.caption
                let tags = imageData.tags
                // console.log(caption,tags)
                let imageDatas = {
                    imageId,
                    caption,
                    tags
                }
                console.log(imageDatas)
                await db.get().collection(IMAGE_COLLECTION).updateOne({_id:_id},{
                    $push:{
                        images: imageDatas
                    }
                }).then((data) => {
                    db.get().collection(IMAGE_COLLECTION).findOne({'images.imageId': imageId}).then((data) => {
                        console.log(data)
                    })
                    // console.log(data.images)
                    callback(imageId)

                })
            }
        }else{
            console.log("Login First")
        }


    }
}