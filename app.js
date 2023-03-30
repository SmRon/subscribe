//jshint esversion:6

const express = require ("express");
const bodyParser = require ("body-parser");
const https = require ("https");

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };


  const jsonData = JSON.stringify(data);

  const url = "https://us8.api.mailchimp.com/3.0/lists/bea668fcfe";
  const options = {
    method: "POST",
    auth: "anystring:7baf352b752408a8c06f9b61fe7fe39f-us8"
  }

  const request = https.request(url, options, function(response){
    if (response.statusCode === 200){
      res.sendFile(__dirname  + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    };
    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res){
  res.redirect("/");
})



app.listen(port, function(){
  console.log("Server is running on port: 3000");
});

//api
// 7baf352b752408a8c06f9b61fe7fe39f-us8
//list ID
//bea668fcfe
