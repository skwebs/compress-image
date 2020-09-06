// register the service worker if available
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(function(reg) {
        console.log('Successfully registered service worker', reg);
    }).catch(function(err) {
        console.warn('Error whilst registering service worker', err);
    });
}

var x = document.getElementsByTagName("BODY")[0];
window.addEventListener('online', function(e) {
    // re-sync data with server
    console.log("You are online");
    x.style.filter = "grayscale(0%)";
}, false);

window.addEventListener('offline', function(e) {
    // queue up events for server
   x.style.filter = "grayscale(100%)";
    console.log("You are offline");
    
 }, false);

// check if the user is connected
if (navigator.onLine) {
x.style.filter = "grayscale(0%)";
   } else {
    // show offline message
 x.style.filter = "grayscale(100%)";
 }