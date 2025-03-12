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
  var listID = doc.getElementByID('listID');
  var listName = doc.getElementByID('profile-list-name');
  var listDesc = doc.getElementByID('wlDesc');
  var itemsParent = doc.getElementById('awl-list-items');
  var listItems = itemsParent.querySelector('li');

  this.id = listID.value;
  this.name = listName.innerHTML;
  this.desc = listDesc.innerHTML;
  this.items = [];
  for (var i = 0; i < listItems.length; i++) {
    var itemData = new ListItem(listItems[i]);
    this.items.push(itemData);
    //console.log('[ITEM] ['+i+'] '+itemData);
  }
}

// Object: Single Item Data
function ListItem (listItem)
{
  this.listID = listItem.data-itemid;
  this.price = listItem.data-price;

  this.params = JSON.parse(listItem.data-reposition-action-params);
  this.id = this.params.itemExternalId.substring(5, 15);

  var itemName = listItem.getElementByID('itemName_'+this.listID);
  var itemInfo = listItem.getElementByID('item-byline-'+this.listID);
  var itemComment = listItem.getElementByID('itemComment_'+this.listID);

  this.name = itemName.innerHTML;
  this.info = itemInfo.innerHTML;
  this.comment = itemComment.innerHTML;
}


// Create New List Item Element
function newListElement (item)
{
  var li = document.createElement('li');
  var a = document.createElement('a');
  var text = createTextNode(item.name);
  a.href = urlAmazonItem(item.id, ARG_TAG);
  a.title = item.info;
  a.appendChild(text);
  li.appendChild(a);
  return li;
}

// Set New List Data
function setListData (list)
{
  setText(LIST_TITLE, list.name);
  setText(LIST_INFO, list.desc);
  var ul = getElement(LIST_ITEMS);
  ul.innerHTML = "";
  list.items.forEach(
    (item) => {
      var li = newListElement(item);
      ul.appendChild(li);
    });
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
  var listData = new ListData(doc);
  //console.log('[LIST] '+list);
  setListData(listData);
  //console.log('Done');
  return true;
}


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

