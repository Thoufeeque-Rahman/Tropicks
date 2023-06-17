var express = require('express');
var router = express.Router();
var userHelpers = require('../helpers/user-helpers')

/* GET home page. */
router.get('/', function(req, res, next) {
  let user = req.session.user
  console.log(user);
  res.render('user/index', { admin:false, user });
});



router.post('/upload',(req,res)=>{
  let user = req.session.userId
  console.log(user)
  // console.log(req.body);
  // console.log(req.files.Image);
  userHelpers.addImage(user, req.body,(id)=>{
    // let image=req.files.Image
    console.log(id);
    res.redirect('/')
    // image.mv('./public/user-images/'+id+'.jpg',(err)=>{
    //   if(!err){
    //     res.render("user/index")
    //   }else{
    //     res.removeHeader("user/index")
    //   }
    // })

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
