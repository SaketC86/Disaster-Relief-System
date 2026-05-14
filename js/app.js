const toggle = document.getElementById("toggle");
const menu = document.getElementById("menu");

if(toggle){
  toggle.addEventListener("click", () => {
    menu.classList.toggle("show");
  });
}
function showPopup(msg) {
  document.getElementById("popupMsg").textContent = msg;
  document.getElementById("popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}