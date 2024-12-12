// Common JavaScript functions
document.addEventListener("DOMContentLoaded", function () {
  // Authentication functions
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  // Login form handler
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(loginForm);
      formData.append("type", "login");
      try {
        const response = await fetch("../auth.php", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data.success) {
          window.location.href = "dashboard.html";
        } else {
          document.getElementById("errorText").textContent = data.message;
          document.querySelector(".error-msg").classList.remove("hidden");
        }
      } catch (error) {
        document.getElementById("errorText").textContent = "Login failed";
        document.querySelector(".error-msg").classList.remove("hidden");
      }
    });
  }

  // Registration form handler
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(registerForm);
      formData.append("type", "register");

      try {
        const response = await fetch("../auth.php", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          window.location.href = "login.html";
        } else {
          document.getElementById("errorText").textContent = data.message;
          document.querySelector(".error-msg").classList.remove("hidden");
        }
      } catch (error) {
        document.getElementById("errorText").textContent =
          "Registration failed: " + error.message;
        document.querySelector(".error-msg").classList.remove("hidden");
      }
    });
  }

  // Set username in dashboard
  const usernameSpan = document.getElementById("username");
  if (usernameSpan) {
    fetch("../auth.php?get_username=1")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          usernameSpan.textContent = data.username;
        }
      })
      .catch(() => {
        // Silent fail - username will stay empty
      });
  }

  // Check if user is admin and show/hide admin button
  const adminButton = document.querySelector(".admin-only");
  if (adminButton) {
    fetch("../auth.php?check_admin=1")
      .then((response) => response.json())
      .then((data) => {
        if (data.is_admin) {
          adminButton.style.display = "inline-flex";
        }
      })
      .catch(() => {
        // Silent fail - admin button stays hidden
      });
  }

  // Dashboard functions
  const passwordsList = document.getElementById("passwordsList");
  if (passwordsList) {
    loadPasswords();
  }

  // Admin panel functions
  const usersList = document.getElementById("usersList");
  if (usersList) {
    loadAdminData();
  }

  // Add password form handler
  const addPasswordForm = document.getElementById("addPasswordForm");
  if (addPasswordForm) {
    addPasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(addPasswordForm);
      try {
        const response = await fetch("../add_password.php", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data.success) {
          addPasswordForm.reset();
          loadPasswords(); // Reload the passwords list
        } else {
          alert(data.message || "Failed to add password");
        }
      } catch (error) {
        alert("Failed to add password");
      }
    });
  }
});

// Load passwords for dashboard
async function loadPasswords() {
  try {
    const response = await fetch("../dashboard.php");
    const data = await response.json();
    if (data.success) {
      displayPasswords(data.data);
    }
  } catch (error) {
    console.error("Error loading passwords:", error);
  }
}

// Display passwords in dashboard
function displayPasswords(passwords) {
  const passwordsList = document.getElementById("passwordsList");
  if (passwords.length === 0) {
    passwordsList.innerHTML = `
      <div class="passwords-container">
        <div class="no-passwords">
          <i class="fas fa-lock"></i>
          <p>No passwords saved yet</p>
        </div>
      </div>
    `;
    return;
  }

  passwordsList.innerHTML = `
    <div class="passwords-container">
      ${passwords
        .map(
          (password) => `
        <div class="password-item">
          <div class="item-main">
            <div class="site-info">
              <div class="site-icon">
                ${password.website.charAt(0).toUpperCase()}
              </div>
              <div class="site-details">
                <div class="site-name">${password.website}</div>
                <div class="site-username">
                  <i class="fas fa-user"></i>
                  ${password.username}
                </div>
              </div>
            </div>
            <div class="password-container">
              <div class="password-field">
                <input type="password" value="${password.password}" readonly />
              </div>
              <div class="action-buttons">
                <button class="action-button toggle-password" onclick="togglePassword(this)" title="Show/Hide">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="action-button delete-btn" onclick="deletePassword(${
                  password.id
                })" title="Delete">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

// Load admin panel data
async function loadAdminData() {
  try {
    const response = await fetch("../admin.php");
    const data = await response.json();
    if (data.success) {
      updateAdminDashboard(data.data);
    }
  } catch (error) {
    console.error("Error loading admin data:", error);
  }
}

// Update admin dashboard with delete functionality
function updateAdminDashboard(data) {
  document.getElementById(
    "totalUsers"
  ).textContent = `${data.total_users} Users`;
  document.getElementById(
    "totalPasswords"
  ).textContent = `${data.total_passwords} Passwords`;

  const usersList = document.getElementById("usersList");
  usersList.innerHTML = data.users
    .map(
      (user) => `
    <div class="user-row">
      <div class="user-info">
        <div class="user-avatar">${user.username.charAt(0).toUpperCase()}</div>
        <div class="user-details">
          <div class="username">${user.username}</div>
          <div class="user-meta">
            <div class="role-badge ${user.is_admin ? "admin" : "user"}">
              <i class="fas ${user.is_admin ? "fa-shield-alt" : "fa-user"}"></i>
              ${user.is_admin ? "Admin" : "User"}
            </div>
            <div class="password-count">
              <i class="fas fa-key"></i> ${user.password_count}
            </div>
            <div class="join-date">
              <i class="fas fa-calendar-alt"></i>
              ${new Date(user.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
      ${
        !user.is_admin
          ? `
        <button onclick="deleteUser(${user.id})" class="delete-btn" title="Delete User">
          <i class="fas fa-trash"></i>
        </button>
      `
          : ""
      }
    </div>
  `
    )
    .join("");
}

// Delete user function
async function deleteUser(userId) {
  try {
    const response = await fetch("../admin.php", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    if (data.success) {
      loadAdminData(); // Reload the users list
    } else {
      document.getElementById("errorText").textContent =
        data.message || "Failed to delete user";
      document.querySelector(".error-msg").classList.remove("hidden");
    }
  } catch (error) {
    document.getElementById("errorText").textContent = "Failed to delete user";
    document.querySelector(".error-msg").classList.remove("hidden");
  }
}

// Logout function
async function logout() {
  try {
    const response = await fetch("../logout.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.success) {
      window.location.replace("login.html");
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
}

// Toggle password visibility
function togglePassword(button) {
  // Find the closest password field and then find the input within it
  const passwordField = button
    .closest(".password-container")
    .querySelector(".password-field input");
  const icon = button.querySelector("i");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    icon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    passwordField.type = "password";
    icon.classList.replace("fa-eye-slash", "fa-eye");
  }
}

// Add password deletion functionality
async function deletePassword(passwordId) {
  try {
    const response = await fetch("../delete_password.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ passwordId }),
    });
    const data = await response.json();
    if (data.success) {
      loadPasswords(); // Reload the passwords list
    } else {
      document.getElementById("errorText").textContent =
        data.message || "Failed to delete password";
      document.querySelector(".error-msg").classList.remove("hidden");
    }
  } catch (error) {
    document.getElementById("errorText").textContent =
      "Failed to delete password";
    document.querySelector(".error-msg").classList.remove("hidden");
  }
}
