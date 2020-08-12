class Modal {
    constructor() {
    }

    openModal(code, user) {
        user = user + "'s code"
        var modal = document.createElement('div');

        modal.id = "modalContainer";
        modal.innerHTML = "\
        <div id=\"myModal\" class=\"modal\">\
            <div class=\"modal-content\">\
            <span class=\"close\">&times;</span>\ " +
            user +
            code +
            "</div>\
        ";
        modal.style.cssText = "";
        $("body").append(modal);

        // Get the modal
        var modal = document.getElementById("myModal");


        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];


        modal.style.display = "block";

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.remove();
        };

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.remove();
            }
        }
    }

};