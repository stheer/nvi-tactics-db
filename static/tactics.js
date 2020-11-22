/***************************GLOBAL VARIABLES*********************************/
var TACTICS = [];
var CATEGORIES = [];
var iso = "";
var clickedCategories = [0];
var qsRegex;
var quickSearch;
var buttonFilter = "";


/***************************REACT FUNCTIONS**********************************/
class TacticBlock extends React.Component {

  render() {
    var categoryString = "";
    const tactic = this.props.tactic;
    tactic.categories.split("; ").forEach((category) => {
      categoryString = categoryString + " " + category.replace(/\/|\s|\,|\'|\;|\-/g, '');
      if(categoryString.includes("1")){
        categoryString.replace("1", "one");
      }else if(categoryString.includes("2")){
        categoryString.replace("2", "two");
      }else if(categoryString.includes("3")){
        categoryString.replace("3", "three");
      }
    });
    return React.createElement("div", {id: "tactic-parent"+tactic.tactic_id, className: "tactic-block" + categoryString, onClick: tacticClick,
      style: {backgroundImage: `url("/static/tactic_pictures/`+tactic.picture+`_tn.jpg")`, zIndex: "99999"}}, 
      React.createElement("div", {id: "tactic-text"+tactic.tactic_id, className: "tactic-text"}, tactic.name));
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

}


class TacticsTable extends React.Component {

  render() {
    const tacticBoxes = [];
    this.props.tactics.forEach((tactic) => {
      tacticBoxes.push(React.createElement(TacticBlock, {tactic: tactic, key: tactic.tactic_id}, null))
    });
    return React.createElement("div", {id: "tactics-container"}, tacticBoxes);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  componentDidMount() {
    var elem = document.querySelector('#tactics-container');
    iso = new Isotope(elem, {
      itemSelector: '.tactic-block',
      layoutMode: 'fitRows',
      filter: function(itemElem) {
        var searchResult = qsRegex ? itemElem.textContent.match(qsRegex) : true;
        var buttonResult = buttonFilter ? itemElem.matches(buttonFilter) : true;
        return searchResult && buttonResult;
      }
    });

    if(window.innerWidth < 950){
      document.getElementById("tactic-dropdown").style.display = "block";
    }
  }

}


class ErrorBlock extends React.Component {

  render(){
    return React.createElement("div", {id: this.props.id}, this.props.message);
  }

}


class CategoryFilter extends React.Component {

  render() {
    const category = this.props.category;
    const display = this.props.categoryDisplay;
    const id = this.props.id;
    const extraClass = this.props.extraSelectorClass;
    const parentCategory = this.props.parentCategory;


    if(parentCategory != null){
      return React.createElement("button", {id: "tactic-category-filter"+id, className: "tactic-category-filter" + " " + extraClass + " " + parentCategory.replace(/\/|\s|\,|\'|\;|\-/g, ''), 
        "data-filter": category, onClick: isotopeFilter}, display);
    }else{
      return React.createElement("button", {id: "tactic-category-filter"+id, className: "tactic-category-filter" + " " + extraClass, 
        "data-filter": category, onClick: isotopeFilter}, display);
    }
    
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

}


class CategorySearch extends React.Component {

  render() {
    return React.createElement("input", {id: "tactic-category-search", className: "quickSearch", type: "text", placeholder: "Search", 
      onKeyUp: () => search(quickSearch.value)});
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

}


class CategoryLevel extends React.Component {

  render(){ 
    var categorySelectors = [];
    var i = 0;
    const categories = this.props.categories;
    const id = this.props.id;
    const extraGroupClass = this.props.extraClass;
    const parentCategory = this.props.parentCategory;

    if(id == 1){
      categorySelectors.push(React.createElement(CategoryFilter, {category: '*', categoryDisplay: 'All', id: 0, key: 0, extraSelectorClass: "is-checked"}, null));
    }

    categories.forEach((category) => {
      categorySelectors.push(React.createElement(CategoryFilter, {category: "." + category.replace(/\/|\s|\,|\'|\;|\-/g, ''), categoryDisplay: category, 
        id: id.toString()+i, key: category, extraSelectorClass: "", parentCategory: parentCategory[category]}, null));
      i++;
    });

    if(id == 1){
      categorySelectors.push(React.createElement(CategorySearch, {key: "search"}, null));
    }

    if(extraGroupClass != ""){
      return React.createElement("div", {id: "button-group"+id, className: extraGroupClass, style: {margin: "0 0 5px 20px"}}, categorySelectors);
    }else{
      return React.createElement("div", {id: "button-group"+id, style: {margin: "0 0 5px 20px"}}, categorySelectors);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

}


class CategoryTable extends React.Component {

  render(){ 
    var levels = [];
    var extraClass = "";
    const categoryListByLevel = this.props.categoryLevel;
    const categories = this.props.tacticCategories;
    const numLevels = Object.keys(categoryListByLevel).length;
    const parentCategory = this.props.parentCategory;

    for(var i = 1; i < numLevels + 1; i++){
      if(i != 1){
        extraClass = "hide";
      }
      levels.push(React.createElement(CategoryLevel, {categories: categoryListByLevel[i], id: i, key: i, extraClass: extraClass, parentCategory: parentCategory}, null));
    }

    return React.createElement("div", {id: "filter-container"}, levels);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  componentDidMount() {
    quickSearch = document.querySelector('.quickSearch');
  }

}


class TacticPage extends React.Component {
  
  render(){
    const name = this.props.tacticData[0].name;
    return React.createElement("div", {id: "tactic-name"}, name);
  }

}


/***************************JS UTILITY FUNCTIONS*****************************/
function displayDropdown() {
	var dropdown = document.getElementById("tactic-dropdown-button");
  var dropdownDiv = document.getElementById("tactic-dropdown");
  var buttons = document.getElementsByClassName("tactic-button");
  var logo = document.getElementById("sub-logo-img");
  var filter = document.getElementById("tactic-filter-button");
  var filterDiv = document.getElementById("tactic-filter");

	if(window.innerWidth < 950){
    dropdown.style.display = "block";
    dropdownDiv.style.display = "block";
    filter.style.display = "none";
    filterDiv.style.display = "none";
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].style.display = "none";
		}
	  logo.classList.add("centered-logo");
	}else{
    dropdown.style.display = "none";
    dropdownDiv.classList.remove("showDropdown");
    dropdownDiv.style.display = "none";
    filter.style.display = "inline-block";
	  for (var i = 0; i < buttons.length; i++) {
      buttons[i].style.display = "inline-block";
    }
		logo.classList.remove("centered-logo");
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


function removeLast(arr, n){
    arr.splice(arr.length-n, arr.length);
    return arr;
}


function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}


function loadTacticsBoxes(data){
  TACTICS = JSON.parse(data);
  console.log(TACTICS);

	ReactDOM.render(
    	React.createElement(TacticsTable, {tactics: TACTICS}, null), document.getElementById("container")
  );

  //load category filters
  loadCategories();
}


function loadTacticsBoxesError(){
	console.log("error");
	React.createElement(ErrorBlock, {id: "tactic-error-block", message: "Currently unable to access tactics from database. We will have the issue fixed shortly."}, 
    null), document.getElementById("container")
}


function loadCategories(){
  var uniqueCategories = new Set();
  var categoryLevel = {};
  var parentCategory = {};
  var categories = [];
  
  TACTICS.forEach((tactic) => {
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
      lastCategory = category;
    });

  });

  ReactDOM.render(
      React.createElement(CategoryTable, {tacticCategories: Array.from(uniqueCategories), categoryLevel: categoryLevel, parentCategory: parentCategory}, 
        null), document.getElementById("tactic-filter")
  );
}


function loadCategoriesError(){
  console.log("error");
  React.createElement(ErrorBlock, {id: "category-error-block", message: "Currently unable to access categories from database. We will have the issue fixed shortly."}, 
    null), document.getElementById("tactic-filter")
}


function isotopeFilter(event){
  // only work with buttons
  if ( !matchesSelector( event.target, "button" )) {
    return;
  }
  var filterValue = event.target.getAttribute("data-filter");
  buttonFilter = filterValue;
  iso.arrange();

  //highlight button that is clicked, un-highlight previously clicked button
  var buttons = document.querySelectorAll(".tactic-category-filter");
  for (var i=0; i < buttons.length; i++) {
    buttons[i].classList.remove("is-checked");
  }
  event.target.classList.add("is-checked");

  //Show next level of categories if button selected other than "All"
  if(event.target.id.match(/\d+/)[0] != 0){
    var level = parseInt(event.target.parentElement.id.match(/\d+/)[0]);
    var currentCategory = parseInt(event.target.id.match(/\d+/)[0]);
    var lastCategory = clickedCategories[clickedCategories.length - 1];
    var buttonGroup = document.getElementById("button-group"+(level+1));

    if(currentCategory.toString()[0] == lastCategory.toString()[0]){
      document.getElementById("tactic-category-filter"+lastCategory).classList.remove("was-checked");
      removeLast(clickedCategories, 1);
    }else if(currentCategory.toString()[0] < lastCategory.toString()[0]){
      var removeFrom = parseInt(currentCategory.toString()[0])+1;
      var removeTo = parseInt(lastCategory.toString()[0])+1;
      document.getElementById("tactic-category-filter"+clickedCategories[removeFrom-1]).classList.remove("was-checked");
      for(var i = removeFrom; i < removeTo+1; i++){
        if(i < removeTo){
          document.getElementById("tactic-category-filter"+clickedCategories[i]).classList.remove("was-checked");
        }
        if(document.getElementById("button-group"+i) != null){
          document.getElementById("button-group"+i).style.display = "none";
        }
      }
      event.target.classList.add("was-checked");

      var diff = parseInt(lastCategory.toString()[0]) - parseInt(currentCategory.toString()[0]);
      removeLast(clickedCategories, diff+1);
    }

    event.target.classList.add("was-checked");
    clickedCategories.push(currentCategory);

    if(buttonGroup != null){
      var childNodes = buttonGroup.childNodes;
      var parentCategory = event.target.getAttribute("data-filter");
      for(var i = 0; i < childNodes.length; i++){
        if(childNodes[i].classList.contains(parentCategory.substr(1))){
          childNodes[i].style.display = "inline-block";
        }else{
          childNodes[i].style.display = "none";
        }
      }
      buttonGroup.style.display = "block";
    }
  }else{
    for (var i = 2; i < clickedCategories.length+1; i++) {
      if(document.getElementById("button-group"+i) != null){
        document.getElementById("button-group"+i).style.display = "none";
      }
    }
    for (var i=0; i < buttons.length; i++) {
      buttons[i].classList.remove("was-checked");
    }
    removeLast(clickedCategories, clickedCategories.length-1);
  }
}

function tacticClick(event){
  var tactic = "";
  if(event.target.id.includes("tactic-text")){
    tactic = event.target.innerHTML;
  }else{
    tactic = event.target.firstElementChild.innerHTML;
  }
  document.getElementById("load-screen").style.display = "block";
  window.location.href="/tactics/"+encodeURIComponent(tactic);
}


function search(value){
  setTimeout(
    function(){
      qsRegex = new RegExp(value, 'gi');
      iso.arrange();
    }, 200);
}

/***************************EVENT LISTENERS**********************************/
document.addEventListener("DOMContentLoaded", function(e) {
  var tacticLink = document.getElementById("tactics-link");
	var dropdown = document.getElementById("tactic-dropdown-button");
  var dropdownDiv = document.getElementById("tactic-dropdown");
  var buttons = document.getElementsByClassName("tactic-button");
  var logo = document.getElementById("sub-logo-img");
  var filter = document.getElementById("tactic-filter-button");
  var filterDiv = document.getElementById("tactic-filter");

  //box tactics navbar button if current page is tactics
  if (window.location.href.indexOf("tactics") > -1){
    tacticLink.setAttribute("style", "border: 2px solid");
  }

  //toggle dropdown and filter visibility based on screen width 
	if(window.innerWidth < 950){
    dropdown.style.display = "block";
    filter.style.display = "none";
    filterDiv.style.display = "none";
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].style.display = "none";
    }
    logo.classList.add("centered-logo");
	}else{
    dropdown.style.display = "none";
    dropdownDiv.style.display = "none";
    filter.style.display = "inline-block";
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].style.display = "inline-block";
		}
    logo.classList.remove("centered-logo");
	}

  //load tactics blocks from database
	ajaxCall("/tacticsDB", loadTacticsBoxes, loadTacticsBoxesError);

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


//toggle visibility of dropdown buttons on dropdown icon click
document.getElementById("tactic-dropdown-button").addEventListener("click", function(){
  var dropdown = document.getElementById("tactic-dropdown");
  dropdown.classList.toggle("showDropdown");
});

//toggle visibility of filters on icon click
document.getElementById("tactic-filter-button").addEventListener("click", function(){
  var filter = document.getElementById("tactic-filter");
  if(filter.style.display == "none" || filter.style.display == "" || filter.style.display == "hidden"){
    filter.style.display = "block";
  }else{
    filter.style.display = "none";
  }
});
