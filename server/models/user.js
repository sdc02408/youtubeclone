const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; //솔트가 몇글자인지
const jwt = require('jsonwebtoken');

const useraSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email:{
    type: String,
    trim: true,
    unique:1
  },
  password:{
    type: String,
    minlength: 5
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role: {  //관리자인지 클라이언트인지
    type: Number,
    default: 0
  },
  image: String,
  token:{//유효성가능
    type: String
  },
  tokenExp:{
    type: Number
  }
})
//index 전
useraSchema.pre('save',function(next) {
  var user = this;
  //비밀번호를 암호화 시킨다.
  //password 변활 될때만.
  if(user.isModified('password')) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if (err) return next(err)//index로
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err)
        user.password = hash //플레인을 hash로 바꿔
        next()
      });
    });
  } else{//다른 것을 바꿀때 비밀번호가 아니라 이메일 변경등
    next()
  }
})

useraSchema.methods.comparePassword = function(plainPassword,cb) {
  //암호화 해서 저장된 비번과 비교
  bcrypt.compare(plainPassword, this.password, function(err,isMatch) {
    if(err) return cb(err)
    cb(null, isMatch)
  })
}

useraSchema.methods.generateToken = function(cb) {
  //jsonwebtoken 을 이용해서 jsonwebtoken 생성하기
  var user = this;
  var token = jwt.sign(user._id.toHexString(), 'secretToken')
  
  user.token = token
  user.save(function(err,user) {
    if(err) return cb(err)
    cb(null, user)
  })
  // user._id + 'secretToken' = token
}

useraSchema.statics.findByToken =function(token, cb) {
  var user = this;
  
  //토큰을 디코드한다.
  jwt.verify(token, 'secretToken', function(err,decoded) {
    //유저 아이디를 이용해서 유저를 찾은 다음에
    //클라이언트에서 가져온 토큰과 db에 보관된 토큰이 일치하는지 확인.
    
    user.findOne({"_id": decoded, "token": token}, function(err,user) {
      if(err) return cb(err);
      cb(null,user)
    })
  })
}


const Usera = mongoose.model('Usera', useraSchema)

module.exports = {Usera}
