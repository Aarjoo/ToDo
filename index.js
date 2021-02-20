const express = require('express');
const bodyParser = require('body-parser');
const {findDate} = require(__dirname+"/date.js");
const mongoose = require('mongoose');
const _ = require("lodash");
const app = express();


let defaultList =[];
let item ="";
let todayDate ="";

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

//create a connection 
mongoose.connect("mongodb+srv://Admin-Arjoo:testMongo_TI@cluster0.uxtci.mongodb.net/toDoListDB", {useNewUrlParser:true, useUnifiedTopology:true});

const itemSchema = mongoose.Schema({
    listItem:"String"
});

const listSchema = mongoose.Schema({
    listName:"String",
    items:[itemSchema]
});
const itemModel = mongoose.model("item", itemSchema);
const listModel = mongoose.model("list", listSchema);

app.get("/", (req, res) => {
   
    listModel.findOne({listName:"Today"}, (err, data)=>{
        if(!err)
        {
            if(data){
            // console.log(data[0].items);
            res.render("list", {today:"Today", toDoItemList: data.items})
            }
            else{
            const defaultListItem =new listModel({
                listName:"Today",
                items:defaultList
            });
            defaultListItem.save();
            res.render("list",{today:"Today", toDoItemList:defaultListItem.items});
            }
        }
    });
   
});

app.get("/:listType", (req, res) =>{
    // defaultList=[];
    listModel.findOne({listName:_.capitalize(req.params.listType)}, (err, data)=>{
        if(!err)
        {
            if(data){
            // console.log(data[0].items);
            res.render("list", {today:_.capitalize(req.params.listType), toDoItemList: data.items})
            }
            else{
            const defaultListItem =new listModel({
                listName:_.capitalize(req.params.listType),
                items:defaultList
            });
            defaultListItem.save();
            res.render("list",{today:_.capitalize(req.params.listType), toDoItemList:defaultListItem.items});
            }
        }
    })
});

app.post("/", (req, res) => {
   
    item = req.body.itemText;  
    const listType= req.body.list;
    const workItem =new itemModel({
        listItem:item
    });
    
    listModel.findOne({listName:listType}, (err, data) =>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            // console.log(data);
            data.items.push(workItem);
            data.save();
            if(listType==="Today")
            {
                res.redirect("/");
            }
            else{
            res.redirect("/"+listType);
            }
        }
       
    });
           
});

app.post("/delete", (req, res) =>{
    const id= req.body.checkbox;
    const listType = req.body.list_type;
    listModel.updateOne({listName:listType}, {$pull: {items: {_id:id}}}, (err, data)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            console.log(data);
            if(listType === "Today")
            {
                res.redirect("/");
            }
            else{
                res.redirect("/"+listType);
            }
        }
    });
    // console.log(id);
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
const server = app.listen(port);
console.log(`Server is running at ${server.address().port}`);       