function PageButtonHandlers() {
    setTimeout(() => {
        let submitButton = $("button[data-cy=\"submit-code-btn\"]");
        console.log("THIS THING NEEDS TO BE CLICKED", submitButton)
        submitButton.click(function() {
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
                
                console.log(status)
                if (status === "Success") {
                    var elems = document.querySelectorAll("span[class*=\"data\"");
                    var values = Array.prototype.map.call(elems, function(obj) {
                        return obj.innerText;
                    });

                    var submitMetaData = {
                        "runTime": values[0],
                        "fasterThanTime": values[1],
                        "memoryUsage": values[2],
                        "lessThanMemory": values[3],
                        lang
                    }

                    console.log(submitMetaData)
                    let payload = {
                        roomId: curRoom.roomId,
                        userId: curRoom.userId,
                        newState: true
                    }
                    socket.emit("userSubmitted", payload, (data) => {
                        displayUserFinished(data.userId, submitMetaData);
                    });
                    let code = $("div[class=\"CodeMirror-code\"]");
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