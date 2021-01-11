var gridRowClicked = false;
var gridColClicked = false;
var expressionTactics = [];
var commissionTactics = [];
var omissionTactics = [];
var hideItems = {};
var lastClicked = [];

function displayDropdown() {
  var dropdown = document.getElementById("categories-dropdown-button");
  var dropdownDiv = document.getElementById("categories-dropdown");
  var buttons = document.getElementsByClassName("categories-buttons");
  var logo = document.getElementById("sub-logo-img");
  var categoryChoose = document.getElementById("category-view-choose");

  if(window.innerWidth < 950){
    categoryChoose.style.display = "none";
    document.getElementById("category-table-view").classList.remove("selected-view");
    document.getElementById("table-view").style.display = "none";
    document.getElementById("list-view").style.display = "block";
    dropdown.style.display = "block";
    dropdownDiv.style.display = "block";
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].style.display = "none";
    }
    logo.classList.add("centered-logo");
  }else{
    categoryChoose.style.display = "block";
    document.getElementById("category-list-view").classList.remove("selected-view");
    document.getElementById("category-table-view").classList.add("selected-view");
    document.getElementById("table-view").style.display = "block";
    document.getElementById("list-view").style.display = "none";
    dropdown.style.display = "none";
    dropdownDiv.classList.remove("showDropdown");
    dropdownDiv.style.display = "none";
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].style.display = "inline-block";
    }
    logo.classList.remove("centered-logo");
  }
}

function clickParent(event){
  event.target.parentElement.click();
}

function gridClick(event){
  switch(event.target.id) {
    case "acts-of-expression":
      var grid = event.target.parentElement;
      event.target.classList.toggle("clicked-grid");
      waitClickAllGrid();

      toggleHide("acts-of-expression", "omission", "commission", false);

      grid.style.gridTemplateRows = "100px 300px";
      document.getElementById("sub-acts-of-expression").classList.toggle("hideExtra");
      toggleShow("expression");
      gridRowClicked = true;

      if(gridColClicked == true){
        document.getElementById(lastClicked[lastClicked.length - 2]).classList.toggle("cant-click");
      }

      setTimeout(function(){
        waitClickAllGrid();
      }, 500);

      break;
    case "acts-of-omission":
      var grid = event.target.parentElement;
      event.target.classList.toggle("clicked-grid");
      waitClickAllGrid();
      toggleRowClick("omission");

      toggleHide("acts-of-omission", "expression", "commission", false);

      grid.style.gridTemplateRows = "100px 300px";
      document.getElementById("sub-acts-of-omission").classList.toggle("hideExtra");
      toggleShow("omission");
      gridRowClicked = true;

      if(gridColClicked == true){
        document.getElementById(lastClicked[lastClicked.length - 2]).classList.toggle("cant-click");
      }

      setTimeout(function(){
        waitClickAllGrid();
      }, 500);

      break;
    case "acts-of-commission":
      var grid = event.target.parentElement;
      event.target.classList.toggle("clicked-grid");
      waitClickAllGrid();
      toggleRowClick("commission");

      toggleHide("acts-of-commission", "expression", "omission", false);

      grid.style.gridTemplateRows = "100px 300px";
      document.getElementById("sub-acts-of-commission").classList.toggle("hideExtra");
      toggleShow("commission");
      gridRowClicked = true;

      if(gridColClicked == true){
        document.getElementById(lastClicked[lastClicked.length - 2]).classList.toggle("cant-click");
      }

      setTimeout(function(){
        waitClickAllGrid();
      }, 500);

      break;
    case "coercive":
      var grid = event.target.parentElement;
      event.target.classList.toggle("clicked-grid-y");
      waitClickAllGrid();

      toggleHide("coercive", "persuasive", null, false);

      grid.style.gridTemplateColumns = "325px 650px";
      setTimeout(function(){
        document.getElementById("sub-coercive").classList.toggle("hideExtra");
      }, 400);
      toggleShowTactics("coercive");

      if(gridRowClicked == true){
        document.getElementById(lastClicked[lastClicked.length - 2]).classList.toggle("cant-click");
      }

      setTimeout(function(){
        waitClickAllGrid();
      }, 500);

      gridColClicked = true;
      break
    case "persuasive":
      var grid = event.target.parentElement;
      event.target.classList.toggle("clicked-grid-y");
      waitClickAllGrid();
      toggleColClick("persuasive");

      toggleHide("persuasive", "coercive", null, false);

      grid.style.gridTemplateColumns = "325px 650px";
      setTimeout(function(){
        document.getElementById("sub-persuasive").classList.toggle("hideExtra");
      }, 400);
      toggleShowTactics("persuasive");

      if(gridRowClicked == true){
        document.getElementById(lastClicked[lastClicked.length - 2]).classList.toggle("cant-click");
      }

      setTimeout(function(){
        waitClickAllGrid();
      }, 500);

      gridColClicked = true;
      break
  }
}

