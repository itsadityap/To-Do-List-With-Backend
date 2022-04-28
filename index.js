const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

//let items = ["Study","Sleep","Eat"];

app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

mongoose.connect("mongodb+srv://itsadityap:Lenovo%40111@cluster0.h4izv.mongodb.net/todoList",{useNewUrlParser: true});

const itemsSchema = {
    name : String
}

const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
    name : "Welcome to your To-Do-List"
});

const item2 = new Item({
    name : "Hit the plus button to add the new item"
});

const item3 = new Item({
    name : "<-- Hit this to delete the item"
});

const defaultItems = [item1,item2,item3];

app.get("/", function (req,res)
{
    let today = new Date();

    let options = {
        weekday: 'long',day:"numeric" ,year : 'numeric', month : 'long'
    };

    let day = today.toLocaleDateString("en-IN", options);

    Item.find({},function (err,foundItems)
    {
        if(foundItems.length === 0)
        {
            Item.insertMany(defaultItems, function (err){

                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log("Saved the default values to mongo server");
                }
            });

            setTimeout( function (){res.redirect("/")}, 600) ;
        }
        else
        {
            res.render('list', {kindOfDay: day, newListItems: foundItems});
        }
    });


});

app.post("/",function (req,res)
{
    const itemName = req.body.newItem;

    const item = new Item({
        name : itemName
    })

    item.save();

    setTimeout( function (){res.redirect("/")}, 600) ;

});

app.post("/delete", function (req,res){

    console.log(req.body.delBox);

    const delItem = req.body.delBox;

    Item.findByIdAndDelete(delItem, function (err){
        if(err)
        {
            console.log("Something Wrong");
        }
        else
        {
            console.log("Successfully deleted");
        }
    });

    setTimeout( function (){res.redirect("/")}, 600) ;

});

let port = process.env.PORT;

if(port == null || port == ""){
    port=3000;
}

app.listen(port);

app.listen(port,function ()
{
    console.log("App is running on the port 3000");
});
