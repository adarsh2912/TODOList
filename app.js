const express = require("express")
const bodyParser = require("body-parser")
const date = require(__dirname + "/date.js")

const app = express();

const items = ["Buy food","Cook food","Eat food"];
const workItems = [];
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));



app.get("/" , function(req, res){
  let day = date.getDate();
 // console.log(day);
    res.render("list", {listTitle: day, newListItem: items});

});
app.post("/", function(req, res){
    let item = req.body.newItem;
    if(req.body.list === "Work"){
        workItems.push(item);
        res.redirect("/work");

    }else {
        items.push(item);
        res.redirect("/");
    }
});

app.get("/work", function(req, res){
    res.render("list", {listTitle: "Work List", newListItem: workItems})
})
app.get("/about", function(req, res){
    res.render("about")
})


app.listen(process.env.PORT || 3000 , function(){
    console.log("yo!!")
})