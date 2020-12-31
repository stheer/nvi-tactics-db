var pic;
var sharpNum;
var currentTacticDes = 0;
var tactic;
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
	if(window.innerWidth >= 1000){
		for(var i = 0; i < categories.length; i++){
			categories[i].style.marginLeft = ((i+1)*30)+"px";
		}
	}else{
	    for(var i = 0; i < categories.length; i++){
			categories[i].style.marginLeft = "auto";
		}
	}

	//Do not show next/previous tactic buttons if page width is less than 750px
	if(window.innerWidth < 750){
		document.getElementById("prev-tacticpage").style.display = "none";
		document.getElementById("next-tacticpage").style.display = "none";
	}

	//add next tactic button to page - location of button dependent on width of screen
	var next = document.createElement("span");
	next.id = "next-tacticpage";
	next.className = "tacticpage-exit material-icons";
	next.innerHTML = "keyboard_arrow_right";
	if(window.innerWidth >= 1000){
		document.getElementById("tacticpage-pic-container").appendChild(next);
	}else{
		document.getElementById("tacticinfo-container").appendChild(next);
	}

	//Update sharing links to add specific tactic page attributes
	document.getElementById("fb-share").setAttribute('data-href', window.location.href);
	document.getElementById("fb-share").href = "https://www.facebook.com/sharer/sharer.php?u="+window.location.href+"&amp;src=sdkpreparse";
	document.getElementById("mail-share").href = "mailto:?subject=Nonviolence International Tactic of Resistance&body=Check out this tactic of nonviolent resistance from Nonviolence International: "+tactic+" - "+encodeURIComponent(window.location.href);
	document.getElementById("twitter-share").setAttribute('data-url', window.location.href);
	document.getElementById("twitter-share").setAttribute('data-text', "Check out this tactic of nonviolent resistance from Nonviolence International! \n\n"+tactic+"\n");

	document.getElementById("fb-share-header").setAttribute('data-href', window.location.href);
	document.getElementById("fb-share-header").href = "https://www.facebook.com/sharer/sharer.php?u="+window.location.href+"&amp;src=sdkpreparse";
	document.getElementById("mail-share-header").href = "mailto:?subject=Nonviolence International Tactic of Resistance&body=Check out this tactic of nonviolent resistance from Nonviolence International: "+tactic+" - "+encodeURIComponent(window.location.href);
	document.getElementById("twitter-share-header").setAttribute('data-url', window.location.href);
	document.getElementById("twitter-share-header").setAttribute('data-text', "Check out this tactic of nonviolent resistance from Nonviolence International! \n\n"+tactic+"\n");

	window.onresize = resizeCategories;
	window.onresize = resizeTacticSelectors;
});

document.getElementById("prev-tactic-example").addEventListener("click", function(){
	currentTacticDes += -1;
	showTacticDescription(currentTacticDes);
});

document.getElementById("next-tactic-example").addEventListener("click", function(){
	currentTacticDes += 1;
	showTacticDescription(currentTacticDes);
});

/*document.getElementById("tacticpage-down-arrow").addEventListener("click", () => window.scrollTo({
  top: 700,
  behavior: 'smooth',
}));*/

document.getElementById("tacticpage-down-arrow").addEventListener("click", function(){
	SmoothVerticalScrolling(this, 300, "center");
});	

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

function resizeCategories(){
	//Change category list layout for smaller screen - vertical stack instead of indented list
	var categories = document.getElementsByClassName("category-list-tacticpage");
	if(window.innerWidth >= 1000){
		for(var i = 0; i < categories.length; i++){
			categories[i].style.marginLeft = ((i+1)*30)+"px";
		}
	}else{
	    for(var i = 0; i < categories.length; i++){
			categories[i].style.marginLeft = "auto";
		}
	}
}

function resizeTacticSelectors(){
	//Update location of next-tactic button to header and not picture div
	var next = document.getElementById("next-tacticpage");
	var prev = document.getElementById("prev-tacticpage");
	if(window.innerWidth >= 750){
		next.style.display = "inline-block";
		prev.style.display = "inline-block";
		if(window.innerWidth >= 1000){
			var bool = document.getElementById("tacticinfo-container").contains(next);
			console.log(bool);
			if(bool){
				document.getElementById("tacticinfo-container").removeChild(next);
			}
			document.getElementById("tacticpage-pic-container").appendChild(next);
		}else{
			var bool = document.getElementById("tacticpage-pic-container").contains(next);
			console.log(bool);
			if(bool){
				document.getElementById("tacticpage-pic-container").removeChild(next);
			}
		    document.getElementById("tacticinfo-container").appendChild(next);
		}
	}else{
		next.style.display = "none";
		prev.style.display = "none";
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

function SmoothVerticalScrolling(e, time, where) {
    var eTop = e.getBoundingClientRect().top;
    console.log(eTop);
    var eAmt = ((eTop + 200)/ 100);
    var curTime = 0;
    while (curTime <= time) {
        window.setTimeout(SVS_B, curTime, eAmt, where);
        curTime += time / 100;
    }
}

function SVS_B(eAmt, where) {
    if(where == "center"){
    	eAmt = eAmt;
        window.scrollBy(0, eAmt);
    }
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
    if(width >= 750){
	    if(width >= 1000){
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
		}else{
			if(ratio < .12 && (e.pageY > 65 && e.pageY < 200)) {
		    	prev.style.visibility = "visible";
		    	prev.style.opacity = "100";
		    }else{
		    	prev.style.visibility = "hidden";
		    	prev.style.opacity = "0";
		    }

		    if(ratio > .88 && (e.pageY > 65 && e.pageY < 200)) {
		    	next.style.visibility = "visible";
		    	next.style.opacity = "100";
		    }else{
		    	next.style.visibility = "hidden";
		    	next.style.opacity = "0";
		    }
		}
	}
});

