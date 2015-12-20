console.log(getCurentFileName());

$.Ping("74.91.123.186:27015").done(function (success, url, time, on) {
    $("#status").css("color", "#27ae60");
    $("#status").text("Online");
}).fail(function (failure, url, time, on) {
    $("#connectButton").css("background-color", "#bdc3c7");
    $("#status").css("color", "#c0392b");
    $("#status").text("Offline");
});


/* FUNCTIONS
-----------------*/

function getCurentFileName(){
    var pagePathName= window.location.pathname;
    return pagePathName.substring(pagePathName.lastIndexOf("/") + 1);
}