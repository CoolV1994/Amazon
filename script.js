/** Amazon Affiliate **/


/**
 * Constants
 */

// Amazon Base URL
var URL_AMAZON = "https://www.amazon.com";

// Regex: Amazon Item URL
var REGEX_ID_ITEM = "([/dp/])([A-Z0-9]{10})";
// Regex: Amazon List URL
var REGEX_ID_LIST = "([/wishlist/][ls]?)([A-Z0-9]{13})";


/**
 * URL Query Parameters
 */

// Get Parameters
var QUERY_STRING = window.location.search;
var URL_PARAMS = new URLSearchParams(QUERY_STRING);

// Param: Item ID
var ARG_ITEM = URL_PARAMS.get("item");
console.log(`[Arg] Item: ${ARG_ITEM}`);

// Param: List ID
var ARG_LIST = URL_PARAMS.get("list");
console.log(`[Arg] List: ${ARG_LIST}`);

// Param: Tag ID
var ARG_TAG = URL_PARAMS.get("tag");
console.log(`[Arg] Tag: ${ARG_TAG}`);



// Get Amazon Item URL
function urlAmazonItem (itemID, tagID)
{
  return `${URL_AMAZON}/dp/${itemID}/?tag=${tagID}`;
}

// Get Amazon List URL
function urlAmazonList (listID)
{
  return `${URL_AMAZON}/wishlist/${listID}`;
}

// Get New Item URL
function urlSiteItem (itemID, tagID)
{
  var url = `${URL_SITE}/?item=${itemID}`;
  if (tagID) {
    url += `&tag=${tagID}`;
  }
  return url;
}



// Get HTML Element
function getElement (id) {
  var element = document.getElementById(id);
  return element;
}

// Toggle Section Visibilty
function toggleElement (id)
{
  return getElement(id).classList.toggle(CLASS_HIDDEN);
}

// Set Text / HTML
function setText (id, content="")
{
  return getElement(id).innerHTML = content;
}

// Set Input Value
function setValue (id, content="")
{
  return getElement(id).value = content;
}

// Set Hyperlink
function setLink (id, url)
{
  return setText(id, url).href = url;
}

// Set Browser URL (Redirect)
function setURL (url)
{
  window.location.href = url;
  window.location.replace(url);
}

// Copy Text to Clipboard
function copyText (id)
{
  var element = getElement(id);
  element.select();
  element.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(element.value);
  alert("Text Copied To Clipboard:\n" + element.value);
  return element;
}



// Regex Search
function regexSearch (regex, search)
{
  var match = search.match(regex);
  console.log(`[Regex] Pattern: ${regex}`);
  console.log(`[Regex] String: ${search}`);
  console.log(`[Regex] Found: ${match}`);
  if (match.length == 0) {
    return false;
  }
  return match;
}

// Get Item ID from URL
function idItemFromURL (url)
{
  return regexSearch(REGEX_ID_ITEM, url)[2];
}

// Get List ID From URL
function idListFromURL (url)
{
  return regexSearch(REGEX_ID_LIST, url)[2];
}




// Download and Parse Web Page
function downloadPage(url)
{
  var data = (await (await fetch(url)));
  var html = data.text();
  var parser = new DOMParser();
  var doc = parser.parseFromString(html, 'text/html');
  return doc;
}


// Object: Amazon List Data
function ListData (doc)
{
  // HTML Element
  var itemID = doc.querySelector('#listID');
  var itemTitle = doc.querySelector('.awl-list-title');
  var itemDesc = doc.querySelector('#wlDesc');
  var listParent = doc.getElementById('awl-list-items');
  var listItems = listParent.querySelector('li');

  setText(LIST_TITLE, `${itemTitle[0]} - ${itemTitle[1]}`);
  setText(LIST_INFO, `${itemDesc[0]}`);
  var ul = getElement(LIST_ITEMS);
  ul.innerHTML = "";
  for (var i = 0; i < listItems.length; i++) {
    var li = ListItem(listItems[i]);
    ul.appendChild(li);
  });

  // Object Value
/*
  this.id = itemID[0];
  this.name = itemTitle[0];
  this.info = itemDesc[0];
  this.owner = itemTitle[1];
  this.items = [];
  for (var i = 0; i < listItems.length; i++) {
    var item = new ListItem(listItems[i]);
    this.items.push(item);
    //console.log('[ITEM] ['+i+'] '+item);
  }
*/
}

