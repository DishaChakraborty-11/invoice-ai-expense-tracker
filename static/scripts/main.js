document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".primary");
  if (button) {
    button.addEventListener("click", () => {
      window.location.href = "upload.html";
    });
  }
});
