var pic;
var sharpNum;
var currentTacticDes = 0;
const colorThief = new ColorThief();

if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
	window.addEventListener('beforeunload', function () {
		document.getElementsByTagName("body")[0].style.display = "none";
  		window.scroll(0, 0);
	});
}

document.addEventListener("DOMContentLoaded", function(e) {
	var timer = setTimeout(loadPage, 3000);
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

	//add next-tactic button over tactic image
	/*var span = document.createElement("span");
	span.setAttribute("class", "tacticpage-exit material-icons");
	span.setAttribute("id", "next-tacticpage");
	span.innerHTML = "keyboard_arrow_right";

	tacticPictureDiv.appendChild(span);*/

	if(sharpNum != ""){
		document.getElementById("sharp-container").insertAdjacentHTML("afterbegin", "Sharp Tactic ID: ");
	}

	//tactic description preparation
	//unhide the first description and link
	document.getElementById("description-title-0").style.display = "block";
	document.getElementById("tacticpage-example-text-0").style.display = "block";
	document.getElementById("tacticpage-example-link-0").style.display = "block";
	document.getElementById("tacticpage-example-dot-0").className += " active-dot";

	//unhide the description arrows if multiple descriptions exist
	if(num_examples > 1){
		var tacticPointers = document.getElementsByClassName("example-pointer");
		tacticPointers[0].classList.toggle("hide");
		tacticPointers[1].classList.toggle("hide");
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

	document.getElementById("fb-share").setAttribute('data-href', window.location.href);
	console.log(window.location.href);
	document.getElementById("fb-share").href = "https://www.facebook.com/sharer/sharer.php?u="+window.location.href+"&amp;src=sdkpreparse";
	//document.getElementById("fb-share").href = "https://www.facebook.com/sharer/sharer.php?u=https://www.tacticstest.nonviolenceinternational.net/&amp;src=sdkpreparse";
	window.onresize = categoryDisplay;
});

document.getElementById("prev-tactic-example").addEventListener("click", function(){
	currentTacticDes += -1;
	showTacticDescription(currentTacticDes);
});

document.getElementById("next-tactic-example").addEventListener("click", function(){
	currentTacticDes += 1;
	showTacticDescription(currentTacticDes);
});

document.getElementById("tacticpage-down-arrow").addEventListener("click", () => window.scrollTo({
  top: 500,
  behavior: 'smooth',
}));

document.getElementById("tacticpage-back-top").addEventListener("click", function(){
	if(document.referrer.includes('/categories')){
		window.location.href = "/categories";
	}else{
		window.location.href = "/tactics";
	}
});

document.getElementById("tacticpage-back-header").addEventListener("click", function(){
	if(document.referrer.includes('/categories')){
		window.location.href = "/categories";
	}else{
		window.location.href = "/tactics";
	}
});

/*document.onscroll = function(){ 
	var pos = document.body.parentNode.scrollTop;
	tacticpageHeader = document.getElementById("tacticpage-scroll-header");
	if(pos > 637){
		if(header == true){
			unfade(tacticpageHeader);
			header = false;
		}
	}else{
		if(header == false){
			fade(tacticpageHeader);
		}
	}
};*/

//change background of header to random color in image palette
function changeInfoColor(img){
	var rgb_array = colorThief.getPalette(img);
	var rgb = rgb_array[Math.floor(Math.random() * rgb_array.length)];
	document.getElementById('tacticinfo-container').style.backgroundColor = 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';
	var sum = rgb.reduce(function(a, b){
		return a + b;
	}, 0);
	if(sum > 500){
		var exitButton = document.getElementById("tacticpage-back-top");
		var leftButton = document.getElementById("prev-tacticpage");
		var rightButton = document.getElementById("next-tacticpage");
		exitButton.style.color = "#033165";
		leftButton.style.color = "#f5c71a";
		rightButton.style.color = "#f5c71a";
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

function getTacticDescription(n){
	showTacticDescription(currentTacticDes = n);
}

function showTacticDescription(n) {
	var i;
	var tactic_titles = document.getElementsByClassName("tacticpage-example-title");
	var tactic_examples = document.getElementsByClassName("tacticpage-example-description");
	var tactic_link = document.getElementsByClassName("tacticpage-example-link");
	var dots = document.getElementsByClassName("tacticpage-example-select-dot");
	if (n > tactic_examples.length-1) {currentTacticDes = 0}
	if (n < 0) {currentTacticDes = tactic_examples.length-1}
	for (i = 0; i < tactic_examples.length; i++) {
		tactic_titles[i].style.display = "none";
    	tactic_examples[i].style.display = "none";
    	tactic_link[i].style.display = "none";
	}
	for (i = 0; i < dots.length; i++) {
		dots[i].className = dots[i].className.replace(" active-dot", "");
	}
	tactic_titles[currentTacticDes].style.display = "block";
	tactic_examples[currentTacticDes].style.display = "block";
	tactic_link[currentTacticDes].style.display = "block";
	dots[currentTacticDes].className += " active-dot";
}

window.addEventListener("scroll", () => {
	var checkpoint = 675;
	var endOfTop = 637;
	const currentScroll = window.pageYOffset;
	var header = document.getElementById("tacticpage-scroll-header");
	if (currentScroll >= endOfTop) {
		header.style.zIndex = "9999";
		opacity = 0 + ((currentScroll - 637) / (checkpoint - 637));
	} else {
		opacity = 0;
		header.style.zIndex = "-1";
	}
	header.style.opacity = opacity;
});

document.body.addEventListener("mousemove", function(e) {
    var prev = document.getElementById("prev-tacticpage");
    var next = document.getElementById("next-tacticpage");
    var width = window.innerWidth;
    var ratio = e.pageX/width;
    if(ratio < .08 && (e.pageY > 230 && e.pageY < 365)) {
    	prev.style.visibility = "visible";
    	prev.style.opacity = "100";
    }else{
    	prev.style.visibility = "hidden";
    	prev.style.opacity = "0";
    }

    if(ratio > .92 && (e.pageY > 230 && e.pageY < 365)) {
    	next.style.visibility = "visible";
    	next.style.opacity = "100";
    }else{
    	next.style.visibility = "hidden";
    	next.style.opacity = "0";
    }
});

