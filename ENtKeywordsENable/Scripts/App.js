'use strict';

var context = SP.ClientContext.get_current();
var user = context.get_web().get_currentUser();

var web = context.get_web(); //gets the web object
var list = web.get_lists(); //gets the collection of lists
var sitefield;

// This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
$(document).ready(function () {
    getUserName();
    createList();

});


function createList() {
    var listCreation = new SP.ListCreationInformation();
    listCreation.set_title("MyCustomList"); //list title
    listCreation.set_templateType(SP.ListTemplateType.genericList); //list type
    list.add(listCreation)
    context.load(list);
    context.executeQueryAsync(onListCreationSuccess, onFieldCreationFail);
    addFieldInList(); //after creating the list create the field.
}

function addFieldInList() {
    var rootWeb = context.get_site().get_rootWeb();
    sitefield = rootWeb.get_availableFields().getByInternalNameOrTitle("TaxKeyword");
    context.load(sitefield);
    context.executeQueryAsync(onFieldGetSuccess, onFieldGetFail);
    
    
}

function onListCreationSuccess() {
    alert("List Creation Successful");
//    var targetList = list.getByTitle("MyCustomList");
//    var field = targetList.get_fields().addFieldAsXml(
//'<FieldRef ID=\'{23f27201-bee3-471e-b2e7-b64fd8b7ca38}\' Name=\'TaxKeyword\' />');

//    context.load(field);
//    context.executeQueryAsync(onFieldCreationSuccess, onFieldCreationFail);
}

function onFieldGetSuccess() {
    alert("Field get Success");

    var targetList = list.getByTitle("MyCustomList");
    var field = targetList.get_fields().add(sitefield);

    context.load(field);
    context.executeQueryAsync(onFieldCreationSuccess, onFieldCreationFail);

}
// This function is executed if the above call fails
function onFieldGetFail(sender, args) {
    alert('Failed to get a field. Error:' + args.get_message());
}

function onFieldCreationSuccess() {
    alert("Success");
    
}
// This function is executed if the above call fails
function onFieldCreationFail(sender, args) {
    alert('Failed to create a field. Error:' + args.get_message());
} 

// This function prepares, loads, and then executes a SharePoint query to get the current users information
function getUserName() {
    context.load(user);
    context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
}

// This function is executed if the above call is successful
// It replaces the contents of the 'message' element with the user name
function onGetUserNameSuccess() {
    $('#message').text('Hello ' + user.get_title());
}

// This function is executed if the above call fails
function onGetUserNameFail(sender, args) {
    alert('Failed to get user name. Error:' + args.get_message());
}
