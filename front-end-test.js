function test() {

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(xhttp.responseText);
        }
    }

    xhttp.open("GET", "localhost/rest.js/", true);
    xhttp.send();
}