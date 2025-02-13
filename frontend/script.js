document
  .getElementById("userForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Empêche le rechargement de la page

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries()); // Convertit FormData en objet JSON

    fetch("http://localhost:50000/api/setdata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message); // Affiche un message de confirmation
        event.target.reset(); // Réinitialise le formulaire
        getUsers(); // Met à jour la liste après insertion
      })
      .catch((error) => console.error("Erreur:", error));
  });

function getUsers() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:50000/api/getdata", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      const users = JSON.parse(xhr.responseText);
      const tbody = document.querySelector("#userTable tbody");
      tbody.innerHTML = ""; // Vide le tableau

      users.forEach((user) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.nom}</td>
                    <td>${user.prenom}</td>
                `;
        tbody.appendChild(row);
      });
    } else {
      console.error("Erreur lors de la récupération des utilisateurs");
    }
  };
  xhr.send();
}
