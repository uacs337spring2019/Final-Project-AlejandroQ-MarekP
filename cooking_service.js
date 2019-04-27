const express = require("express");
const app = express();
const fs = require("fs");

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
               "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(express.static('public'));
app.use(express.static(__dirname));
console.log("started');
/**function for reading off the files and returns a string**/
function read_file(file_name, title) {
	let info = 0;
	try {
	    info = fs.readFileSync("recipes/"+ title +"/"+file_name, 'utf8');
	} catch(e) {
	    console.log('Error:', e.stack);
	}
	return info;
}

	/**creates the JSON for the ingredients.txt**/
 function build_ingredients(line){
   line = line + "";
   line = line.split("\n");
   let data = {"ingredients":line};
   return data;
 }

 /**creates the JSON for the instructions file**/
function build_instructions(line){

  line = line.split("\n");
  let data = {"instructions":line};
  return data;
}

/**creates the JSON for the time file**/
function build_time(line){
 line = line.split("\n");
 let temp = line[0].split(":::");
 let temp2 = temp[0] + ":" + temp[1];
 let data = {"prep":temp2};
 temp = line[1].split(":::");
 temp2 = temp[0] + ":" + temp[1];
 data["total"] = temp2;
 return data;
}

/**Builds the list of every recipe in the recipe folder as a JSON**/
 function build_recipes(){
	 let rec = fs.readdirSync("recipes/");
	 let i = 0;
	 let list = [];
   let temp = "";
	 while(i < rec.length) {
		 temp = rec[i].replace(/([a-z])([A-Z])/g, '$1 $2');
     let data = {"title":temp};
     data["folder"] = rec[i];
		 list[i] = data;
		 i++;
	 }
	 let book = {"recipes":list};
	 return book;
 }
  /**gets all the ingredients**/
  function build_check(){
 	 let rec = fs.readdirSync("recipes/");
 	 let i = 0;
 	 let list = [];
    let temp;
    console.log("k");
 	 while(i < rec.length) {
     temp = read_file("ingredients.txt", rec[i]);
     let temp1 = temp.replace(/(\r\n|\n|\r)/gm," ");
     temp = temp1.split(" ");
     let data = {"folder": rec[i]};
      data["ingredients"] = temp;
 		 list[i] = data;
 		 i++;
 	 }
 	 let rep = {"list":list};
 	 return rep;
  }

 /**Builds the JSON for all the messages**/
  function build_Message(info){
   info = info.split("\n");
 	 let final = {"reviews":info};
 	 return final;
  }

console.log('web service started');
app.get('', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");

  let title = req.query.title;
  let mode = req.query.mode;

  let line = "";
  let temp;

 //an error case that isnt required
  if(title == undefined || mode == undefined) {
    res.status(400);
    res.send("Missing required parameters");
  }

//Switch statement for all posible the mode values in the url
switch (mode) {
  case "difficulty":
    temp = read_file("difficulty.txt",title);
    line = temp.replace(/(\r\n|\n|\r)/gm,"");
  break;
  case "check":
  line = build_check();
  break;
  case "ingredients":
    temp = read_file("ingredients.txt",title);
    line = build_ingredients(temp);
  break;
  case "instructions":
  temp = read_file("instructions.txt",title);
  line = build_instructions(temp);
  break;
  case "servings":
    temp = read_file("servings.txt",title);
    line = temp.replace(/(\r\n|\n|\r|")/gm,"");
  break;
  case "time":
    temp = read_file("time.txt",title);
    line = build_time(temp);
  break;
  case "recipes":
		line = build_recipes();
  break;
  case "reviews":
  temp = read_file("reviews.txt",title);
  line = build_Message(temp);
  break;
  default:
    console.log("mode error");
  break;
}



//an error case
if(line == "") {
  res.status(410);
  res.send("recipe was not found");
}

res.send(JSON.stringify(line));

});
//post function to post to the files
app.post('/', jsonParser, function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	let name = req.body.name;
  let folder = req.body.folder;
	let comment = req.body.comment;
  let foldername = "recipes/" +folder + "/reviews.txt";
	console.log(name);
	console.log(comment);
  //string being sent into file
	let string = "\n" + name + ": " + comment + "\n";
	fs.appendFile(foldername, string, function(err) {
    	if(err) {
			console.log(err);
			res.status(400);
    	}
    	console.log("The file was saved!");
    	res.send("Success!");
	});
});

app.listen(process.env.PORT);
