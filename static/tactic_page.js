var pic;
var sharpNum;
var currentTacticDes = 0;
var tactic;
const colorThief = new ColorThief();
const primaryPalette = [[209,17,65], [0,177,89], [0,174,219], [243,119,53], [255,196,37]];
const coolbluePalette = [[0,80,115], [16,125,172], [24,154,211], [30,187,215], [113,199,236]];
const twilightsparklePalette = [[54,59,116], [103,56,136], [239,79,145], [199,157,215], [77,27,123]];
const redorangePalette = [[255,193,0], [255,154,0], [255,116,0], [255,77,0], [255,0,0]];
const greenlovePalette = [[131,193,60], [134,195,141], [181,216,170], [211,229,215], [233,238,232]];
const palette = [[0,80,115], [16,125,172], [24,154,211], [30,187,215], [113,199,236], //strong blue
				[54,59,116], [103,56,136], [239,79,145], [199,157,215], [77,27,123], //strong purple-pink
				[255,193,0], [255,154,0], [255,116,0], [255,77,0], //strong yellow-orange
				[131,193,60], [134,195,141], [181,216,170], [211,229,215], [233,238,232], //strong green
				[229,228,226],  //muted grey
                [255,253,208], [244,244,224], [255,249,222], [240,217,208], [255,248,230], //muted tan
                [244,194,194], [245,213,251], [225,180,180], [249,193,175], [249,232,239], //muted red-pink
                [198,239,245], [199,238,230], [212,239,254], [203,230,255], //muted blue
                [209,242,192], [211,229,215], [238,255,229], //muted green
                [237,234,255], [203,212,255]]; //muted purple];
//const otherPalette = [[91, 192, 190]];

//check if load is coming from reload or back navigation - move the window to top to see loading icon
if (performance.navigation.type == performance.navigation.TYPE_RELOAD || performance.navigation.type == performance.navigation.TYPE_BACK_FORWARD) {
	window.addEventListener('beforeunload', function () {
		document.getElementsByTagName("body")[0].style.display = "none";
  		window.scrollTo(0, 0);
	});
}

//check if mobile user
window.mobileCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

