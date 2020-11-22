function displayDropdown() {
  var dropdown = document.getElementById("dataset-dropdown-button");
  var dropdownDiv = document.getElementById("dataset-dropdown");
  var buttons = document.getElementsByClassName("dataset-buttons");
  var logo = document.getElementById("sub-logo-img");

  if(window.innerWidth < 950){
    dropdown.style.display = "block";
    dropdownDiv.style.display = "block";
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].style.display = "none";
    }
    logo.classList.add("centered-logo");
  }else{
    dropdown.style.display = "none";
    dropdownDiv.classList.remove("showDropdown");
    dropdownDiv.style.display = "none";
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].style.display = "inline-block";
    }
    logo.classList.remove("centered-logo");
  }
}


function ajaxPost(url, cat, callback, callbackError){
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) { 
        if (xmlhttp.status == 200) {
          callback(xmlhttp.responseText);
          }
        else {
          callbackError();
        }
    }
  };

  xmlhttp.open("POST", url, true);
  xmlhttp.setRequestHeader('Content-Type', 'application/json');
  xmlhttp.send(JSON.stringify({
    value: cat
  }));
}


function ajaxCall(url, callback, callbackError) {
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) { 
          if (xmlhttp.status == 200) {
            callback(xmlhttp.responseText);
            }
          else {
            callbackError();
          }
      }
    };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}


function ajaxCallExcel(url, callback, callbackError) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.responseType = 'arraybuffer';

  xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) { 
          if (xmlhttp.status == 200) {
            callback(xmlhttp.response);
            }
          else {
            callbackError();
          }
      }
    };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}


function ajaxCallImage(url, callback, callbackError) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.responseType = 'blob';

  xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) { 
          if (xmlhttp.status == 200) {
            callback(xmlhttp.response);
            }
          else {
            callbackError();
          }
      }
    };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}


function errorCategoryText(){
  console.log("error");
}


function loadExcel(data){
  console.log(data);
  var blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
  saveAs(blob, "NVI Tactics Dataset.xlsx");
}


function loadExcelError(data){
  console.log(data);
}


function loadTable(data){
  console.log(data);
  saveAs(data, "NVI Tactics Categories Table.png");
}


function loadTableError(data){
  console.log(data);
}


document.addEventListener("DOMContentLoaded", function(e) {
  var dataLink = document.getElementById("dataset-link");
  var dropdown = document.getElementById("dataset-dropdown-button");
  var dropdownDiv = document.getElementById("dataset-dropdown");
  var buttons = document.getElementsByClassName("dataset-buttons");
  var logo = document.getElementById("sub-logo-img");

  //box categories navbar button if current page is categories
  if (window.location.href.indexOf("downloadables") > -1){
    dataLink.setAttribute("style", "border: 2px solid");
  }

  //toggle dropdown and filter visibility based on screen width 
  if(window.innerWidth < 950){
    dropdown.style.display = "block";
    dropdownDiv.style.display = "block";
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].style.display = "none";
    }
    logo.classList.add("centered-logo");
  }else{
    dropdown.style.display = "none";
    dropdownDiv.style.display = "none";
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].style.display = "inline-block";
    }
    logo.classList.remove("centered-logo");
  }

  ajaxPost('/siteText', ["downloadables", "main_page"], function(data) {
    var content = JSON.parse(data);
    var text = content[0]['text'];
    var firstSentence = content[0]['text'].split(".")[0]+".";
    var secondSentence = content[0]['text'].split(".")[1]+".";
    document.getElementById("dataset-context-para").append(firstSentence);
    document.getElementById("dataset-context-para").innerHTML += "<br>";
    document.getElementById("dataset-context-para").append(secondSentence);
    }, errorCategoryText);

  //monitor size and toggle dropdown and filter icons accordingly
  window.onresize = displayDropdown;
});

document.getElementById("home-link").addEventListener("click", function(){
  window.location.href="/";
});


document.getElementById("tactics-link").addEventListener("click", function(){
  window.location.href="/tactics";
});


document.getElementById("categories-link").addEventListener("click", function(){
  window.location.href="/categories";
});


document.getElementById("dataset-link").addEventListener("click", function(){
  window.location.href="/downloadables";
});


document.getElementById("home-link-dropdown").addEventListener("click", function(){
  window.location.href="/";
});


document.getElementById("tactics-link-dropdown").addEventListener("click", function(){
  window.location.href="/tactics";
});


document.getElementById("categories-link-dropdown").addEventListener("click", function(){
  window.location.href="/categories";
});


document.getElementById("dataset-link-dropdown").addEventListener("click", function(){
  window.location.href="/downloadables";
});


document.getElementById("dataset-dropdown-button").addEventListener("click", function(){
  var dropdown = document.getElementById("dataset-dropdown");
  dropdown.classList.toggle("showDropdown");
});


document.getElementById("download-dataset").addEventListener("click", function(){
  ajaxCallExcel("/downloadDataset", loadExcel, loadExcelError);
});

document.getElementById("download-table").addEventListener("click", function(){
  ajaxCallImage("/downloadCategoriesTable", loadTable, loadTableError);
});