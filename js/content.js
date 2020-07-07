//
const ENDPOINT = "http://127.0.0.1:4001";



function injectJsScript(script) {
    var script = document.createElement('script');
    script.src = script;
    (document.head || document.documentElement).appendChild(script);
    script.onload = function () {
        script.parentNode.removeChild(script);
    };
}

window.addEventListener ("load", myMain, false);

function myMain (evt) {
    let submitButton = $("[data-cy=\"run-code-btn\"]");
    submitButton.click(function() {
        console.log("Run Clicked")
        let lang = $(".ant-select-selection-selected-value").attr("title");
        console.log("Using lang", lang);
    });

}

function destroyPreview() {
    // max-width: inherit;
    // width: 100%;
}