function gridUnclick(event){
  switch(event.target.id) {
    case "acts-of-expression":
      var grid = event.target.parentElement;
      event.target.classList.toggle("clicked-grid");
      waitClickAllGrid();
      document.getElementById("sub-acts-of-expression").classList.toggle("hideExtra");
      toggleShow("expression");
      grid.style.gridTemplateRows = "100px 100px 100px 100px";
      setTimeout(function(){
        toggleHide("acts-of-expression", "omission", "commission", true);
        gridRowClicked = false;
        if(gridColClicked == true){
          document.getElementById(lastClicked[lastClicked.length - 1]).classList.toggle("cant-click");
        }
      }, 400);
      setTimeout(function(){
        waitClickAllGrid();
      }, 500);
      break;
    case "acts-of-omission":
      var grid = event.target.parentElement;
      event.target.classList.toggle("clicked-grid");
      waitClickAllGrid();
      document.getElementById("sub-acts-of-omission").classList.toggle("hideExtra");
      toggleShow("omission");
      grid.style.gridTemplateRows = "100px 100px 100px 100px";
      toggleRowUnclick("omission");
      setTimeout(function(){
        toggleHide("acts-of-omission", "expression", "commission", true);
        gridRowClicked = false;
        if(gridColClicked == true){
          document.getElementById(lastClicked[lastClicked.length - 1]).classList.toggle("cant-click");
        }
      }, 400);
      setTimeout(function(){
        waitClickAllGrid();
      }, 500);
      break;
    case "acts-of-commission":
      var grid = event.target.parentElement;
      event.target.classList.toggle("clicked-grid");
      waitClickAllGrid();
      document.getElementById("sub-acts-of-commission").classList.toggle("hideExtra");
      toggleShow("commission");
      grid.style.gridTemplateRows = "100px 100px 100px 100px";
      toggleRowUnclick("commission");
      setTimeout(function(){
        toggleHide("acts-of-commission", "expression", "omission", true);
        gridRowClicked = false;
        if(gridColClicked == true){
          document.getElementById(lastClicked[lastClicked.length - 1]).classList.toggle("cant-click");
        }
      }, 400);
      setTimeout(function(){
        waitClickAllGrid();
      }, 500);
      gridRowClicked = false;
      break;
    case "coercive":
      var grid = event.target.parentElement;
      event.target.classList.toggle("clicked-grid-y");
      waitClickAllGrid();
      toggleHideTactics("coercive");
      document.getElementById("sub-coercive").classList.toggle("hideExtra");
      grid.style.gridTemplateColumns = "325px 325px 325px";
      if(gridRowClicked){
        document.getElementById(lastClicked[lastClicked.length - 2].split("-")[2]+"-coercive-desc").classList.toggle("hideExtra");
        document.getElementById(lastClicked[lastClicked.length - 2].split("-")[2]+"-persuasive-desc").classList.toggle("hideExtra");
      }
      setTimeout(function(){
        toggleHide("coercive", "persuasive", null, true);
        gridColClicked = false;
        if(gridRowClicked == true){
          document.getElementById(lastClicked[lastClicked.length - 1]).classList.toggle("cant-click");
        }
      }, 400);
      setTimeout(function(){
        waitClickAllGrid();
      }, 500);
      break;
    case "persuasive":
      var grid = event.target.parentElement;
      event.target.classList.toggle("clicked-grid-y");
      waitClickAllGrid();
      toggleHideTactics("persuasive");
      document.getElementById("sub-persuasive").classList.toggle("hideExtra");
      grid.style.gridTemplateColumns = "325px 325px 325px";
      toggleColUnclick("persuasive");
      if(gridRowClicked){
        document.getElementById(lastClicked[lastClicked.length - 2].split("-")[2]+"-coercive-desc").classList.toggle("hideExtra");
        document.getElementById(lastClicked[lastClicked.length - 2].split("-")[2]+"-persuasive-desc").classList.toggle("hideExtra");
      }
      setTimeout(function(){
        toggleHide("persuasive", "coercive", null, true);
        gridColClicked = false;
        if(gridRowClicked == true){
          document.getElementById(lastClicked[lastClicked.length - 1]).classList.toggle("cant-click");
        }
      }, 400);
      setTimeout(function(){
        waitClickAllGrid();
      }, 500);
      break;
  }
}

