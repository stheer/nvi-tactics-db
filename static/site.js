/***************************EVENT LISTENERS**********************************/
document.addEventListener("DOMContentLoaded", function(e) {
  var mainButtons = document.getElementById("main-buttons");
  var dropdown = document.getElementById("main-dropdown-button");
  var dropdownContent = document.getElementById("main-dropdown-content");

  if(window.innerWidth < 1100){
  	mainButtons.style.display = "none";
  	dropdown.style.display = "inline-block";
  }else{
  	mainButtons.style.display = "inline-block";
  	dropdown.style.display = "none";
  	dropdownContent.style.display = "none";
  }

  window.scrollTop = 0;
  window.scrollLeft = 0;

  ajaxPost('/siteText', ["home", "main_page"], loadText, loadTextError);

  //monitor size and toggle dropdown and filter icons accordingly
  window.onresize = displayDropdown;
});


document.getElementById("main-site-link").addEventListener("click", function(){
  window.location.href='https://www.nonviolenceinternational.net/';
});


document.getElementById("tactics-link").addEventListener("click", function(){
  window.location.href='/tactics';
});


document.getElementById("categories-link").addEventListener("click", function(){
  window.location.href='/categories';
});


document.getElementById("dataset-link").addEventListener("click", function(){
  window.location.href="/downloadables";
});


document.getElementById("main-dropdown-button").addEventListener("click", function(){
	var dropdownContent = document.getElementById("main-dropdown-content");
	if(dropdownContent.style.display == "none" || dropdownContent.style.display == ""){
		dropdownContent.style.display = "block";
	}else{
		dropdownContent.style.display = "none";
	}
});


document.getElementById("learn-more").addEventListener("click", () => window.scrollTo({
  top: 500,
  behavior: 'smooth',
}));


function displayDropdown(){
  var mainButtons = document.getElementById("main-buttons");
  var dropdown = document.getElementById("main-dropdown-button");
  var dropdownContent = document.getElementById("main-dropdown-content");

  if(window.innerWidth < 1100){
  	mainButtons.style.display = "none";
  	dropdown.style.display = "inline-block";
  }else{
  	mainButtons.style.display = "inline-block";
  	dropdown.style.display = "none";
  	dropdownContent.style.display = "none";
  }
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


function loadText(data){
  var text = JSON.parse(data)[0]["text"];
  document.getElementById("text-more-info").innerHTML = text;
}


function loadTextError(data){
  console.log(data);
}