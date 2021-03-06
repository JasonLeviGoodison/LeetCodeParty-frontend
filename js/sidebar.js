class SideBar {
    constructor() {
        this.sidebarOpen = false;
        this.host_uuid = null;
        this.resetSidebarEvents();
    }

    clearSidebar() {
        this.resetSidebarEvents();
        this.showList();
    }

    resetSidebarEvents() {
        this.events = [];
    }

    setHost(host) {
        this.host_uuid = host;
    }

    enqueue(text, eventType, metaData) {
        let event = {
            text,
            eventType,
            metaData
        }
        this.events.push(event);
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
                    let buttonId = meta.curMem.userUUID + (Math.ceil(Math.random()*1000));
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

                        let self = this;
                        $("#list").on("click", "." + buttonId , function() {
                            modal.openModal(
                                meta.code,
                                name,
                                curRoomV2.getRoomID(),
                                self.host_uuid,
                                meta.curMem.userUUID,
                            );
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
                <div style=\"position:fixed; text-align:center; width: 30%; bottom: 0px;\"><a id=\"howto\">How to play</a></div>\
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
            $('#howto').click(function() {
                modal.openHowToModal();
            });

            this.showList();
            this.sidebarOpen = true;
            this.created = true;
        }
    }
};