
function highlightIcon(sender) {
    var classNameIndex = sender.className.indexOf("menuButtonSelected");
    if (classNameIndex > -1) {
        sender.classList.remove("menuButtonSelected");
    } else {
        sender.classList.add("menuButtonSelected");
    }
}
