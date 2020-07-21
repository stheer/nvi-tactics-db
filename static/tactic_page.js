var pic;
var sharpNum;
const colorThief = new ColorThief();

document.addEventListener("DOMContentLoaded", function(e) {
	var timer = setTimeout(loadPage, 2000);
	var tacticPictureDiv = document.getElementById("tacticpage-pic-container");

	//create image for color palette
	var img = new Image();
	img.src = "/static/tactic_pictures/"+pic+".jpg";
	img.id = "tacticpage-image";

	//set image as background of pic-div
	tacticPictureDiv.style.backgroundImage = "url('/static/tactic_pictures/"+pic+".jpg')";

	//change background of header to random color in image palette
	if (img.complete) {
	  changeInfoColor(img);
	} else {
	  img.addEventListener("load", function() {
	  	changeInfoColor(img);
	  });
	}

	if(sharpNum != ""){
		document.getElementById("sharp-container").insertAdjacentHTML("afterbegin", "Sharp Tactic ID: ");
	}

	var categories = document.getElementsByClassName("category-list-tacticpage");
	if(window.innerWidth > 1000){
		for(var i = 0; i < categories.length; i++){
			categories[i].style.marginLeft = ((i+1)*30)+"px";
		}
	}else{
	    for(var i = 0; i < categories.length; i++){
			categories[i].style.marginLeft = "auto";
		}
	}
	window.onresize = categoryDisplay;

});


document.getElementById("tacticpage-exit").addEventListener("click", function(){
	if(document.referrer.includes('/categories')){
		window.location.href = "/categories";
	}else{
		window.location.href = "/tactics";
	}
});

//change background of header to random color in image palette
function changeInfoColor(img){
	var rgb_array = colorThief.getPalette(img);
	var rgb = rgb_array[Math.floor(Math.random() * rgb_array.length)];
	document.getElementById('tacticinfo-container').style.backgroundColor = 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';
	var sum = rgb.reduce(function(a, b){
		return a + b;
	}, 0);
	if(sum > 500){
		var exitButton = document.getElementById("tacticpage-exit");
		exitButton.style.color = "#033165";
		if(sum > 600){
			var headerText = document.getElementById("tacticinfo-sub-container");
			for(var i = 0; i < headerText.children.length; i++){
				headerText.children[i].style.color = "#033165";
			}
		}	
	}else{
		var pageLogoImage = document.getElementById("tacticpagesub-logo-img");
		pageLogoImage.src = "/static/nvi-main-logo.png";
	}
}

function categoryDisplay(){
	var categories = document.getElementsByClassName("category-list-tacticpage");
	if(window.innerWidth > 1000){
		for(var i = 0; i < categories.length; i++){
			categories[i].style.marginLeft = ((i+1)*30)+"px";
		}
	}else{
	    for(var i = 0; i < categories.length; i++){
			categories[i].style.marginLeft = "auto";
		}
	}
}

function loadPage(){
	document.querySelector(".loader").style.display = "none";
	document.getElementById("tacticpage-load-screen").style.display = "none";
}


