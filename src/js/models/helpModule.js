// -- CODE FOR THE HELP MODULE -- \\

export function addHelp() {
    const helpBar = document.querySelector('.tab-container');
    helpBar.style.visibility = "visible";
}

export function centerHelp() {
    const helpBar = document.querySelector('.tab-container');
    helpBar.style.visibility = "visible";
    helpBar.style.left = "0px";
    helpBar.style.right = "0px";
    helpBar.style.top = "0px";
    helpBar.style.bottom = "0px";

}

// I am SORRY for using functon declarations here and nowhere else PLEASE forgive me for my inconsistency

function closeTabs() {
  const tabcontent = document.getElementsByClassName("tabcontent");
  for (var i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

      // Get all elements with class="tablinks" and remove the class "active"
  const tablinks = document.getElementsByClassName("tablinks");
  for (var i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
}

function changeTab(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

function changeTab2(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent-2");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks-2");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}
function removeHelp(event) {
    closeTabs();
    const helpBar = document.querySelector('.tab-container');
    helpBar.style.visibility = "hidden";
};


// Make the DIV element draggable:
document.addEventListener('DOMContentLoaded', (event) => {
    dragElement(document.getElementById("draggable"));
  })


function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


// ADDING EVENT LISTENERS

export function prepareHelpModule() {
    const tablinks = document.getElementsByClassName('tablinks');
    for (var i = 0; i < tablinks.length; i++) {
        const tab = tablinks[i];
        if (!tab.classList.contains("tablinks-2") && tab.id != "close") {
            const id = tab.id;
            tab.addEventListener('click', (event) => { changeTab(event, id.slice(0, -5))} )
        }
        else if (tab.classList.contains("tablinks-2")) {
            const id = tab.id;
            tab.addEventListener('click', (event) => { changeTab2(event, id.slice(0, -5))} )
        }
        else {
            tab.addEventListener('click', (event) => removeHelp())
        }
        
    }
}
