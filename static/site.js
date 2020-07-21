/***************************EVENT LISTENERS**********************************/
document.addEventListener("DOMContentLoaded", function(e) {
  var mainButtons = document.getElementById("main-buttons");
  var dropdown = document.getElementById("main-dropdown-button");
  var dropdownContent = document.getElementById("main-dropdown-content");

  if(window.innerWidth < 850){
  	mainButtons.style.display = "none";
  	dropdown.style.display = "inline-block";
  }else{
  	mainButtons.style.display = "inline-block";
  	dropdown.style.display = "none";
  	dropdownContent.style.display = "none";
  }

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


document.getElementById("main-dropdown-button").addEventListener("click", function(){
	var dropdownContent = document.getElementById("main-dropdown-content");
	if(dropdownContent.style.display == "none" || dropdownContent.style.display == ""){
		dropdownContent.style.display = "block";
	}else{
		dropdownContent.style.display = "none";
	}
});


function displayDropdown(){
  var mainButtons = document.getElementById("main-buttons");
  var dropdown = document.getElementById("main-dropdown-button");
  var dropdownContent = document.getElementById("main-dropdown-content");

  if(window.innerWidth < 850){
  	mainButtons.style.display = "none";
  	dropdown.style.display = "inline-block";
  }else{
  	mainButtons.style.display = "inline-block";
  	dropdown.style.display = "none";
  	dropdownContent.style.display = "none";
  }

}