function toggleGridRowClick(event) {
  gridRowClicked ? gridUnclick(event) : gridClick(event);
}

function toggleGridColClick(event) {
  gridColClicked ? gridUnclick(event) : gridClick(event);
}

function toggleHide(thisCat, firstHideCat, secondHideCat, prevClicked){
  var firstCatGroup = document.getElementsByClassName(firstHideCat);
  var secondCatGroup = document.getElementsByClassName(secondHideCat);
  if(prevClicked == false){
    if(gridRowClicked || gridColClicked){
      var hidden = [];
      for (var i = 0; i < firstCatGroup.length; i++) {
        if(!firstCatGroup[i].classList.contains("hideExtra")){
          firstCatGroup[i].classList.toggle("hideExtra");
          hidden.push(firstCatGroup[i].id);
        }
      }
      for (var i = 0; i < secondCatGroup.length; i++) {
        if(!secondCatGroup[i].classList.contains("hideExtra")){
          secondCatGroup[i].classList.toggle("hideExtra");
          hidden.push(secondCatGroup[i].id);
        }
      }
      if(gridRowClicked && (thisCat == "persuasive" || thisCat == "coercive")){
        document.getElementById(lastClicked[lastClicked.length - 1].split("-")[2]+"-coercive-desc").classList.toggle("hideExtra");
        document.getElementById(lastClicked[lastClicked.length - 1].split("-")[2]+"-persuasive-desc").classList.toggle("hideExtra");
      }
      hideItems[thisCat] = hidden;
    }else{
      var hidden = [];
      for (var i = 0; i < firstCatGroup.length; i++) {
        firstCatGroup[i].classList.toggle("hideExtra");
        hidden.push(firstCatGroup[i].id);
      }
      for (var i = 0; i < secondCatGroup.length; i++) {
        secondCatGroup[i].classList.toggle("hideExtra");
        hidden.push(secondCatGroup[i].id);
      }
      hideItems[thisCat] = hidden;
    }
    lastClicked.push(thisCat);
  }else{
    var restore = hideItems[thisCat];
    for(var i = 0; i < restore.length; i++){
      document.getElementById(restore[i]).classList.toggle("hideExtra");
    }
    delete hideItems[thisCat];
    removeLast(lastClicked, 1);
  }
}


function toggleRowClick(cat){
  var catGroup = document.getElementsByClassName(cat);
  for (var i = 0; i < catGroup.length; i++) {
    catGroup[i].style.gridRow = "2 / 3";
  }
}


