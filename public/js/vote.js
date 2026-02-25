const projectSelect = document.getElementById("projectSelect");
const voteForm = document.getElementById("voteForm");
const voteStatus = document.getElementById("voteStatus");
const disableVotingToggle = document.getElementById("disableVotingToggle");

async function loadProjects() {
  try {
    const response = await fetch("/api/projects");
    const projects = await response.json();

    projectSelect.innerHTML = "";
    projects.forEach((project) => {
      const option = document.createElement("option");
      option.value = project.id;
      option.textContent = `${project.id} - ${project.title}`;
      projectSelect.appendChild(option);
    });
  } catch (error) {
    voteStatus.textContent = "Failed to load projects.";
  }
}

disableVotingToggle.addEventListener("change", () => {
  const disabled = disableVotingToggle.checked;
  voteForm.querySelectorAll("input, select, button").forEach((element) => {
    element.disabled = disabled;
  });
  disableVotingToggle.disabled = false;
  voteStatus.textContent = disabled ? "Voting is disabled on this page." : "Voting is enabled.";
});

voteForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    name: document.getElementById("voterName").value,
    projectId: document.getElementById("projectSelect").value,
    score: document.getElementById("score").value,
  };

  try {
    const response = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Vote failed");
    }

    voteStatus.textContent = "Vote submitted successfully.";
    voteForm.reset();
  } catch (error) {
    voteStatus.textContent = "Failed to submit vote.";
  }
});

loadProjects();