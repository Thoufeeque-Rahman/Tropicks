var express = require('express');
var router = express.Router();
var userHelpers = require('../helpers/user-helpers')
var imageHelpers = require('../helpers/image-helpers')
var fs = require('fs')

/* GET home page. */
router.get('/', function(req, res, next) {
  let user = req.session.user
  console.log(user);

  
    imageHelpers.getImages().then((images)=>{
      console.log(images);
      res.render('user/index', { admin:false, user, images });
    })
  
});



router.post('/upload',(req,res)=>{
  let userId = req.session.userId
  let user = req.session.user
  console.log(user.username)
  // console.log(req.body);
  // console.log(req.files.Image);
  imageHelpers.addImage(userId, req.body,user.username,(id)=>{
    let image=req.files.Image
    console.log(id);
    
    const path = './public/'+userId+'/'
    fs.access(path, (err) => {
      if (err) {
        
        fs.mkdir(path, (error) => {
          if (error) {
            console.log(error);
          } else {
            console.log("New Directory created successfully !!");
            image.mv(path+id+'.jpg', (err,done)=>{
              if(err){
                console.log(err);
              }else{
                console.log('done');
                res.redirect('/')
              }
            })
          }
        });
        

      } else {
        console.log("Directory exists !!");
        image.mv(path+id+'.jpg', (err,done)=>{
          if(err){
            console.log(err);
          }else{
            console.log('done');
            res.redirect('/')
          }
        })
      }
    })

    

  })

})

router.get('/signup', (req,res)=>{
  res.render('user/signup', { admin:false })
})

router.post('/signup',(req,res)=>{
  console.log(req.body);
  
  userHelpers.doSignup(req.body).then((response)=>{
    if (response.status) {
        console.log('signup success')
      res.redirect( '/login' )
    } else {
      console.log('signup failed')
        res.redirect('/signup')
    }
    
    console.log(response);
    
  })
})

router.get('/login',(req,res)=>{
  res.render('user/login')
})

router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      req.session.userId=response.user._id
      res.redirect('/')
    }else{

      res.redirect('/login')
    }

  })
})

router.get('/logout',(req,res)=>{
  req.session.user=null
  req.session.userLoggidIn=false
  res.redirect('/')
})

router.get('/profile/:username', (req,res)=>{
  console.log('hi')
  let user = req.session.user
  res.render('user/profile', { admin:false, user })
})


module.exports = router;
