const feedContainer = document.getElementById("feedContainer");

const items = JSON.parse(localStorage.getItem("posts")) || [];

items.forEach((item, index) => {

  const card = document.createElement("div");

  card.classList.add("feed-card");

  card.innerHTML = `
    <h3>${item.type}</h3>

    <p>${item.name || item.helper}</p>

    <p>${item.emergency || item.resource}</p>

    <button onclick="deletePost(${index})">
      Resolve
    </button>
  `;

  feedContainer.appendChild(card);

});

function deletePost(index){

  items.splice(index,1);

  localStorage.setItem("posts", JSON.stringify(items));

  location.reload();

}