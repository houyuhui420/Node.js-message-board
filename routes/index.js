var express = require("express");
var router = express.Router();
var fs = require("fs");
var file = 'comment-history.txt';

//将文件解析成json对象
function getFileDataInJson(){
  var jsonData = JSON.parse(fs.readFileSync(file));
  return jsonData;
}

var historyComments;
  try{
      historyComments = getFileDataInJson();
  }catch (err){
      historyComments = [];
  }

//将json对象转换成字符串
function getDataString(){
  var stringData = JSON.stringify(historyComments);
  return stringData;
}

//验证消息变量
var error = '';
var success = '';

//首页
  router.get("/",function(req, res){

    //处理留言字符串
    var data = getDataString().split("},{");
    var name = [];
    var message = [];
    for(var i = 0;i < data.length;i++){
      data[i] = data[i].replace(/[\"\}\]\[]/g, "");
      var n =  data[i].search(/name:/);
      var m =  data[i].search(/message:/);
      name[i] = data[i].substring(n+5,m-1);
      message[i] = data[i].substring(m+8,data[i].length);
    }
    res.render("index", {name: name, message: message, error: error, success: success});

    //消息变空
    error = '';
    success = '';
  });
//处理html中的标签
function stripUserInput(input){
  if(input)
  return input.replace(/(<([^>]+)>)/ig,"");
}

 //添加留言
router.post("/",function(req, res, next){
  //留言名字为空
  var n = req.body.name;
  if(n == null || n==''){
    error = "请输入名字!";
    res.redirect('/');
    return
  }

  var newMessageObj = {};
  newMessageObj.name = stripUserInput(req.body.name);
  newMessageObj.message = stripUserInput(req.body.message);

    //添加数据对象
  historyComments.push(newMessageObj);

  //把对象先转成字符串然后写入文件
  fs.writeFile(file, JSON.stringify(historyComments,null,4), function(err) {
        if(err) {
            res.end("Failed to leave message. Sorry!");
            return;
        }
        success = '恭喜留言成功!';
        res.redirect('/');
    });
});
module.exports = router;