function toggleColClick(cat){
  var catGroup = document.getElementsByClassName(cat);
  for (var i = 0; i < catGroup.length; i++) {
    catGroup[i].style.gridColumn = "2 / 3";
  }
}


function toggleRowUnclick(cat){
  var catGroup = document.getElementsByClassName(cat);
  switch(cat) {
    case "omission":
      for (var i = 0; i < catGroup.length; i++) {
        catGroup[i].style.gridRow = "3 / 4";
      }
      break;
    case "commission":
      for (var i = 0; i < catGroup.length; i++) {
        catGroup[i].style.gridRow = "4 / 5";
      }
      break;
    default:
      console.log("toggleGridUnclick error");
  }
}


function toggleColUnclick(cat){
  var catGroup = document.getElementsByClassName(cat);
  switch(cat) {
    case "persuasive":
      for (var i = 0; i < catGroup.length; i++) {
        catGroup[i].style.gridColumn = "3 / 4";
      }
      break;
    default:
      console.log("toggleGridUnclick error");
  }
}


function toggleShow(cat){
  if(gridColClicked){
    //document.getElementById(cat+"-coercive-click").classList.add("table-info-spacing");
    document.getElementById(cat+"-coercive-click").classList.toggle("hideExtra");
    document.getElementById(cat+"-persuasive-click").classList.toggle("hideExtra");
  }else{
    document.getElementById(cat+"-coercive-desc").classList.toggle("hideExtra");
    document.getElementById(cat+"-persuasive-desc").classList.toggle("hideExtra");
    document.getElementById(cat+"-coercive-click").classList.toggle("hideExtra");
    document.getElementById(cat+"-persuasive-click").classList.toggle("hideExtra");
  }
}


function waitClickAllGrid(){
  var gridRowElements = document.getElementsByClassName("grid-item-row");
  var gridColElements = document.getElementsByClassName("grid-item-col");
  for (var i = 0; i < gridRowElements.length; i++) {
    gridRowElements[i].classList.toggle("wait-click");
  }
  for (var i = 0; i < gridColElements.length; i++) {
    gridColElements[i].classList.toggle("wait-click");
  }
}

//For recursive CTE query, change out the uncommented with commented if conditions
function toggleShowTactics(cat){
  ajaxCall('/categoryTactics', function(data) {
    var e, o, c;
    e = o = c = 0;
    var tactics = JSON.parse(data);
    tactics = shuffle(tactics);
    tactics.forEach((tactic) => {
      if(tactic[cat] == 1){
        var cats = tactic['parent_categories'].split("; ");
        var highestCat = cats[cats.length - 1];
        //console.log(highestCat);
        if(highestCat == 'Acts of Expression' && e < 5){
        //if(tactic['category_name'] == 'Acts of Expression' && e < 5){
          var a = createLink(tactic.name);
          document.getElementById(cat+"-expression-tactics").append(a);
          if(e != 4){ 
            document.getElementById(cat+"-expression-tactics").append(" | ");
          }
          e++;
        }else if(highestCat == 'Acts of Omission' && o < 5){
        //}else if(tactic['category_name'] == 'Acts of Omission' && o < 5){
          var a = createLink(tactic.name);
          document.getElementById(cat+"-omission-tactics").append(a);
          if(o != 4){ 
            document.getElementById(cat+"-omission-tactics").append(" | ");
          }
          o++;
        }else if(highestCat == 'Acts of Commission' && c < 5){
        //}else if(tactic['category_name'] == 'Acts of Commission' && c < 5){
          var a = createLink(tactic.name);
          document.getElementById(cat+"-commission-tactics").append(a);
          if(c != 4){ 
            document.getElementById(cat+"-commission-tactics").append(" | ");
          }
          c++;
        }
      }
    });

    document.getElementById("expression-"+cat+"-desc").classList.toggle("hideExtra");
    document.getElementById("omission-"+cat+"-desc").classList.toggle("hideExtra");
    document.getElementById("commission-"+cat+"-desc").classList.toggle("hideExtra");
    document.getElementById(cat+"-expression-click").classList.toggle("hideExtra");
    document.getElementById(cat+"-omission-click").classList.toggle("hideExtra");
    document.getElementById(cat+"-commission-click").classList.toggle("hideExtra");

  }, function(data) {console.log(data);});
}


