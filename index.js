var express = require("express");

var bodyParser = require("body-parser");
var path = require("path");




var app = express();


//设置模板文件目录
app.set("views", path.join(__dirname, "views"));
//设置模板引擎
app.set("view engine", "ejs");
//设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));



//路由
var index = require("./routes/index");
app.use("/", index);



//监听端口
app.listen(5000,function(){
  console.log("留言板启动,端口为5000");
})
