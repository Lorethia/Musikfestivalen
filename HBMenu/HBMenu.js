function HBmenu() {
  const menu = document.getElementById("myLinks");
  if (menu.style.display === "block") {
    menu.style.display = "none";
  } else {
    menu.style.display = "block";
  }
}

/* Media query */
const mediaQuery = window.matchMedia("(min-width: 1000px)");

function handleMediaQueryChange(event) {
  const sidemenu = document.getElementById("mySidemenu");
  const topnav = document.querySelector(".topnav");
  const menuLinks = document.getElementById("myLinks");
  const icon = document.querySelector(".topnav a.icon");

  if (event.matches) {
    if (sidemenu) sidemenu.style.display = "block";
    if (topnav) topnav.style.display = "none";
    if (icon) topnav.style.display = "none";
    if (menuLinks) menuLinks.style.display = "none";
  } else {
    if (sidemenu) sidemenu.style.display = "none";
    if (topnav) topnav.style.display = "flex";
  }
}

mediaQuery.addEventListener("change", handleMediaQueryChange);

handleMediaQueryChange(mediaQuery);
