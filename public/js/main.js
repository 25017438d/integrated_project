// Highlight active nav link
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('nav a');
  const currentPath = window.location.pathname;
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (currentPath === href || currentPath.startsWith(href + '/')) {
      link.classList.add('active');
    }
  });
});

// DOM Elements
const noticeForm = document.getElementById("noticeForm");
const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalClose = document.querySelector(".modal-close");

console.log("Script loaded, looking for delete buttons");

// Image Modal - Click to enlarge
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("notice-image")) {
    e.preventDefault();
    console.log("Image clicked! Src:", e.target.src);
    modalImage.src = e.target.src;
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }
  
  // Delete button click
  if (e.target.classList.contains("delete-btn")) {
    console.log("Delete button clicked!");
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this notice?")) {
      const noticeId = e.target.dataset.id;
      console.log("Deleting notice:", noticeId);
      deleteNotice(noticeId);
    }
  }
});

// Function to close modal
function closeModal() {
  console.log("Closing modal");
  modal.classList.remove("show");
  document.body.style.overflow = "auto";
}

// Function to delete notice
async function deleteNotice(noticeId) {
  try {
    console.log("Sending DELETE request for notice:", noticeId);
    const response = await fetch(`/notices/${noticeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });
    console.log("Response status:", response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log("Success:", data);
      alert("Notice deleted successfully!");
      location.reload();
    } else {
      const error = await response.json();
      console.log("Error:", error);
      alert("Error: " + (error.error || "Could not delete notice"));
    }
  } catch (error) {
    console.error("Error deleting notice:", error);
    alert("Error deleting notice: " + error.message);
  }
}

// Close modal when clicking X
if (modalClose) {
  modalClose.addEventListener("click", (e) => {
    e.stopPropagation();
    closeModal();
  });
}

// Close modal when clicking on dark background (outside image)
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    console.log("Clicked outside modal");
    closeModal();
  }
});

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});
