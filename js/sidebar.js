class SideBar {
    constructor() {
        this.sidebarOpen = false;
        this.events = [];
    }

    enqueue(text, eventType, metaData) {
        let event = {
            text,
            eventType,
            metaData
        }
        this.events.push(event);
        console.log("events", this.events)
        this.showList();
    }

    showList() {
        document.querySelectorAll(".listElem").forEach((elem) => elem.remove());

        let list = ""
        for (let index in this.events) {
            let color = 'white'
            let text = this.events[index].text;
            switch (this.events[index].eventType) {
                case USER_SUBMITTED:
                    let meta = this.events[index].metaData;
                    let buttonId = meta.curMem.userUUID + "ViewCode";
                    let name = text;
                    text = name + " submitted a" + "<a class=\"" + buttonId + "\" > solution! </a>" +
                        "<br/>" +
                        "<span style=\"padding-left: 20px;\"> Submission details: </span>" +
                        "<br/>" +
                        "<span style=\"padding-left: 40px;\"> Language: " + meta.lang + "</span>" +
                        "<br/>" +
                        "<span style=\"padding-left: 40px;\">Run Time: " + meta.runTime + "</span>" +
                        "<br/>" +
                        "<span style=\"padding-left: 40px;\"> Memory Usage: " + meta.memoryUsage + "</span>"

                        $("#list").on("click", "." + buttonId , function() {
                            console.log("got clicked")
                            modal.openModal(meta.code, name);
                        });
                    break;
                case "error":
                    color = 'red';
                    text = "Error: " + text;
                    break;
                default:
                    break;
            }
            list += "<hr class=\"solid listElem\">"
            list += "<div class=\"listElem\" style=\"color:" + color +"\">" + text + "</div>";
        }
        $("#list").append(list);
    }

    toggleSidebar() {
        if(this.sidebarOpen) {
            var el = document.getElementById('mySidebar');
            el.parentNode.removeChild(el);
            $("#app").css("width", "100%");
            this.sidebarOpen = false;
        }
        else {
            var sidebar = document.createElement('div');

            sidebar.id = "mySidebar";
            sidebar.innerHTML = "\
                <h2 style=\"color:white;text-align: center;\">LeetCode Party</h2>\
                <h5 style=\"color:white;margin: 10px;\">Here you can see information about how your competitors are doing</h5>\
                <div id=\"list\"></div>\
            ";
            sidebar.style.cssText = "\
                position:fixed;\
                top:0px;\
                right:0px;\
                width:30%;\
                height:100%;\
                background: #3a3939;\
                overflow-y: scroll;\
                padding: 10px;\
            ";
            $("body").append(sidebar);
            $("#app").css("width", "70%");
            this.showList();
            this.sidebarOpen = true;
            this.created = true;
        }
    }
};