function toggleHideTactics(cat){
  document.getElementById(cat+"-expression-tactics").innerHTML = "";
  document.getElementById(cat+"-omission-tactics").innerHTML = "";
  document.getElementById(cat+"-commission-tactics").innerHTML = "";

  document.getElementById("expression-"+cat+"-desc").classList.toggle("hideExtra");
  document.getElementById("omission-"+cat+"-desc").classList.toggle("hideExtra");
  document.getElementById("commission-"+cat+"-desc").classList.toggle("hideExtra");
  document.getElementById(cat+"-expression-click").classList.toggle("hideExtra");
  document.getElementById(cat+"-omission-click").classList.toggle("hideExtra");
  document.getElementById(cat+"-commission-click").classList.toggle("hideExtra");
}


function categoryModal(event){
  event.stopPropagation();
  switch(event.target.id.split("-")[0]){
    case "expression":
      ajaxPost('/siteText', ["categories", "Acts of Expression"], appendModalText, errorCategoryText);
      document.getElementById("modal-header").innerHTML = "Acts of Expression";
      break;
    case "omission":
      ajaxPost('/siteText', ["categories", "Acts of Omission"], appendModalText, errorCategoryText);
      document.getElementById("modal-header").innerHTML = "Acts of Omission";
      break;
    case "commission":
      ajaxPost('/siteText', ["categories", "Acts of Commission"], appendModalText, errorCategoryText);
      document.getElementById("modal-header").innerHTML = "Acts of Commission";
      break;
    case "coercive":
      ajaxPost('/siteText', ["categories", "Coercive"], appendModalText, errorCategoryText);
      document.getElementById("modal-header").innerHTML = "Coercive";
      break;
    case "persuasive":
      ajaxPost('/siteText', ["categories", "Persuasive"], appendModalText, errorCategoryText);
      document.getElementById("modal-header").innerHTML = "Persuasive";
      break;
    default:
      console.log("error");
  }
  document.getElementById("category-modal").classList.toggle("hideExtra");
}


function appendModalText(data){
  var content = JSON.parse(data);
  var text = content[0]['text'];
  document.getElementById("modal-body").innerHTML = text;
}


function chooseView(event){
  if(event.target.nextElementSibling == null){
    event.target.previousElementSibling.classList.toggle("selected-view");
  }else{
    event.target.nextElementSibling.classList.toggle("selected-view");
  }
  event.target.classList.toggle("selected-view");
}


function populateCategoryList(categoryLevel, parentCategory){
  Object.keys(categoryLevel).forEach(function(level) {
    for(var i = 0; i < categoryLevel[level].length; i++){
      document.getElementById("category-"+(i+1)).innerHTML = categoryLevel[level][i];
    }
  });
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


function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
}


function createLink(text){
  var a = document.createElement('a');
  var linkText = document.createTextNode(text);
  a.appendChild(linkText);
  a.title = "Visit Tactic Page";
  a.href = "/tactics/"+encodeURIComponent(text);
  return a;
}


function removeLast(arr, n){
    arr.splice(arr.length-n, arr.length);
    return arr;
}


function errorCategoryText(){
  console.log("error");
}


function insertAfter(newNode, existingNode, parent) {

  parent.insertBefore(newNode, existingNode.nextSibling);
}


function visitTacticPage(event){
  window.location.href="/tactics/"+encodeURIComponent(event.target.innerText);
}


