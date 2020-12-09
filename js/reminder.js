class Reminder {
    open() {
        var reminder = document.createElement('div');

        reminder.id = "reminder";
        reminder.innerHTML = "\
            <span class=\"closebtn\" onclick=\"this.parentElement.style.display='none';\">&times;</span>\
            Compete with friends? Get a Leetparty going!";
        reminder.style.cssText = "";
        $(reminder).insertAfter($("div[class*=\"navbar-left-container\"]"));
    }
};