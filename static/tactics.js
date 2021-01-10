/***************************GLOBAL VARIABLES*********************************/
var TACTICS = [];
var CATEGORIES = [];
var iso = "";
var clickedCategories = [0];
var qsRegex;
var quickSearch;
var buttonFilter = "";
var tacticOrdering = [];
var numberOfDisplayedTactics = 20;
/*const mutedPalette = [[229,228,226],  //grey
                      [255,253,208], [244,244,224], [255,249,222], [240,217,208], [255,248,230], //tan
                      [244,194,194], [245,213,251], [225,180,180], [249,193,175], [249,232,239], //red-pink
                      [198,239,245], [199,238,230], [212,239,254], [203,230,255], //blue
                      [209,242,192], [211,229,215], [238,255,229], //green
                      [237,234,255], [203,212,255] //purple
                      ];*/
const palette = [[3,49,101], [181,214,253], [245,199,26]];

/***************************REACT FUNCTIONS**********************************/
class TacticBlock extends React.Component {

  render() {
    var categoryString = "";
    const tactic = this.props.tactic;
    //const displayed = this.props.displayed;
    const number = this.props.number;
    tactic.categories.split("; ").forEach((category) => {
      categoryString = categoryString + " " + category.replace(/\/|\s|\,|\'|\;|\-/g, '');
    });
    if(tactic.picture == null || tactic.picture == "NULL"){
      var rgb = palette[Math.floor(Math.random() * palette.length)];
      return React.createElement("div", {id: "tactic-parent"+tactic.tactic_id, className: number + " tactic-block" + categoryString, onClick: tacticClick,
        style: {backgroundColor: 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')', zIndex: "99999"}}, 
        React.createElement("div", {id: "tactic-text"+tactic.tactic_id, className: "tactic-text"}, tactic.name));
    }else{
      return React.createElement("div", {id: "tactic-parent"+tactic.tactic_id, className: number + " tactic-block" + categoryString, onClick: tacticClick,
        style: {backgroundImage: `url("/static/tactic_pictures/`+tactic.picture+`_tn.jpg")`, zIndex: "99999"}}, 
        React.createElement("div", {id: "tactic-text"+tactic.tactic_id, className: "tactic-text"}, tactic.name));
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

}


class TacticsTable extends React.Component {

  render() {
    const tacticBoxes = [];
    //const displayed = this.props.displayed;
    //var tacticsToDisplay;
    this.props.tactics.forEach((tactic, i) => {
      tacticBoxes.push(React.createElement(TacticBlock, {tactic: tactic, key: tactic.tactic_id, number: i}, null))
    });
    //tacticsToDisplay = tacticBoxes.splice(displayed - numberOfDisplayedTactics, displayed);
    //return React.createElement("div", {id: "tactics-container"}, tacticsToDisplay);
    return React.createElement("div", {id: "tactics-container"}, tacticBoxes);
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
      if(window.innerWidth <= 450){
        document.getElementById("tactic-dropdown").style.display = "none";
      }else{
        document.getElementById("tactic-dropdown").style.display = "block";
      }
    }
  }

}


class TacticsContainer extends React.Component {
  
  /*constructor(props) {
    super(props);
    this.state = {
      displayed: numberOfDisplayedTactics,
    };
  }

  handleUpArrowClick() {
    const displayed = this.state.displayed;
    this.setState({displayed: displayed - numberOfDisplayedTactics});
  }

  handleDownArrowClick() {
    console.log("hey");
    const displayed = this.state.displayed;
    this.setState({displayed: displayed + numberOfDisplayedTactics});
  }*/

  render() {
    const tacticContainer = [];
    tacticContainer.push(React.createElement(TacticsTable, {key: 1, tactics: this.props.tactics}, null));
    //tacticContainer.push(React.createElement(TacticsTable, {key: 1, tactics: this.props.tactics, displayed: this.state.displayed}, null));
    /*return React.createElement("div", {id: "tactics-all"}, tacticContainer,
      React.createElement("div", {id: "more-tactics-below"}, 
      React.createElement("span", {id: "more-tactics-below-button", className: "tactic-scroll material-icons md-48", onClick: this.handleDownArrowClick.bind(this)}, "keyboard_arrow_down")));*/
    return React.createElement("div", {id: "tactics-all"}, tacticContainer);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
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

    /*
    if(id == 1){
      categorySelectors.push(React.createElement(CategorySearch, {key: "search"}, null));
    }
    */

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

  /*
  componentDidMount() {
    quickSearch = document.querySelector('.quickSearch');
  }
  */

}


class TacticSearch extends React.Component {

  render(){ 
    var searchBar = React.createElement(CategorySearch, {key: "search"}, null)

    return React.createElement("div", {id: "search-container"}, searchBar);
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
  var search = document.getElementById("tactic-search-button");
  var filterContainerDiv = document.getElementById("tactic-filter-container");

	if(window.innerWidth < 950){
    if(window.innerWidth <= 950){
      dropdown.style.display = "none";
      dropdownDiv.classList.remove("showDropdown");
      dropdownDiv.style.display = "none";
    }else{
      dropdown.style.display = "block";
      dropdownDiv.style.display = "block";
    }
    filter.style.display = "none";
    search.style.display = "none";
    filterContainerDiv.style.display = "none";
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].style.display = "none";
		}
	  logo.classList.add("centered-logo");
	}else{
    dropdown.style.display = "none";
    dropdownDiv.classList.remove("showDropdown");
    dropdownDiv.style.display = "none";
    filterContainerDiv.style.display = "block";
    filter.style.display = "inline-block";
    search.style.display = "inline-block";
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
  //MySQL json containing all tactic information
  TACTICS = JSON.parse(data);
  console.log(TACTICS);

  //get order of tactics for next and prev button
  TACTICS.forEach(function(tactic){
      tacticOrdering.push(tactic.name);
  });

	ReactDOM.render(
    	React.createElement(TacticsContainer, {tactics: TACTICS}, null), document.getElementById("container")
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

  ReactDOM.render(
      React.createElement(TacticSearch, 
        null), document.getElementById("tactic-search")
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
  /*document.getElementById("load-screen").style.display = "block";*/
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
/*if (performance.navigation.type == performance.navigation.TYPE_RELOAD || performance.navigation.type == performance.navigation.TYPE_BACK_FORWARD) {
  window.addEventListener('beforeunload', function () {
    document.getElementById("load-screen").style.display = "none";
  });
}*/

document.addEventListener("DOMContentLoaded", function(e) {
  var tacticLink = document.getElementById("tactics-link");
	var dropdown = document.getElementById("tactic-dropdown-button");
  var dropdownDiv = document.getElementById("tactic-dropdown");
  var buttons = document.getElementsByClassName("tactic-button");
  var logo = document.getElementById("sub-logo-img");
  var filter = document.getElementById("tactic-filter-button");
  var search = document.getElementById("tactic-search-button");
  var filterContainerDiv = document.getElementById("tactic-filter-container");

  //box tactics navbar button if current page is tactics
  if (window.location.href.indexOf("tactics") > -1){
    tacticLink.setAttribute("style", "border: 2px solid");
  }

  //toggle dropdown and filter visibility based on screen width 
	if(window.innerWidth < 950){
    if(window.innerWidth <= 950){
      dropdown.style.display = "none";
    }else{
      dropdown.style.display = "block";
    }
    filter.style.display = "none";
    search.style.display = "none";
    filterContainerDiv.style.display = "none";
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].style.display = "none";
    }
    logo.classList.add("centered-logo");
	}else{
    dropdown.style.display = "none";
    dropdownDiv.style.display = "none";
    filter.style.display = "inline-block";
    search.style.display = "inline-block";
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


//toggle visibility of dropdown buttons on dropdown icon click
document.getElementById("tactic-dropdown-button").addEventListener("click", function(){
  var dropdown = document.getElementById("tactic-dropdown");
  dropdown.classList.toggle("showDropdown");
});

//toggle visibility of filters on icon click
document.getElementById("tactic-filter-button").addEventListener("click", function(){
  var filterContainer = document.getElementById("tactic-filter-container");
  var filter = document.getElementById("tactic-filter");
  var search = document.getElementById("tactic-search");
  if(filterContainer.style.display == "none" || filterContainer.style.display == "" || filterContainer.style.display == "hidden"){
    filterContainer.style.display = "block";
    filter.style.display = "block";
  }else{
    if(filter.style.display == "none" || filter.style.display == "" || filter.style.display == "hidden"){
      filter.style.display = "block";
    }else{
      filter.style.display = "none";
      if(search.style.display == "none" || search.style.display == "" || search.style.display == "hidden"){
        filterContainer.style.display = "none";
      }
    }
  }
});

document.getElementById("tactic-search-button").addEventListener("click", function(){
  var filterContainer = document.getElementById("tactic-filter-container");
  var filter = document.getElementById("tactic-filter");
  var search = document.getElementById("tactic-search");
  if(filterContainer.style.display == "none" || filterContainer.style.display == "" || filterContainer.style.display == "hidden"){
    filterContainer.style.display = "block";
    search.style.display = "block";
  }else{
    if(search.style.display == "none" || search.style.display == "" || search.style.display == "hidden"){
      search.style.display = "block";
    }else{
      search.style.display = "none";
      if(filter.style.display == "none" || filter.style.display == "" || filter.style.display == "hidden"){
        filterContainer.style.display = "none";
      }
    }
  }
});