document.addEventListener("DOMContentLoaded", function(e) {
  var catLink = document.getElementById("categories-link");
	var dropdown = document.getElementById("categories-dropdown-button");
  var dropdownDiv = document.getElementById("categories-dropdown");
  var buttons = document.getElementsByClassName("categories-buttons");
  var logo = document.getElementById("sub-logo-img");
  var categoryChoose = document.getElementById("category-view-choose");

  //box categories navbar button if current page is categories
  if (window.location.href.indexOf("categories") > -1){
    catLink.setAttribute("style", "border: 2px solid");
  }

  //toggle dropdown and filter visibility based on screen width 
	if(window.innerWidth < 950){
    categoryChoose.style.display = "none";
    document.getElementById("category-table-view").classList.remove("selected-view");
    document.getElementById("table-view").style.display = "none";
    document.getElementById("list-view").style.display = "block";
    dropdown.style.display = "block";
    dropdownDiv.style.display = "block";
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].style.display = "none";
    }
    logo.classList.add("centered-logo");
	}else{
    categoryChoose.style.display = "block";
    //document.getElementById("category-list-view").classList.remove("selected-view");
    //document.getElementById("category-table-view").classList.add("selected-view");
    document.getElementById("table-view").style.display = "block";
    document.getElementById("list-view").style.display = "none";
    dropdown.style.display = "none";
    dropdownDiv.style.display = "none";
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].style.display = "inline-block";
		}
    logo.classList.remove("centered-logo");
	}

  document.getElementById("category-table-view").classList.toggle("selected-view");

  //monitor size and toggle dropdown and filter icons accordingly
	window.onresize = displayDropdown;

  var gridRowElements = document.getElementsByClassName("grid-item-row");
  var gridColElements = document.getElementsByClassName("grid-item-col");
  var gridSubElements = document.getElementsByClassName("grid-item-subinfo");
  var gridColSubElements = document.getElementsByClassName("grid-item-col-subinfo");
  var learnMoreButtonsCol = document.getElementsByClassName("category-learn-more-col");
  var learnMoreButtonsRow = document.getElementsByClassName("category-learn-more");
  var categoryChooseButton = document.getElementsByClassName("category-choose-button");
  var listTacticButton = document.getElementsByClassName("category-list-tactic-button");
  for (var i = 0; i < gridRowElements.length; i++) {
    gridRowElements[i].addEventListener('click', toggleGridRowClick, false);
  }
  for (var i = 0; i < gridColElements.length; i++) {
    gridColElements[i].addEventListener('click', toggleGridColClick, false);
  }
  for (var i = 0; i < gridSubElements.length; i++) {
    gridSubElements[i].addEventListener('click', clickParent, false);
  }
  for (var i = 0; i < gridColSubElements.length; i++) {
    gridColSubElements[i].addEventListener('click', clickParent, false);
  }
  for (var i = 0; i < learnMoreButtonsCol.length; i++) {
    learnMoreButtonsCol[i].addEventListener('click', categoryModal, false);
  }
  for (var i = 0; i < learnMoreButtonsRow.length; i++) {
    learnMoreButtonsRow[i].addEventListener('click', categoryModal, false);
  }
  for (var i = 0; i < categoryChooseButton.length; i++) {
    categoryChooseButton[i].addEventListener('click', chooseView, false);
  }

  //add main category page intoduction text
  ajaxPost('/siteText', ["categories", "main_page"], function(data) {
    var content = JSON.parse(data);
    var text = content[0]['text'];
    var firstSentence = content[0]['text'].split(".")[0]+".";
    var secondSentence = content[0]['text'].split(".")[1]+".";
    document.getElementById("table-context-para").append(firstSentence);
    document.getElementById("table-context-para").innerHTML += "<br>";
    document.getElementById("table-context-para").append(secondSentence);
    }, errorCategoryText);

  ajaxCall('/categoryList', function(data) {
    var uniqueCategories = new Set();
    var categoryLevel = {};
    var parentCategory = {};
    var categoryTactics = {};
    var levelCategoryToTactics = {};
    var categories = [];
    var expression = ["ActsofExpression"];
    var commission = ["ActsofCommission"];
    var omission = ["ActsofOmission"];

    var tactics = JSON.parse(data);

    tactics.forEach((tactic) => {
      var lastCategory = "";
      categories = tactic["categories"].split("; ").reverse();

      categories.forEach((category, i) => {
        if(lastCategory != ""){
          parentCategory[category] = lastCategory;
        }
        uniqueCategories.add(category);
        if(categoryLevel[i+1] != null){
          categoryLevel[i+1].add(category);
        }else{
          let categoryContainer = new Set();
          categoryLevel[i+1] = categoryContainer.add(category);
        }
        if(i+1 == categories.length){
          if(categoryTactics[category] == null){
            categoryTactics[category] = [tactic["name"]];
          }else{
            categoryTactics[category].push(tactic["name"]);
          }
        }
        lastCategory = category;
      });
    });

    Object.keys(categoryLevel).forEach(function(level) {
      var taticDiv = null;
      var tacticRow = null;
      var tacticButton = null;
      if(level != 1){
        var catLevel = Array.from(categoryLevel[level]);
        for(var i = 0; i < catLevel.length; i++){
          var newDiv = document.createElement("div"); 
          var newContent = document.createTextNode(catLevel[i]);
          newDiv.appendChild(newContent);
          newDiv.id = catLevel[i].replace(/\s/g, '')+"-"+level;
          newDiv.style.marginLeft = ((level-1)*30)+"px";
          newDiv.style.fontSize = 1+((1/(.9*(level))))+"em";
          if(categoryTactics[catLevel[i]] != null){
            tacticDiv = document.createElement("div");
            var tacticRow = document.createElement("div");
            tacticRow.className = "category-list-tactic";
            var len = categoryTactics[catLevel[i]].length;
            categoryTactics[catLevel[i]].forEach((tactic, i) => {
              var tacticButton = document.createElement("BUTTON");
              var tacticText = document.createTextNode(tactic);
              tacticButton.appendChild(tacticText);
              tacticButton.className = "category-list-tactic-button";
              tacticRow.appendChild(tacticButton);
              if(i+1 != len){
                tacticRow.innerHTML += " ---/--- ";
              }
            });
            tacticDiv.appendChild(tacticRow);
            tacticDiv.style.marginLeft = ((level)*35)+"px";
          }else{
            tacticDiv = null;
          }
          var parent = parentCategory[catLevel[i]];
          var expressionIndex = expression.indexOf(parent.replace(/\s/g, ''));
          if(expressionIndex != -1){
            expression.splice(expressionIndex+1, 0, catLevel[i].replace(/\s/g, ''));
            insertAfter(newDiv, document.getElementById(expression[expressionIndex].replace(/\s/g, '')+"-"+(level-1)), document.getElementById("ActsofExpression"));
            if(tacticDiv != null){
              if(levelCategoryToTactics[level] == null){
                var array = [];
                array.push([tacticDiv, newDiv, document.getElementById("ActsofExpression")]);
                levelCategoryToTactics[level] = array;
              }else{
                levelCategoryToTactics[level].push([tacticDiv, newDiv, document.getElementById("ActsofExpression")]);
              }
              //insertAfter(tacticDiv, newDiv, document.getElementById("ActsofExpression"));
            }
          }else{
            var omissionIndex = omission.indexOf(parent.replace(/\s/g, ''));
            var commissionIndex = commission.indexOf(parent.replace(/\s/g, ''));
            if(omissionIndex != -1){
              omission.splice(omissionIndex+1, 0, catLevel[i].replace(/\s/g, ''));
              insertAfter(newDiv, document.getElementById(omission[omissionIndex].replace(/\s/g, '')+"-"+(level-1)), document.getElementById("ActsofOmission"));
              if(tacticDiv != null){
                if(levelCategoryToTactics[level] == null){
                  var array = [];
                  array.push([tacticDiv, newDiv, document.getElementById("ActsofOmission")]);
                  levelCategoryToTactics[level] = array;
                }else{
                  levelCategoryToTactics[level].push([tacticDiv, newDiv, document.getElementById("ActsofOmission")]);
                }
                //insertAfter(tacticDiv, newDiv, document.getElementById("ActsofOmission"));
              }
            }else if(commissionIndex != -1){
              commission.splice(commissionIndex+1, 0, catLevel[i].replace(/\s/g, ''));
              insertAfter(newDiv, document.getElementById(commission[commissionIndex].replace(/\s/g, '')+"-"+(level-1)), document.getElementById("ActsofCommission"));
              if(tacticDiv != null){
                if(levelCategoryToTactics[level] == null){
                  var array = [];
                  array.push([tacticDiv, newDiv, document.getElementById("ActsofCommission")]);
                  levelCategoryToTactics[level] = array;
                }else{
                  levelCategoryToTactics[level].push([tacticDiv, newDiv, document.getElementById("ActsofCommission")]);
                }
                //insertAfter(tacticDiv, newDiv, document.getElementById("ActsofCommission"));
              }
            }else{
              console.log(catLevel[i]);
            }
          }
        }
      }else{
        var catLevel = Array.from(categoryLevel[level]);
        for(var i = 0; i < catLevel.length; i++){
          var newDiv = document.createElement("div"); 
          var newSpan = document.createElement("span");
          var newContent = document.createTextNode(catLevel[i]);
          newSpan.appendChild(newContent);
          newDiv.appendChild(newSpan);
          newDiv.id = catLevel[i].replace(/\s/g, '')+"-"+level;

          if(catLevel[i] == "Acts of Expression"){
            document.getElementById("ActsofExpression").appendChild(newDiv);
          }else if(catLevel[i] == "Acts of Omission"){
            document.getElementById("ActsofOmission").appendChild(newDiv);
          }else{
            document.getElementById("ActsofCommission").appendChild(newDiv);
          }

        tacticDiv = null;
        tacticRow = null;
        tacticButton = null;
        }
      }

    tacticDiv = null;
    tacticRow = null;
    tacticButton = null;
    });

    var thing = "no";
    var shit = "hey";
    for(var i = Object.keys(levelCategoryToTactics).length + 1; i > 1; i--){
      levelCategoryToTactics[i].forEach(function(grouping){
        insertAfter(grouping[0], grouping[1], grouping[2]);
      });
    }

    var listTacticButton = document.getElementsByClassName("category-list-tactic-button");
    for(var i = 0; i < listTacticButton.length; i++) {
      listTacticButton[i].addEventListener('click', visitTacticPage, false);
    }

    /*document.getElementById("table-view").style.display = "none";
    document.getElementById("list-view").style.display = "block";*/
  }, errorCategoryText);
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


document.getElementById("categories-dropdown-button").addEventListener("click", function(){
  var dropdown = document.getElementById("categories-dropdown");
  dropdown.classList.toggle("showDropdown");
});


document.getElementById("dataset-link").addEventListener("click", function(){
  window.location.href="/downloads";
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
  window.location.href="/downloads";
});


window.onclick = function(event) {
  if (event.target == document.getElementById("category-modal")) {
    document.getElementById("category-modal").classList.toggle("hideExtra");
  }
}


document.getElementById("modal-exit").addEventListener("click", function(){
  document.getElementById("category-modal").classList.toggle("hideExtra");
});


document.getElementById("category-table-view").addEventListener("click", function(){
  document.getElementById("list-view").style.display = "none";
  document.getElementById("table-view").style.display = "block";
  /*document.getElementById("ActsofExpression").innerHTML = "";
  document.getElementById("ActsofOmission").innerHTML = "";
  document.getElementById("ActsofCommission").innerHTML = "";*/
});


document.getElementById("category-list-view").addEventListener("click", function(){
  document.getElementById("table-view").style.display = "none";
  document.getElementById("list-view").style.display = "block";
});
