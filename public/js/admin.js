const loginForm = document.getElementById("loginForm");
const loadVotesBtn = document.getElementById("loadVotesBtn");
const adminStatus = document.getElementById("adminStatus");
const votesOutput = document.getElementById("votesOutput");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    localStorage.setItem("wsc_token", data.token);
    adminStatus.textContent = "Login successful. Token saved in localStorage.";
  } catch (error) {
    adminStatus.textContent = "Invalid login.";
  }
});

loadVotesBtn.addEventListener("click", async () => {
  const token = localStorage.getItem("wsc_token");

  if (!token) {
    adminStatus.textContent = "No token found. Please log in first.";
    return;
  }

  try {
    const response = await fetch("/api/admin/votes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch votes");
    }

    const votes = await response.json();
    votesOutput.textContent = JSON.stringify(votes, null, 2);
    adminStatus.textContent = `Loaded ${votes.length} votes.`;
  } catch (error) {
    adminStatus.textContent = "Could not load votes. Ensure admin token is valid.";
  }
});