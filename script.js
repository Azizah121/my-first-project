document.addEventListener("DOMContentLoaded", function () {
   // === LOGIN FORM LOGIC ===
   const loginForm = document.getElementById("loginForm");

   if (loginForm) {
      loginForm.addEventListener("submit", function (event) {
         event.preventDefault();

         const username = document.getElementById("username").value.trim();
         const password = document.getElementById("password").value.trim();

         const userData = JSON.parse(localStorage.getItem(`user_${username}`));

         if (!username || !password) {
            alert("Please enter both username and password.");
            return;
         }

         if (userData && userData.password === password) {
            alert("Login successful!");
            localStorage.setItem("loggedInUser", username);
            window.location.href = "profile.html";
         } else {
            alert("Login failed. Check your credentials or click OK to create an account.");
            window.location.href = "create.html";
         }
      });
   }

   const createAccountForm = document.getElementById("createAccountForm");

   if (createAccountForm) {
      createAccountForm.addEventListener("submit", function (event) {
         event.preventDefault();

         const newUsername = document.getElementById("newUsername").value.trim();
         const newPassword = document.getElementById("newPassword").value.trim();
         const confirmPassword = document.getElementById("confirmPassword").value.trim();

         if (!newUsername || !newPassword || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
         }

         if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
         }

         if (localStorage.getItem(`user_${newUsername}`)) {
            alert("Username already exists. Please choose another.");
            return;
         }

         const newUser = {
            password: newPassword,
            biography: "",
            profilePicture: "",
            topBooks: [],
            activities: [],
            cart: [],
            ratings: {}
         };

         localStorage.setItem(`user_${newUsername}`, JSON.stringify(newUser));
         localStorage.setItem("loggedInUser", newUsername);
         alert("Account created successfully! You are now logged in.");

         window.location.href = "profile.html";
      });
   }

   // === COLLAPSIBLE LOGIC ===
   document.querySelectorAll(".collapsible-button").forEach(button => {
      button.addEventListener("click", function () {
         const content = this.nextElementSibling;
         this.classList.toggle("active");
         content.style.display = content.style.display === "block" ? "none" : "block";
      });
   });

   // === PROFILE PAGE LOGIC ===
   const loggedInUser = localStorage.getItem("loggedInUser");
   const userData = loggedInUser ? JSON.parse(localStorage.getItem(`user_${loggedInUser}`)) : null;

   if (document.getElementById("profileContent")) {
      const profileContent = document.getElementById("profileContent");

      if (loggedInUser && userData) {
         const profileHTML = `
        <div class="profile-header">
          <img src="${userData.profilePicture || 'default-profile.jpg'}" alt="Profile Picture" id="profile-picture" />
          <div class="welcome-message">
            <h2>Welcome, ${loggedInUser}!</h2>
            <p><strong>Biography:</strong> ${userData.biography || "No biography available."}</p>
          </div>
        </div>
        <h2><strong>Top 4 Books:</strong></h2>
        <div id="book-covers">
          <section class="gallery">
            <div class="gallery-container">
              ${(userData.topBooks || []).map(book => `
                <div class="gallery-item">
                  <img src="${book.cover}" alt="${book.title}">
                  <div class="overlay"><h3>${book.title}</h3></div>
                </div>
              `).join('')}
            </div>
          </section>
        </div>
        <button id="edit-profile-btn">Edit Profile</button>
        <button id="logoutButton">Log Out</button>
      `;

         profileContent.innerHTML = profileHTML;

         document.getElementById("edit-profile-btn")?.addEventListener("click", () => {
            window.location.href = "settings.html";
         });

         document.getElementById("logoutButton")?.addEventListener("click", () => {
            localStorage.removeItem("loggedInUser");
            alert("You have been logged out.");
            window.location.href = "index.html";
         });
      }
   }
   if (!loggedInUser || !userData) {
      if (document.getElementById("profileContent")) {
         document.getElementById("profileContent").innerHTML = `<p style="text-align:left">Please log in to see your profile.</p>`;
      }

      if (document.getElementById("cartContainer")) {
         document.getElementById("cartContainer").innerHTML = '<p>Please log in to see your cart.</p>';
      }

      if (document.querySelector(".activity-feed")) {
         document.querySelector(".activity-feed").innerHTML = '<p>Please log in to see your activity.</p>';
      }
   }

   // === SETTINGS PAGE LOGIC ===
   const uploadButton = document.getElementById("upload-picture");
   const fileInput = document.getElementById("profile-picture-input");
   const profilePictureElement = document.getElementById("profile-picture");
   const saveBiographyButton = document.getElementById("save-biography");
   const biographyTextarea = document.getElementById("biography");

   if (loggedInUser && userData) {
      uploadButton?.addEventListener("click", () => fileInput?.click());

      fileInput?.addEventListener("change", function () {
         const file = fileInput.files[0];
         if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
               profilePictureElement.src = e.target.result;
               userData.profilePicture = e.target.result;
               localStorage.setItem(`user_${loggedInUser}`, JSON.stringify(userData));
            };
            reader.readAsDataURL(file);
         }
      });

      if (biographyTextarea) {
         biographyTextarea.value = userData.biography || "";
         saveBiographyButton?.addEventListener("click", () => {
            const biographyText = biographyTextarea.value.trim();
            userData.biography = biographyText;
            localStorage.setItem(`user_${loggedInUser}`, JSON.stringify(userData));
            alert("Biography saved successfully!");
         });
      }

      document.getElementById("save-changes")?.addEventListener("click", () => {
         alert("Profile changes saved!");
         window.location.href = "profile.html";
      });

      for (let i = 1; i <= 4; i++) {
         document.getElementById(`save-book-${i}`)?.addEventListener("click", () => {
            const coverInput = document.getElementById(`book-cover-input-${i}`);
            const titleInput = document.getElementById(`book-title-input-${i}`);
            const file = coverInput?.files[0];
            const title = titleInput?.value.trim();

            if (!file || !title) {
               alert(`Please provide both a cover image and title for Book ${i}.`);
               return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
               const bookData = {
                  title,
                  cover: e.target.result
               };
               userData.topBooks[i - 1] = bookData;
               localStorage.setItem(`user_${loggedInUser}`, JSON.stringify(userData));
               alert(`Book ${i} saved!`);
            };
            reader.readAsDataURL(file);
         });
      }

      for (let i = 1; i <= 4; i++) {
         const titleInput = document.getElementById(`book-title-input-${i}`);
         const coverInput = document.getElementById(`book-cover-input-${i}`);

         if (userData.topBooks[i - 1]) {
            if (titleInput) titleInput.value = userData.topBooks[i - 1].title || "";
            if (coverInput && userData.topBooks[i - 1].cover) {
               const previewImg = document.createElement("img");
               previewImg.src = userData.topBooks[i - 1].cover;
               previewImg.alt = "Book Cover Preview";
               previewImg.style.width = "80px";
               previewImg.style.marginTop = "5px";
               coverInput.parentNode.insertBefore(previewImg, coverInput.nextSibling);
            }
         }
      }

      // === CART LOGIC ===
      const cart = userData.cart || [];

      function saveCart() {
         userData.cart = cart;
         localStorage.setItem(`user_${loggedInUser}`, JSON.stringify(userData));
      }

      document.querySelectorAll('.add-to-cart').forEach(button => {
         button.addEventListener('click', () => {
            const book = button.closest('.book-item');
            const title = book.dataset.title;
            const url = book.dataset.url;

            if (!cart.find(item => item.title === title)) {
               cart.push({
                  title,
                  url
               });
               saveCart();
               updateCartCount();
               alert(`${title} added to cart!`);
            } else {
               alert(`${title} is already in your cart.`);
            }

            addActivity(`You added <em>${title}</em> to your cart.`);
         });
      });

      function updateCartCount() {
         const countSpan = document.getElementById('cart-count');
         if (countSpan) countSpan.textContent = cart.length;
      }

      updateCartCount();

      if (document.querySelector('#cart-content-container')) {
         const cartContainer = document.createElement('div');
         cartContainer.classList.add('cart-list');

         if (cart.length === 0) {
            cartContainer.innerHTML = '<p>Cart is empty 🛒</p>';
         } else {
            cart.forEach(book => {
               const item = document.createElement('div');
               item.classList.add('cart-item');
               item.innerHTML = `
            <strong>${book.title}</strong>
            <button class="checkout-button" data-url="${book.url}">Checkout</button>
          `;
               item.querySelector('.checkout-button').addEventListener('click', (e) => {
                  const url = e.target.dataset.url;
                  window.open(url, '_blank');
                  const index = cart.findIndex(item => item.url === url);
                  if (index > -1) cart.splice(index, 1);
                  saveCart();
                  updateCartCount();
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

      // === ACTIVITY TRACKING ===
      function addActivity(message) {
         userData.activities.unshift({
            message,
            time: new Date().toLocaleString()
         });
         localStorage.setItem(`user_${loggedInUser}`, JSON.stringify(userData));
      }

      if (document.querySelector('.activity-feed')) {
         const activityFeed = document.querySelector(".activity-feed");
         const activities = userData.activities || [];

         if (activities.length === 0) {
            activityFeed.innerHTML = `<p>You have no recent activity.</p>`;
         } else {
            activityFeed.innerHTML = activities.map(a => `
          <div class="activity-item">${a.message} <span class="time">${a.time}</span></div>
        `).join('');
         }
      }
      // === STAR RATING ===
      document.querySelectorAll('.star-rating').forEach(container => {
         const title = container.dataset.title;
         const stars = container.querySelectorAll('.star');
         const savedRating = userData.ratings[title] || 0;

         highlightStars(stars, savedRating);

         stars.forEach(star => {
            star.addEventListener('click', () => {
               const rating = Number(star.dataset.value);
               userData.ratings[title] = rating;
               localStorage.setItem(`user_${loggedInUser}`, JSON.stringify(userData));
               highlightStars(stars, rating);
               addActivity(`You rated <em>${title}</em> ${rating} 🌠`);
            });

            star.addEventListener('mouseenter', () => {
               highlightStars(stars, Number(star.dataset.value));
            });

            star.addEventListener('mouseleave', () => {
               highlightStars(stars, userData.ratings[title] || 0);
            });
         });
      });

      function highlightStars(stars, rating) {
         stars.forEach((s, i) => {
            s.style.color = i < rating ? 'gold' : 'gray';
         });
      }
   }
});
