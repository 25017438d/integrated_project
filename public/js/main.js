// Highlight active nav link
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('nav a');
  const currentPath = window.location.pathname;
  
  // Remove all active classes first
  navLinks.forEach(link => {
    link.classList.remove('active');
  });
  
  // Find the best matching link
  let bestMatch = null;
  let bestMatchLength = 0;
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // Exact match
    if (currentPath === href) {
      bestMatch = link;
      bestMatchLength = href.length;
    }
    // Prefix match only if it's longer than current best and makes sense
    else if (currentPath.startsWith(href + '/') && href.length > bestMatchLength && href !== '/') {
      bestMatch = link;
      bestMatchLength = href.length;
    }
  });
  
  // Highlight the best match
  if (bestMatch) {
    bestMatch.classList.add('active');
  }

  // Search functionality
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const notices = document.querySelectorAll('.notice');
      
      notices.forEach(notice => {
        const description = notice.querySelector('p')?.textContent.toLowerCase() || '';
        const venue = notice.querySelector('small')?.textContent.toLowerCase() || '';
        const text = description + ' ' + venue;
        
        if (text.includes(query)) {
          notice.style.display = 'block';
        } else {
          notice.style.display = 'none';
        }
      });
    });
  }
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
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest"
      }
    });
    console.log("Response status:", response.status);
    
    let data;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch (e) {
        console.warn("Failed to parse JSON response", e);
      }
    } else {
      // non-JSON response (e.g. HTML redirect page)
      const text = await response.text();
      console.warn("Non-JSON response body:", text.slice(0, 200));
    }

    if (response.ok) {
      console.log("Success:", data);
      alert("Notice deleted successfully!");
      location.reload();
    } else {
      console.log("Error:", data);
      const msg = data && data.error ? data.error : "Could not delete notice";
      alert("Error: " + msg);
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


