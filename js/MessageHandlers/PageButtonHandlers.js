function PageButtonHandlers() {
    setTimeout(() => {
        let submitButton = $("button[data-cy=\"submit-code-btn\"]");
        console.log("THIS THING NEEDS TO BE CLICKED", submitButton)
        submitButton.click(function() {

            // If the user isn't in a room, don't attempt to get the answer
            if (curRoomV2.notInRoom()) {
                return;
            }

            console.log("THIS THING WAS CLICKED")
            let lang = $(".ant-select-selection-selected-value").attr("title");
            
            var waitForResult = setInterval(function() {
                let status = "";
                try {
                    if (document.querySelector("div[class*=\"success\"")) {
                        status = document.querySelector("div[class*=\"success\"").innerText;
                    }
                    else if (document.querySelector("div[class*=\"error\"")) {
                        status = document.querySelector("div[class*=\"error\"").innerText;
                    }
                }
                catch {}
                
                if (status === "Success") {
                    var elems = document.querySelectorAll("span[class*=\"data\"");
                    var values = Array.prototype.map.call(elems, function(obj) {
                        return obj.innerText;
                    });

                    let code = $("div[class*=\"react-codemirror2\"]").html();

                    var submitMetaData = {
                        startTime: curRoomV2.getRoomStartedTimestamp(),
                        finishTime: new Date(),
                        runTime: values[0],
                        fasterThanTime: values[1],
                        memoryUsage: values[2],
                        lessThanMemory: values[3],
                        lang,
                        newState: true,
                        code,
                    }

                    console.log(submitMetaData)
                    let payload = {
                        roomId: curRoomV2.getRoomID(),
                        userId: curRoomV2.getUserID(),
                        meta: submitMetaData
                    }
                    socket.emit(USER_SUBMITTED, payload, (data) => {});

                    // Update the room marking that you are done
                    curRoomV2.userSubmittedAnswer(submitMetaData);
                    SendMessageToPopup(USER_SUBMITTED, curRoomV2, function(response) {});

                    clearInterval(waitForResult);
                }
                else if (status === "Wrong Answer" || status === "Runtime Error") {
                    sideBar.enqueue("hmmm... Your submission had problems. You haven't completed the problem", "info")
                    clearInterval(waitForResult);
                }
            }, 1000);
        });
    }, 5000);
}