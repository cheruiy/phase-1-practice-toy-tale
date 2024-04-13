let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        renderToy(toy);
      });
    });
});

function renderToy(toy) {
  const toyCollection = document.getElementById("toy-collection");

  const card = document.createElement("div");
  card.classList.add("card");

  const h2 = document.createElement("h2");
  h2.textContent = toy.name;

  const img = document.createElement("img");
  img.src = toy.image;
  img.classList.add("toy-avatar");

  const p = document.createElement("p");
  p.textContent = `${toy.likes} Likes`;

  const button = document.createElement("button");
  button.classList.add("like-btn");
  button.id = toy.id;
  button.textContent = "Like ❤️";
  button.addEventListener("click", () => {
    increaseLikes(toy);
  });

  card.appendChild(h2);
  card.appendChild(img);
  card.appendChild(p);
  card.appendChild(button);

  toyCollection.appendChild(card);
}

// Assuming you have a form element with id "toy-form"
const toyForm = document.getElementById("toy-form");
toyForm.addEventListener("submit", event => {
  event.preventDefault();

  const formData = new FormData(toyForm);
  const name = formData.get("name");
  const image = formData.get("image");

  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      name,
      image,
      likes: 0
    })
  })
    .then(response => response.json())
    .then(toy => {
      renderToy(toy);
    })
    .catch(error => console.error("Error adding new toy:", error));
});

function increaseLikes(toy) {
  const newLikes = toy.likes + 1;
  
  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      likes: newLikes
    })
  })
    .then(response => response.json())
    .then(updatedToy => {
      const toyCard = document.getElementById(updatedToy.id);
      const likeParagraph = toyCard.querySelector("p");
      likeParagraph.textContent = `${updatedToy.likes} Likes`;
    })
    .catch(error => console.error("Error increasing likes:", error));
}
