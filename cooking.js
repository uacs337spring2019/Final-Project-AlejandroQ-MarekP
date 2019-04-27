// javascript for final Project
// sets buttons and a search function that finds recipes with clicked
// checked marks that give you the recipes that you want
"use strict";
(function(){
  let fold; //function to get folderid
  /**onload function, sets buttons and displays all recipes **/
  window.onload = function() {
      recipes();
      document.getElementById("back").onclick = recipes;
      document.getElementById("search").onclick = search; //init buttons
      document.getElementById("post").onclick = post;
      //start up for timer

  };
  /**function that searches once button is clicked**/
  function search(){
      let checked = getCheckedBoxes();
      console.log(checked);

        //gets the recipes from host
        fetch("http://recipie-helper.herokuapp.com/?mode=check&title=null")
            .then(checkStatus)
            .then(function(responseText) {
              let list = [];
              let rep = JSON.parse(responseText);
              //used to check if the item clicked is shown
              for (let x = 0; x < rep.list.length; ++x){
                let data = {"folder": rep.list[x].folder};
                data["count"] = 0;
                for (let i = 0; i < checked.length; ++i){
                  if (rep.list[x].ingredients.includes(checked[i])){
                    data["count"] += 1;
                  }
                  list[x] = data;
                }
              }
              let fin = {"final": list};
              //checks to see if checked is on there
              if (fin.final.length <= 0){
                  recipes();
              }
              else {
              recipes2(fin);
            }
            })
            .catch(function(error) {
              console.log(error);
        });

    }
    /**function that displays recipes with ingredients clicked**/
    function recipes2(rep){
      //hides all stuff not needed and shows what is needed
      document.getElementById("craft").style.visibility ="hidden";
      document.getElementById("third").style.visibility="hidden";
      document.getElementById("inputs").style.visibility="visible";
      document.getElementById("craft2").innerHTML = "";
      document.getElementById("revtext").innerHTML = "";
      let rec = document.getElementById("recipes");
      rec.innerHTML = "";
      //loops and remakes the divs for shown items
            for(let i = 0; i < rep.final.length; ++i){
              if (rep.final[i].count > 0){
                let single = document.createElement("div");
                let photo = document.createElement("img");
                single.id = rep.final[i].folder;
                photo.src = "recipes/"+ rep.final[i].folder +"/cover.jpg";
                let para = document.createElement("p");
                let temp = rep.final[i].folder.replace(/([a-z])([A-Z])/g, '$1 $2');
                para.innerHTML = temp;
                single.onmousedown = clickDown;
                single.addEventListener("mouseover", expand);
                single.addEventListener("mouseout", revert);
                single.appendChild(photo);
                single.appendChild(para);

                rec.appendChild(single);
              }
            }
    }

    /**function that gets all checked boxes**/
    function getCheckedBoxes() {
    let check = document.getElementsByClassName("checkBox");
    let temp = 0;
    let ccheck = []; //makes them into an array and passes if it is checked
    for (let i=0; i< check.length; i++) {
       if (check[i].checked) {
          ccheck[temp] = check[i].id.toLowerCase(); //sends checked name
          temp += 1;
       }
    }
    return ccheck;
  }

  /**posts to file once review is submitted**/
  function post() {
  let name = document.getElementById("name").value;
  let comment = document.getElementById("message").value;
  //sets the message to be sent to js server
  console.log(fold);
  const message = {name: name,
                  folder: fold,
                   comment: comment};
  const fetchOptions = {
    method : 'POST',
    headers : {
      'Accept': 'application/json',
      'Content-Type' : 'application/json'
    },
    body : JSON.stringify(message)
  };

  console.log(message);
  //url for posting to server takes name and comment
  let url = "http://recipie-helper.herokuapp.com";
  fetch(url, fetchOptions)
    .then(checkStatus)
    .then(function(responseText) {
      console.log(responseText);
    })
    .catch(function(error) {
      console.log(error);
    });
    //fetch to get updated file after posting t0 it
    fetch("http://recipie-helper.herokuapp.com/?mode=reviews&title=" + fold)
        .then(checkStatus)
        .then(function(responseText) {
          let c = document.getElementById("revtext");
          c.innerHTML = "";
          let list = JSON.parse(responseText);
          for (let i = 0; i < list.reviews.length; i++){
            let single = list.reviews[i];
            let p = document.createElement("p");
            p.innerHTML = single;
            c.appendChild(p);
          }
        })
        .catch(function(error) {
          console.log(error);
    });

}

  /**function that creates all the recipes shown**/
  function recipes(){
    //hides inner code divs from recipes clicked and turns them all on
    document.getElementById("craft").style.visibility ="hidden";
    document.getElementById("third").style.visibility="hidden";
    document.getElementById("inputs").style.visibility="visible";
    //resizes the divs to fit better
    document.getElementById("inputs").style.width = 26 + "%";
    // document.getElementById("inputs").style.position = "relative";
    document.getElementById("reci").style.width = 55 + "%";
    document.getElementById("craft2").innerHTML = "";
    document.getElementById("revtext").innerHTML = "";
    //fetch that call the recipe on javascript
    let rec = document.getElementById("recipes");
    rec.innerHTML = "";
    fetch("http://recipie-helper.herokuapp.com/?mode=recipes&title=null")
        .then(checkStatus)
        .then(function(responseText) {
          let rep = JSON.parse(responseText);
          //forloop that runs and creats div, img, and paragraph for recipe
          for(let i = 0; i < rep.recipes.length; ++i){
            let single = document.createElement("div");
            let photo = document.createElement("img");
            single.id = rep.recipes[i].folder;
            photo.src = "recipes/"+ rep.recipes[i].folder +"/cover.jpg";
            let para = document.createElement("p");
            para.innerHTML = rep.recipes[i].title;
            single.onmousedown = clickDown;
            single.addEventListener("mouseover", expand);
            single.addEventListener("mouseout", revert);
            single.appendChild(photo);
            single.appendChild(para);
            //appends it to rec div
            rec.appendChild(single);
          }
        })
        .catch(function(error) {
          console.log(error);
    });
  }
  /**function that exapnds the current recipe hoverd**/
  function expand(){
    this.style.width = 190 +"px";
    this.style.height = 260 + "px"; //increase image and changes backgroundcolor
    this.style.marginBottom = 15 + "px";
    this.style.backgroundColor = "#FFD4FF";

  }
  /**function that reverts once expand once reipe isnt hoverd**/
  function revert(){
    this.style.width = 180 + "px";
    this.style.height = 250 + "px";//decreases image and changes color
    this.style.marginBottom = 25 + "px";
    this.style.backgroundColor = "#FFE5FF";
  }
  /**function that goes once recipe is clicked**/
  function clickDown(){
    let craft = document.getElementById("craft2");
    //makes visible and hides divs that are important
    document.getElementById("craft").style.visibility="visible";
    document.getElementById("third").style.visibility="visible";
    document.getElementById("inputs").style.visibility="hidden";
    // document.getElementById("inputs").style.position = "absolute";
    document.getElementById("inputs").style.width = 6 + "%";
    document.getElementById("reci").style.width = 75 + "%";
    document.getElementById("recipes").innerHTML = "";
    //goes throught and gets information for the recipe clicked
    let temp = this.id.replace(/([a-z])([A-Z])/g, '$1 $2');
    let single = document.createElement("h2");
    fold = this.id;
    single.innerHTML = temp;
    let photo = document.createElement("img");
    photo.src = "recipes/"+ this.id +"/cover.jpg";
    craft.appendChild(single);
    craft.appendChild(photo);
    //all the fetches go and get necassery clicked items from json
    fetch("http://recipie-helper.herokuapp.com/?mode=difficulty&title=" + this.id)
        .then(checkStatus)
        .then(function(responseText) {
            let single = document.createElement("p");
            single.innerHTML = "Difficulty: " + responseText;
            craft.appendChild(single);
        })
        .catch(function(error) {
          console.log(error);
    });
    fetch("http://recipie-helper.herokuapp.com/?mode=ingredients&title=" + this.id)
        .then(checkStatus)
        .then(function(responseText) {
            let ingr = JSON.parse(responseText);
            let box = document.createElement("div");
            for(let i = 0; i < ingr.ingredients.length; ++i){
            let single = document.createElement("li");
            single.innerHTML = ingr.ingredients[i];
            box.appendChild(single);
          }
          craft.appendChild(box);
        })
        .catch(function(error) {
          console.log(error);
    });
    fetch("http://recipie-helper.herokuapp.com/?mode=servings&title=" + this.id)
        .then(checkStatus)
        .then(function(responseText) {
          let temp = JSON.parse(responseText);
          let single = document.createElement("p");
          single.innerHTML = temp;
          craft.appendChild(single);
        })
        .catch(function(error) {
          console.log(error);
    });
    fetch("http://recipie-helper.herokuapp.com/?mode=time&title=" + this.id)
        .then(checkStatus)
        .then(function(responseText) {
          let temp = JSON.parse(responseText);
          let single = document.createElement("p");
          single.innerHTML = temp.prep + temp.total;
          craft.appendChild(single);
        })
        .catch(function(error) {
          console.log(error);
    });
    fetch("http://recipie-helper.herokuapp.com/?mode=instructions&title=" + this.id)
        .then(checkStatus)
        .then(function(responseText) {
          let ingr = JSON.parse(responseText);
          let box = document.createElement("div");
          for(let i = 0; i < ingr.instructions.length; ++i){
            let single = document.createElement("p");
            single.innerHTML = ingr.instructions[i];
            box.appendChild(single);
          }
          craft.appendChild(box);
        })
        .catch(function(error) {
          console.log(error);
    });
    fetch("http://recipie-helper.herokuapp.com/?mode=reviews&title=" + this.id)
        .then(checkStatus)
        .then(function(responseText) {
          let c = document.getElementById("revtext");
          c.innerHTML = "";
          let list = JSON.parse(responseText);
          for (let i = 0; i < list.reviews.length; i++){
            let single = list.reviews[i];
            let p = document.createElement("p");
            p.innerHTML = single;
            c.appendChild(p);
          }
        })
        .catch(function(error) {
          console.log(error);
    });
  }

  // // function back(){
  // //   document.getElementById("craft").style.visibility="hidden";
  // //   document.getElementById("recipes").style.visibility="visible";
  // // }
  // /**function that starts the timer**/
  // function startclick() {
  //   let start = document.getElementById("start"); //sets buttons to a variable
  //   let stop = document.getElementById("stop");
  //   start.setAttribute( "class", "off" );  //turns the start button off
  //   stop.setAttribute( "class", "on" ); //turns stop button off
  //   start.disabled = true;
  //   stop.disabled = false;
  //   countDown();
  // }
  // /**Function that stops the timer **/
  // function stopclick() {
  //   let start = document.getElementById("start");
  //   let stop = document.getElementById("stop");
  //   start.setAttribute( "class", "on" );
  //   stop.setAttribute( "class", "off" );
  //   stop.disabled = true;
  //   start.disabled = false;
  //   clearInterval(timer);
  // }
  // /**function makes counter count down**/
  // function countDown(){
  //   let h = parseInt(document.getElementById("hour").value);
  //   let m = parseInt(document.getElementById("minutes").value);
  //   let s = parseInt(document.getElementById("seconds").value);
  //   let clock = document.getElementById("timer");
  //   let distance = h * 60 * 60 * 1000 + m * 60 * 1000 + s * 1000;
  //   let temp = 1;
  //   timer = setInterval(function() {
  //     let unit = [];
  //     //hours minutes seconds
  //     unit[0] = Math.floor(distance / (1000 * 60 * 60));
  //     unit[1] = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  //     unit[2] = Math.floor((distance % (1000 * 60)) / 1000);
  //     console.log(Math.floor((distance % (1000 * 60)) / 1000));
  //     for (let i = 0; i < unit.length; ++i){
  //       if (unit[i] < 10){
  //         unit[i] = "0" + unit[i];
  //       }
  //     }
  //     console.log(unit[2]);
  //     clock.innerHTML= "";
  //     clock.innerHTML = unit[0] + ":"+ unit[1] + ":"
  //      + unit[2];
  //     if (distance == 0){
  //       clock.innerHTML = "00:00:00";
  //       clearInterval(timer);
  //     }
  //     else {
  //       distance = distance - 1;
  //     }
  //   }, 1000);
  // }



    /**Checks for the errors**/
    function checkStatus(response) {
      if (response.status >= 200 && response.status < 300) {
          return response.text();
      }
      else if (response.status == 410) { //for 410 error
        return Promise.reject(new Error("410 No information could be found"));
      }
      else if (response.status == 404) { //for 404 error
        return Promise.reject(new Error("404 can not find the page"));
      }
      else {
       return Promise.reject(new Error(response.status+": "+response.statusText));
      }
    }

})();
