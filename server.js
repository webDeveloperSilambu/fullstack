const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const url = "mongodb+srv://SilambarasanDev:webdevSilambu07@cluster0.vy8omlc.mongodb.net/feedback?retryWrites=true&w=majority"
const client = new MongoClient(url);

const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
     res.render('login',{val:""});
}
);


app.post('/',async(req,res)=>{
           const logEmail = req.body.logEmail;
          const logPass = req.body.logPass;
     try{
          await client.connect();
          const db = client.db('feedback');
          const collection = db.collection('logs');
          
          const coll = db.collection('datas');
          const allItems = await coll.find({}).toArray();

          const data =await collection.findOne({username : logEmail})
          if(data){
               if(await collection.findOne({password : logPass})){
                    res.render('index',{allItems});
               }
               else{
                    res.render('login',{val : "Username or password is Error"});
               }
          }
          else{
              res.render('login',{val : "Account Not Found !!!"})
          }
        
     }
     catch(e){
          console.log(e);
     }

})

app.get('/home', async (req, res) => {
     try {
          await client.connect();
          const db = client.db('feedback');
          const collection = db.collection('datas');
          const allItems = await collection.find({}).toArray();

          res.render('index', { allItems});
     }
     catch (e) {
          console.log(e)
     }
});


app.post('/home', async (req, res) => {
     const YourName = req.body.yourName;
     const Email = req.body.email;
     const Content = req.body.content;

     try {
          await client.connect();
          const db = client.db('feedback');
          const collection = db.collection('datas');
          const data = await collection.findOne({ username: YourName });
          const allItems = await collection.find({}).toArray();
          if (data) {
               res.render('error');
          } else {
               await collection.insertOne({ username: YourName, email: Email, content: Content })
               res.redirect("/home")
          }
     }
     catch (e) {
          console.log(e)
     }
})

app.get('/signup', (req, res) => {
     res.render('signup',{err:''})
});


app.post('/signup',async(req,res)=>{
     const sname = req.body.sname;
     const spass = req.body.spass;
     
     try{
          await client.connect();
          const db = client.db('feedback');
          const colection = db.collection('logs');
          const data = await colection.findOne({username : sname})
          if(data){
               console.log("error");
               res.render('signup',{err : "Already user is found"});
          }
          else{
               await colection.insertOne({username : sname,password : spass});
               console.log('data is inserted sucessfully');
               res.render('login',{val : ''});
          }
     }
     catch(e){
          console.log('error');
     }
})


app.get('/login', (req, res) => {
     res.render('login',{val:""})
})


app.get('/logout',(req,res)=>{
     res.render('login',{val : ''});
})


app.listen(3000, () => {
     console.log("Server is running on 3000 PORT");
})