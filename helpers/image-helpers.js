var db = require('../config/connection')
var collection = require('../config/collection')
var bcrypt = require('bcrypt')
const {IMAGE_COLLECTION} = require("../config/collection");
const {ObjectId} = require("mongodb");


module.exports = {
    addImage: async (userId, imageData,username, callback)=>{
       
        if(userId){
            // let user = await db.get().collection(IMAGE_COLLECTION).findOne({_id:userId})
            // console.log(user)
            // if(!user){
                // let imageId = new ObjectId()
                // // imageData.push(imageId)
                let caption = imageData.caption
                let tags = imageData.tags
                // console.log(caption,tags)
                // let imageDatas = {
                //     imageId,
                //     caption,
                //     tags
                // }


                // console.log(imageDatas)
                db.get().collection(IMAGE_COLLECTION).insertOne({userId:userId,username:username,caption,tags}).then((data)=>{
                    console.log(data.insertedId)
                    callback(data.insertedId)
                })
            // }else{
            //     let imageId = new ObjectId()
            //     // imageData.push(imageId)
            //     let caption = imageData.caption
            //     let tags = imageData.tags
            //     // console.log(caption,tags)
            //     let imageDatas = {
            //         imageId,
            //         caption,
            //         tags
            //     }
            //     console.log(imageDatas)
            //     await db.get().collection(IMAGE_COLLECTION).updateOne({_id:_id},{
            //         $push:{
            //             images: imageDatas
            //         }
            //     }).then((data) => {
            //         db.get().collection(IMAGE_COLLECTION).findOne({'images.imageId': imageId}).then((data) => {
            //             console.log(data)
            //         })
            //         // console.log(data.images)
            //         callback(imageId)

            //     })
            // }
        }else{
            console.log("Login First")
        }


    },
    getImages: async ()=>{
        return new Promise(async (resolve, reject) => {
            let images = await db.get().collection(IMAGE_COLLECTION).find().toArray()
            console.log(images);
            resolve(images)
        }) 
    }
}