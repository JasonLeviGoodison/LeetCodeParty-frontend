class Modal {
    constructor(socket) {
        this.socket = socket;
    }

    openModal(code, user, roomUUID, viewerUserUUID, viewedUserUUID) {
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

        // Emit this message to the server so we can track this read receipt
        if (viewerUserUUID != viewedUserUUID) {
            this.socket.emit(USER_VIEWED_CODE_MESSAGE, {
                viewer: viewerUserUUID,
                viewed: viewedUserUUID,
                roomUUID: roomUUID
            }, function(data) {});
        }
    }

    openHowToModal() {
        var modal = document.createElement('div');

        modal.id = "howToModalContainer";
        modal.innerHTML = "\
        <div id=\"myHowToModal\" class=\"modal\">\
            <div class=\"modal-content\">\
            <span class=\"close\">&times;</span>\ " +
            "<h2> How to </h2>" +
            "1. Click 'Start Room'" + "<br/>" +
            "2. Copy the provided link and share it with friends" + "<br/>" +
            "3. Ask them to follow the link and then click the LeetParty Chrome Extension in the top right" + "<br/>" +
            "4. Once everyone Readys Up, the host can start the game" + "<br/>" +
            "5. Click the regular Leetcode Submit button when you are finished!" + "<br/>" +
            "</div>\
        ";
        modal.style.cssText = "";
        $("body").append(modal);

        // Get the modal
        var modal = document.getElementById("myHowToModal");


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