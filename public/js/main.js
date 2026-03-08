document.addEventListener("DOMContentLoaded", () => {
  // Highlight active nav link
  const navLinks = document.querySelectorAll("nav .nav-links a");
  const currentPath = window.location.pathname;

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (currentPath === href) {
      link.classList.add("active");
    }
  });

  // Search functionality
  const searchInput = document.getElementById("searchInput");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      const notices = document.querySelectorAll(".notice");

      notices.forEach((notice) => {
        const text = notice.textContent.toLowerCase();

        if (text.includes(query)) {
          notice.style.display = "";
        } else {
          notice.style.display = "none";
        }
      });
    });
  }

  // Auto-dismiss flash messages
  const flashAlerts = document.querySelectorAll(".flash-alert");

  flashAlerts.forEach((alertNode) => {
    const bsAlert = bootstrap.Alert.getOrCreateInstance(alertNode);

    const timeout = setTimeout(() => {
      bsAlert.close();
    }, 3000);

    alertNode.addEventListener("closed.bs.alert", () => {
      clearTimeout(timeout);
    });
  });
});

// DOM Elements
const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalClose = document.querySelector(".modal-close");

// Global click handler
document.addEventListener("click", (e) => {
  // Image modal open
  if (e.target.classList.contains("notice-image")) {
    if (!modal || !modalImage) return;

    e.preventDefault();
    modalImage.src = e.target.src;
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  // Delete notice
  const deleteBtn = e.target.closest(".notice-delete-btn");

  if (deleteBtn) {
    e.preventDefault();

    const noticeId = deleteBtn.dataset.id;

    if (!confirm("Are you sure you want to delete this notice?")) return;

    deleteNotice(noticeId);
  }
});

// Close modal function
function closeModal() {
  if (!modal) return;

  modal.classList.remove("show");
  document.body.style.overflow = "auto";
}

// Delete notice function
async function deleteNotice(noticeId) {
  try {
    const response = await fetch(`/notices/${noticeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert("Notice deleted successfully!");
      location.reload();
    } else {
      const error = await response.json();
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

// Close modal when clicking outside image
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

// Close modal with ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});
