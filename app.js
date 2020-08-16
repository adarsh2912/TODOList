const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const lodash = require("lodash")

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));


// const items = ["Buy food","Cook food","Eat food"];
// const workItems = [];

mongoose.connect("mongodb+srv://admin-adarsh:admin123@cluster0.yozuo.mongodb.net/todolistDB?retryWrites=true&w=majority",{useNewUrlParser: true,useUnifiedTopology: true  })

const itemsSchema = {
    name: String
}
const Item = mongoose.model("Item", itemsSchema)

const item1 = new Item({
    name: "Welcome to your todolist!."
})
const item2 = new Item({
    name: "Hit + button to add a new item."
})
const item3 = new Item({
    name: "<~~  Hit this to delete an item."
})

const defaultItems = [item1, item2, item3]

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema)


app.get("/" , function(req, res){


    Item.find({}, function(err, foundItems){
        if(foundItems.length === 0){
            Item.insertMany(defaultItems, function(err){
                if(err)
                    console.log(err)
                else
                    console.log("Successfully saved Data to todolistDB")
            })
            res.redirect("/")
        }else{
            res.render("list", {listTitle: "Today", newListItem: foundItems});
        }
         })
})


app.post("/", function(req, res){
    const newItems = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({
        name: newItems
    })
    if(listName === "Today"){
        item.save()
        res.redirect("/")
    }else{
        List.findOne({name: listName}, function(err, foundList){
            foundList.items.push(item)
            foundList.save()
            res.redirect("/" + listName)
        })
    }


});
app.post("/delete", function(req, res){
    const itemToRemoved = req.body.checkBox
    const listName = req.body.listName
    if(listName === "Today"){
        Item.findByIdAndRemove(itemToRemoved, function(err){
            if(!err){
                console.log("Successfully removed")
                res.redirect("/")
            }
        })
    }else{
        List.findOneAndUpdate({name: listName},{$pull: {items: {_id: itemToRemoved}}}, function(err, foundList){
            res.redirect("/" + listName)
        })
    }
})

app.get("/:customListName", function(req,res){
    const customListName = lodash.capitalize(req.params.customListName)

    List.findOne({name: customListName}, function(err, foundList){
        if(!err){
            if(!foundList){
               // console.log("Doesn't exits")
                const list = new List({
                    name: customListName,
                    items:defaultItems
                })
                list.save()
                res.redirect("/" + customListName)
            }else{
               // console.log("Exits")
                res.render("list", {listTitle: foundList.name, newListItem: foundList.items})
            }
        }
    })


})

app.get("/about", function(req, res){
    res.render("about")
})


app.listen(process.env.PORT || 3000 , function(){
    console.log("yo!!")
})