// Object: Single Item Data
function ListItem (listItem)
{
  // HTML Element
  var itemSection = listItem.querySelector('.a-section');
  var itemTitle = listItem.querySelector('.awl-item-title');
  var itemWrapper = listItem.querySelector('.awl-item-wrapper');

  var listItem = document.createElement('li');
  var itemLink = document.createElement('a');
  var itemText = createTextNode(`[${itemWrapper[0]}] ${itemTitle[0]}`);
  itemLink.href = `#${itemSection[0]}`;
  itemLink.title = `${itemTitle[1]}`;
  itemLink.appendChild(itemText);
  listItem.appendChild(itemLink);
  return listItem;

  // Object Value
/*
  this.id = itemSection[0];
  this.name = itemTitle[0];
  this.info = itemTitle[1];
  this.price = itemWrapper[0];
*/
}


// Create New List Item Element
/*
function newListElement (item)
{
  var listItem = document.createElement('li');
  var itemLink = document.createElement('a');
  var itemText = createTextNode(item.name);
  itemLink.href = item.id;
  itemLink.appendChild(itemText);
  listItem.appendChild(itemLink);
  return listItem;
}
*/
/*
// Set New List Data
function setListData (list)
{
  setText(LIST_TITLE, list.name+' - '+list.owner);
  setText(LIST_INFO, list.info);
  var ul = getElement(LIST_ITEMS);
  ul.innerHTML = "";
  list.items.forEach(
    (item) => {
      var li = newListElement(item);
      ul.appendChild(li);
    });
}
*/



// Redirect To Item URL
function redirectItem ()
{
  if (!ARG_ITEM) {
    return false;
  }
  if (!ARG_TAG) {
    ARG_TAG = TAG_DEFAULT;
  }
//  var url = `${URL_AMAZON}/dp/${ARG_ITEM}/?tag=${ARG_TAG}`;
  var url = urlAmazonItem(ARG_ITEM, ARG_TAG);
  setLink(LINK_REDIRECT, url);
  setURL(url);
  return true;
}


// Display Amazon List
function displayList ()
{
  if (!ARG_LIST) {
    return false;
  }
  //console.log('[ID] '+ARG_LIST);
  var url = urlAmazonList(ARG_LIST);
  var doc = downloadPage(url);
  //console.log('[DOC] '+doc);
  ListData(doc);
  //console.log('[LIST] '+list);
  //setListData(list);
  //console.log('Done');
  return true;
}


// Generate New Item URL
function generateLink ()
{
  var urlItem = getElement(INPUT_URL);
  var url = urlItem.value;
  console.log(`[Link] URL: ${url}`);
  if (!url) {
    setText(TEXT_MESSAGE, "Error: Invalid URL");
    return;
  }
  var itemID = idItemFromURL(url);
  console.log(`[Link] Item: ${itemID}`);
  if (!itemID) {
    setText(TEXT_MESSAGE, "Error: Invalid ID");
    return;
  }
  setText(TEXT_MESSAGE, `Item ID: ${itemID}`);
//  var urlNew = `${URL_SITE}/?item=${itemID}`;
  var urlNew = urlSiteItem(itemID);
  console.log(`[Link] New: ${urlNew}`);
  setValue(INPUT_URL_NEW, urlNew);
}


// Register Event Listeners
function registerEvents ()
{
  getElement(BUTTON_LINK).addEventListener(
    "click", (e) => {
      generateLink();
    });
  getElement(BUTTON_CLEAR).addEventListener(
    "click", (e) => {
      setValue(INPUT_URL);
  });
  getElement(BUTTON_COPY).addEventListener(
    "click", (e) => {
      copyText(INPUT_URL_NEW);
  });
}


// Load Page Content
function loadPage ()
{
  if (redirectItem()) {
    toggleElement(SECTION_REDIRECT);
    return;
  }
  if (displayList()) {
    toggleElement(SECTION_LIST);
    return;
  }
  registerEvents();
  toggleElement(SECTION_LINK);
}


/**
 * Main Script
 */

console.log("[Main] Running...");
loadPage();
console.log("[Main] Done");

