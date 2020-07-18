class SideBar {
    constructor() {
        this.sidebarOpen = false;
        this.events = 
        [
            {
                text: "Message 1",
                eventType: "Message"
            },
            {
                text: "Message 2",
                eventType: "UserInfo"
            }
        ]
    }

    enqueue(text, eventType) {
        let event = {
            text,
            eventType
        }
        this.events.push(event);
        this.showList();
        console.log(this.events)
    }

    showList() {
        let listElems = $(".listElem")
        if (listElems) listElems.remove();

        let list = ""
        for (let index in this.events) {
            let color = 'white'
            let text = this.events[index].text;
            if (this.events[index].eventType == "error") {
                color = 'red';
                text = "Error: " + text;
            }

            list += "<li class=\"listElem\" style=\"color:" + color +"\">" + text + "</li>";
        }
        $("#list").append(list);
    }

    toggleSidebar() {
        if(this.sidebarOpen) {
            var el = document.getElementById('mySidebar');
            el.parentNode.removeChild(el);
            this.sidebarOpen = false;
        }
        else {
            var sidebar = document.createElement('div');

            sidebar.id = "mySidebar";
            sidebar.innerHTML = "\
                <h2 style=\"color:white\">LeetCode Party</h2>\
                <h5 style=\"color:white\">Here you can see information about how your competitors are doing</h5>\
                <ul id=\"list\"></ul>\
            ";
            sidebar.style.cssText = "\
                position:fixed;\
                top:0px;\
                right:0px;\
                width:30%;\
                height:100%;\
                background:#222222;\
                border-style: solid;\
            ";
            $("div[data-cy=\"code-area\"]").append(sidebar);
            this.showList();
            this.sidebarOpen = true;
        }
    }

};