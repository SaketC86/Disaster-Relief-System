const sosForm = document.getElementById("sosForm");
const resourceForm = document.getElementById("resourceForm");

if(sosForm){

  sosForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const data = {
      name: document.getElementById("name").value,
      emergency: document.getElementById("emergency").value,
      location: document.getElementById("location").value,
      contact: document.getElementById("contact").value,
      type: "SOS"
    };

    let items = JSON.parse(localStorage.getItem("posts")) || [];

    items.push(data);

    localStorage.setItem("posts", JSON.stringify(items));

    showPopup("Emergency request submitted successfully!");
    sosForm.reset();

  });

}

if(resourceForm){

  resourceForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const data = {
      helper: document.getElementById("helper").value,
      resource: document.getElementById("resource").value,
      quantity: document.getElementById("quantity").value,
      type: "RESOURCE"
    };

    let items = JSON.parse(localStorage.getItem("posts")) || [];

    items.push(data);

    localStorage.setItem("posts", JSON.stringify(items));

   showPopup("Resource added successfully!");
    resourceForm.reset();

  });

}