class SideBar {
    constructor() {
        this.sidebarOpen = false;
        this.messages = ["Message 1", "Message2"];
    }

    toggleSidebar() {
        if(this.sidebarOpen) {
            var el = document.getElementById('mySidebar');
            el.parentNode.removeChild(el);
            this.sidebarOpen = false;
        }
        else {
            var sidebar = document.createElement('div');
            let list = ""
            for (let index in this.messages) {
                console.log("hererere")
                list += "<li>" + this.messages[index] + "</li>";
            }
            console.log(list)
            sidebar.id = "mySidebar";
            sidebar.innerHTML = "\
                <h1>Hello</h1>\
                World!\
                <ul id=\"list\"></ul>\
            ";
            sidebar.style.cssText = "\
                position:fixed;\
                top:0px;\
                right:0px;\
                width:30%;\
                height:100%;\
                background:white;\
                box-shadow:inset 0 0 1em black;\
            ";
            $("div[data-cy=\"code-area\"]").append(sidebar);
            $("#list").append(list);
            this.sidebarOpen = true;
        }
    }

};