document.addEventListener("DOMContentLoaded", function(e) {
	var timer = setTimeout(loadPage, 3000);
	var tacticPictureDiv = document.getElementById("tacticpage-pic-container");

	//if pic exists, use image palette color for description background
	if(pic != null && pic != "NULL" && pic != " " && pic != ""){
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
	}else{
		var rgb = palette[Math.floor(Math.random() * palette.length)];
		tacticPictureDiv.style.backgroundColor = 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';
		document.getElementById('tacticinfo-container').style.backgroundColor = "#b5d6fd";
		var headerText = document.getElementById("tacticinfo-sub-container");
		for(var i = 0; i < headerText.children.length; i++){
			headerText.children[i].style.color = "#033165";
		}
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

	//Do not show next/previous tactic buttons if page width is less than 750px
	if(window.innerWidth < 750){
		document.getElementById("prev-tacticpage").style.display = "none";
		document.getElementById("next-tacticpage").style.display = "none";
		document.getElementById("prev-tactic-example").style.display = "none";
		document.getElementById("next-tactic-example").style.display = "none";
	}

	document.getElementById("next-tacticpage").addEventListener("click", function(){
		ajaxCall("/getNext/"+encodeURIComponent(tactic), nextPrevTactic, nextPrevError);
	});

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

	//check if mobile - if so, change mailto functionality by removing iFrame
	if(window.mobileCheck()){
		document.getElementById("mail-share-header").removeAttribute('target');
		document.getElementById("mail-share-header").setAttribute('target', "_parent");

		document.getElementById("mail-share").removeAttribute('target');
		document.getElementById("mail-share").setAttribute('target', "_parent");
	}

	window.onresize = resizePage;
});

document.getElementById("prev-tactic-example").addEventListener("click", function(){
	currentTacticDes += -1;
	showTacticDescription(currentTacticDes);
});

document.getElementById("next-tactic-example").addEventListener("click", function(){
	currentTacticDes += 1;
	showTacticDescription(currentTacticDes);
});

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

/*document.addEventListener('touchmove', function(){
	var xDown = null;                                                        
	var yDown = null;
	if ( ! xDown || ! yDown ) {
        return;
    }
    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
        if ( xDiff > 0 ) {
            ajaxCall("/getNext/"+encodeURIComponent(tactic), nextPrevTactic, nextPrevError);
        } else {
            ajaxCall("/getNext/"+encodeURIComponent(tactic), nextPrevTactic, nextPrevError);
        }                       
    } else {
        if ( yDiff > 0 ) {
            ajaxCall("/getNext/"+encodeURIComponent(tactic), nextPrevTactic, nextPrevError);
        } else { 
            ajaxCall("/getNext/"+encodeURIComponent(tactic), nextPrevTactic, nextPrevError);
        }                                                                 
    }
    xDown = null;
    yDown = null; 
});*/
/*document.addEventListener('swiped-right', function(e) {
	console.log("ay");
	ajaxCall("/getNext/"+encodeURIComponent(tactic), nextPrevTactic, nextPrevError);
});*/

document.addEventListener('swiped-left', function(e) {
	var leftSwipeDiv = document.createElement("div");
	var leftSwipeArrow = document.createElement("span");
	leftSwipeDiv.id = "mobile-left-swipe";
	leftSwipeArrow.id = "left-swipe-arrow";
	leftSwipeArrow.className = "material-icons md-48";
	leftSwipeArrow.innerHTML = "keyboard_arrow_right";
	leftSwipeDiv.appendChild(leftSwipeArrow);
	document.getElementById("tactic-container").appendChild(leftSwipeDiv);
	//document.getElementById("mobile-left-swipe").style.display = "inline-block";
	ajaxCall("/getNext/"+encodeURIComponent(tactic), nextPrevTactic, nextPrevError);
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

function resizePage(){
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
	//Update location of next-tactic button to header and not picture div
	var next = document.getElementById("next-tacticpage");
	var prev = document.getElementById("prev-tacticpage");
	if(window.innerWidth >= 750){
		next.style.display = "inline-block";
		prev.style.display = "inline-block";
		document.getElementById("prev-tactic-example").style.display = "inline-block";
		document.getElementById("next-tactic-example").style.display = "inline-block";
		if(window.innerWidth >= 1000){
			var bool = document.getElementById("tacticinfo-container").contains(next);
			if(bool){
				document.getElementById("tacticinfo-container").removeChild(next);
			}
			document.getElementById("tacticpage-pic-container").appendChild(next);
		}else{
			var bool = document.getElementById("tacticpage-pic-container").contains(next);
			if(bool){
				document.getElementById("tacticpage-pic-container").removeChild(next);
			}
		    document.getElementById("tacticinfo-container").appendChild(next);
		}
	}else{
		next.style.display = "none";
		prev.style.display = "none";
		document.getElementById("prev-tactic-example").style.display = "none";
		document.getElementById("next-tactic-example").style.display = "none";
	}
}

function loadPage(){
	document.querySelector(".loader").style.display = "none";
	document.getElementById("tacticpage-load-screen").style.display = "none";
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
		    if(ratio < .08 && (e.pageY > 215 && e.pageY < 380)) {
		    	prev.style.visibility = "visible";
		    	prev.style.opacity = "100";
		    }else{
		    	prev.style.visibility = "hidden";
		    	prev.style.opacity = "0";
		    }

		    if(ratio > .92 && (e.pageY > 215 && e.pageY < 380)) {
		    	next.style.visibility = "visible";
		    	next.style.opacity = "100";
		    }else{
		    	next.style.visibility = "hidden";
		    	next.style.opacity = "0";
		    }
		}else{
			if(ratio < .12 && (e.pageY > 55 && e.pageY < 210)) {
		    	prev.style.visibility = "visible";
		    	prev.style.opacity = "100";
		    }else{
		    	prev.style.visibility = "hidden";
		    	prev.style.opacity = "0";
		    }

		    if(ratio > .88 && (e.pageY > 55 && e.pageY < 210)) {
		    	next.style.visibility = "visible";
		    	next.style.opacity = "100";
		    }else{
		    	next.style.visibility = "hidden";
		    	next.style.opacity = "0";
		    }
		}
	}
});

document.getElementById("prev-tacticpage").addEventListener("click", function(){
	ajaxCall("/getPrev/"+encodeURIComponent(tactic), nextPrevTactic, nextPrevError);
});

function nextPrevTactic(data){
	var tactic = JSON.parse(data)[0]['previous_name'];
	window.location.href="/tactics/"+encodeURIComponent(tactic);
}

function nextPrevError(data){
	console.log(data);
}

