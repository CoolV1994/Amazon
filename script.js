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

// Set Text / HTML
function setText (id, content="")
{
  var element = getElement(id);
  element.innerHTML = content;
  return element;
}

// Set Input Value
function setValue (id, content="")
{
  var element = getElement(id);
  element.value = content;
  return element;
}

// Set Hyperlink
function setLink (id, url)
{
  var element = getElement(id);
  element.innerHTML = url;
  element.href = url;
  return element;
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

// Toggle Section Visibilty
function toggleElement (id)
{
  var element = getElement(id);
  element.classList.toggle(CLASS_HIDDEN);
  return element;
}


/**
 * Functions
 */

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



// Function: Generate New Item URL
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


// Function: Register Event Listeners
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


function loadPage ()
{
  if (redirectIten()) {
    toggleElement(SECTION_REDIRECT);
    return;
  }
  registerEvents();
  toggleElement(SECTION_LINK);
}



/**
 * Main Script
 */

loadPage();

