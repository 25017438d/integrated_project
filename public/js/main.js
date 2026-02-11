// DOM Elements
const noticeForm = document.getElementById("noticeForm");
const noticesContainer = document.getElementById("noticesContainer");
const deleteButtons = document.querySelectorAll(".delete-btn");
const editButtons = document.querySelectorAll(".edit-btn");

// Handle notice form submission
if (noticeForm) {
  noticeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const formData = new FormData(noticeForm);
    
    try {
      const response = await fetch("/notices/create", {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        alert("Notice posted successfully!");
        noticeForm.reset();
        window.location.href = "/notices";
      } else {
        alert("Failed to post notice");
      }
    } catch (error) {
      console.error("Error posting notice:", error);
    }
  });
}

// Handle delete button
deleteButtons.forEach((btn) => {
  btn.addEventListener("click", async () => {
    if (confirm("Are you sure you want to delete this notice?")) {
      const noticeId = btn.dataset.id;
      try {
        const response = await fetch(`/notices/delete/${noticeId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          btn.closest(".notice").remove();
        }
      } catch (error) {
        console.error("Error deleting notice:", error);
      }
    }
  });
});

// Handle search/filter
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll(".notice").forEach((notice) => {
      const text = notice.textContent.toLowerCase();
      notice.style.display = text.includes(query) ? "block" : "none";
    });
  });
}
