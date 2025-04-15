document.addEventListener("DOMContentLoaded", function () {
  // === LOGIN FORM LOGIC ===
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      const savedUsername = localStorage.getItem("savedUsername");
      const savedPassword = localStorage.getItem("savedPassword");

      if (!username || !password) {
        alert("Please enter both username and password.");
        return;
      }

      if (username === savedUsername && password === savedPassword) {
        alert("Login successful!");
        localStorage.setItem("loggedIn", "true"); // Store logged-in status
        window.location.href = "profile.html"; // Redirect to profile page
      } else {
        alert("Login failed. Check your credentials or click OK to create an account.");
        window.location.href = "create.html"; // Redirect to account creation page
      }
    });
  }

  // === COLLAPSIBLE LOGIC ===
  const collapsibleButtons = document.querySelectorAll(".collapsible-button");

  collapsibleButtons.forEach(button => {
    button.addEventListener("click", function () {
      const content = this.nextElementSibling;
      // Toggle the active state of the button
      this.classList.toggle("active");
      
      // Toggle the collapsible content visibility
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  });

  // === PROFILE PAGE LOGIC ===
  const profileContent = document.getElementById("profileContent");

  // Check if the user is logged in
  const loggedIn = localStorage.getItem("loggedIn");
  const savedUsername = localStorage.getItem("savedUsername");
  const biography = localStorage.getItem("biography");
  const profilePicture = localStorage.getItem("profilePicture");
  const topBooks = JSON.parse(localStorage.getItem("topBooks")) || [];

  if (profileContent) {
    if (loggedIn === "true") {
      // Create profile content dynamically
      const profileHTML = `
        <div class="profile-header">
          <img src="${profilePicture || 'default-profile.jpg'}" alt="Profile Picture" id="profile-picture" />
          <div class="welcome-message">
            <h2>Welcome, ${savedUsername}!</h2>
            <p><strong>Biography:</strong> ${biography || "No biography available."}</p>
          </div>
        </div>
        <h2><strong>Top 4 Books:</strong></h2>
        <div id="book-covers">
        <section class="gallery">
          <div class="gallery-container">
            <div class="gallery-item">
              <img src="cover1.jpg" alt="Book 1">
              <div class="overlay">
                <h3>Book Title 1</h3>
              </div>
            </div>
            <div class="gallery-item">
              <img src="cover2.jpg" alt="Book 2">
              <div class="overlay">
                <h3>Book Title 2</h3>
              </div>
            </div>
            <div class="gallery-item">
              <img src="cover3.jpg" alt="Book 3">
              <div class="overlay">
                <h3>Book Title 3</h3>
              </div>
            </div>
            <div class="gallery-item">
              <img src="cover4.jpg" alt="Book 4">
              <div class="overlay">
                <h3>Book Title 4</h3>
              </div>
            </div>
          </div>
        </section>
        </div>        
        <button id="edit-profile-btn">Edit Profile</button>
      `;

      // Inject the profile information into the page
      profileContent.innerHTML = profileHTML;

      // Edit profile button logic
      const editProfileButton = document.getElementById("edit-profile-btn");
      if (editProfileButton) {
        editProfileButton.addEventListener("click", function () {
          window.location.href = "settings.html"; // Redirect to settings.html for profile editing
        });
      }
    } else {
      // If not logged in, prompt the user to log in
      profileContent.innerHTML = `<li>Please log in to see your profile.</li>`;
    }
  }

  // === SETTINGS PAGE LOGIC ===
  const settingsForm = document.getElementById("settingsForm");

  // Profile Picture Upload
  const uploadButton = document.getElementById("upload-picture");
  const fileInput = document.getElementById("profile-picture-input");
  const profilePictureElement = document.getElementById("profile-picture");

  // When the user clicks the "Upload New Profile Picture" button, trigger the file input click event
  if (uploadButton) {
    uploadButton.addEventListener("click", function () {
      fileInput.click();  // This opens the file explorer
    });
  }

  // When the user selects a file, update the profile picture preview
  if (fileInput) {
    fileInput.addEventListener("change", function () {
      const file = fileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          profilePictureElement.src = e.target.result; // Set the new profile picture
          localStorage.setItem("profilePicture", e.target.result); // Save it to localStorage
        };
        reader.readAsDataURL(file); // Read the selected file
      }
    });
  }

  // Save Biography
  const saveBiographyButton = document.getElementById("save-biography");
  const biographyTextarea = document.getElementById("biography");

  if (biographyTextarea) {  // Check if the biography textarea exists
    // Prefill the biography field with the saved biography if available
    biographyTextarea.value = localStorage.getItem("biography") || "";

    if (saveBiographyButton) {
      saveBiographyButton.addEventListener("click", function () {
        const biographyText = biographyTextarea.value.trim();
        if (biographyText) {
          localStorage.setItem("biography", biographyText); // Save biography to localStorage
          alert("Biography saved successfully!");
        } else {
          alert("Please enter a biography.");
        }
      });
    }
  } else {
    console.log("Biography textarea not found, skipping biography save logic.");
  }

  // Save Changes Button
  const saveChangesButton = document.getElementById("save-changes");

  if (saveChangesButton) {
    saveChangesButton.addEventListener("click", function () {
      alert("Profile changes saved!");
      window.location.href = "profile.html"; // Redirect to profile page after saving changes
    });
  }
});
// Initialize or load cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Add to Cart buttons
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const book = button.closest('.book-item');
      const title = book.dataset.title;
      const url = book.dataset.url;

      // Avoid duplicates
      if (!cart.find(item => item.title === title)) {
        cart.push({ title, url });
        saveCart();
        alert(`${title} added to cart!`);
      } else {
        alert(`${title} is already in your cart.`);
      }
    });
  });

// Populate cart page with individual checkout buttons
if (document.querySelector('#cart-content-container')) {
  const cartContainer = document.createElement('div');
  cartContainer.classList.add('cart-list');

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty 🛒</p>';
  } else {
    cart.forEach(book => {
      const item = document.createElement('div');
      item.classList.add('cart-item');
      item.innerHTML = `
        <strong>${book.title}</strong> - 
       
        <button class="checkout-button" data-url="${book.url}">Checkout</button>
      `;

      // Add the individual checkout button functionality
      const checkoutButton = item.querySelector('.checkout-button');
      checkoutButton.addEventListener('click', (e) => {
       const url = e.target.dataset.url;

  // Open the book's Amazon page in a new tab
  window.open(url, '_blank');
cart = cart.filter(item => item.url !== url);
  saveCart();
  updateCartCount();

  // Optionally, remove the item from the DOM
  e.target.closest('.cart-item').remove();
if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty 🛒</p>';
  }
	
      });

      cartContainer.appendChild(item);
    });
  }

  document.querySelector('#cart-content-container').appendChild(cartContainer);
}

});
const updateCartCount = () => {
  const countSpan = document.getElementById('cart-count');
  if (countSpan) countSpan.textContent = cart.length;
};

updateCartCount();

