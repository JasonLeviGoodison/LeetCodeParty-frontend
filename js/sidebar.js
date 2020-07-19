class SideBar {
    constructor() {
        this.sidebarOpen = false;
        this.events = [];
    }

    enqueue(text, eventType) {
        let event = {
            text,
            eventType
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
                case "error":
                    color = 'red';
                    text = "Error: " + text;
                default:
                    break;
            }

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
                background:#222222;\
                border-style: solid;\
                overflow-y: scroll;\
            ";
            $("body").append(sidebar);
            $("#app").css("width", "70%");
            this.showList();
            this.sidebarOpen = true;
        }
    }

};