const form = document.getElementById("bookForm");
const tableBody = document.getElementById("bookTable");
const countLabel = document.getElementById("bookCount");
const message = document.getElementById("message");
const refreshButton = document.getElementById("refreshButton");

function showMessage(text, type) {
  message.textContent = text;
  message.className = type || "";
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  if (!response.ok) {
    let errorText = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      if (data.message) errorText = data.message;
      else if (data.detail) errorText = data.detail;
    } catch (_) {
      // Keep the generic error message when response is not JSON.
    }
    throw new Error(errorText);
  }

  if (response.status === 204) return null;
  return response.json();
}

function makeCell(text) {
  const cell = document.createElement("td");
  cell.textContent = text;
  return cell;
}

function renderBooks(books) {
  tableBody.replaceChildren();
  countLabel.textContent = `${books.length} ${books.length === 1 ? "book" : "books"} in your collection`;

  if (books.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.className = "empty";
    cell.textContent = "No books yet. Add your first book above.";
    row.appendChild(cell);
    tableBody.appendChild(row);
    return;
  }

  for (const book of books) {
    const row = document.createElement("tr");
    row.appendChild(makeCell(book.title));
    row.appendChild(makeCell(book.author));
    row.appendChild(makeCell(book.isbn));

    const statusCell = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = `status ${book.availability ? "available" : "unavailable"}`;
    badge.textContent = book.availability ? "Available" : "Not available";
    statusCell.appendChild(badge);
    row.appendChild(statusCell);

    const actionCell = document.createElement("td");
    const removeButton = document.createElement("button");
    removeButton.className = "danger";
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", async () => {
      if (!confirm(`Remove "${book.title}" from the library?`)) return;
      try {
        await request(`/api/books/${encodeURIComponent(book.isbn)}`, { method: "DELETE" });
        showMessage("Book removed successfully.", "success");
        await loadBooks();
      } catch (error) {
        showMessage(error.message, "error");
      }
    });
    actionCell.appendChild(removeButton);
    row.appendChild(actionCell);
    tableBody.appendChild(row);
  }
}

async function loadBooks() {
  try {
    const books = await request("/api/books");
    renderBooks(books);
  } catch (error) {
    tableBody.replaceChildren();
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.className = "empty";
    cell.textContent = "Could not load books. Please refresh the page.";
    row.appendChild(cell);
    tableBody.appendChild(row);
    countLabel.textContent = "Unable to load collection";
    showMessage(error.message, "error");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const book = {
    title: document.getElementById("title").value.trim(),
    author: document.getElementById("author").value.trim(),
    isbn: document.getElementById("isbn").value.trim(),
    availability: document.getElementById("availability").value === "true"
  };

  try {
    await request("/api/books", {
      method: "POST",
      body: JSON.stringify(book)
    });
    form.reset();
    showMessage("Book added successfully.", "success");
    await loadBooks();
  } catch (error) {
    showMessage(error.message, "error");
  }
});

refreshButton.addEventListener("click", loadBooks);
loadBooks();
