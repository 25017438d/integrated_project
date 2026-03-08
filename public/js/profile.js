document.addEventListener("DOMContentLoaded", () => {
  const profileContainer = document.getElementById("profilePictureContainer");
  const fileInput = document.getElementById("profileImage");
  const imageForm = document.getElementById("profileImageForm");
  const imageError = document.getElementById("imageError");

  if (profileContainer && fileInput && imageForm) {
    profileContainer.addEventListener("click", () => {
      fileInput.click();
    });

    fileInput.addEventListener("change", (e) => {
      if (imageError) imageError.textContent = "";

      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const maxBytes = 2 * 1024 * 1024;

      if (!file.type.startsWith("image/")) {
        if (imageError) imageError.textContent = "Selected file is not an image.";
        fileInput.value = "";
        return;
      }

      if (file.size > maxBytes) {
        if (imageError) imageError.textContent = "Image is too large (max 2MB).";
        fileInput.value = "";
        return;
      }

      imageForm.submit();
    });
  }

  const passwordForm = document.getElementById("passwordForm");
  const passwordError = document.getElementById("passwordError");

  if (passwordForm) {
    passwordForm.addEventListener("submit", (e) => {
      const newPassword = document.getElementById("newPassword")?.value || "";
      const confirmPassword = document.getElementById("confirmPassword")?.value || "";
      const complexity = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

      if (passwordError) passwordError.textContent = "";

      if (newPassword !== confirmPassword) {
        e.preventDefault();
        if (passwordError) passwordError.textContent = "New passwords do not match.";
        return;
      }

      if (!complexity.test(newPassword)) {
        e.preventDefault();
        if (passwordError) {
          passwordError.textContent =
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
        }
      }
    });
  }
});
