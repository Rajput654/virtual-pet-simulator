const petType = document.getElementById("petType");
const petImage = document.getElementById("petImage");
const petContainer = document.getElementById("pet-container");
const status = document.getElementById("status");
const petNameInput = document.getElementById("petNameInput");
const petNameDisplay = document.getElementById("petNameDisplay");
const ageLevelDisplay = document.getElementById("ageLevelDisplay");
const petColor = document.getElementById("petColor");

const feedSound = document.getElementById("feedSound");
const playSound = document.getElementById("playSound");

const hungerBar = document.getElementById("hungerBar");
const happinessBar = document.getElementById("happinessBar");
const energyBar = document.getElementById("energyBar");
const healthBar = document.getElementById("healthBar");

let petName = localStorage.getItem("petName") || "";
let hunger = parseInt(localStorage.getItem("hunger")) || 50;
let happiness = parseInt(localStorage.getItem("happiness")) || 80;
let energy = parseInt(localStorage.getItem("energy")) || 70;
let health = 100;
let isSleeping = false;
let age = parseInt(localStorage.getItem("age")) || 0;
let level = Math.floor(age / 5);

function setPetName() {
  petName = petNameInput.value.trim();
  localStorage.setItem("petName", petName);
  displayPetName();
}

function displayPetName() {
  petNameDisplay.textContent = petName ? `🐾 ${petName}` : "";
  ageLevelDisplay.textContent = `Age: ${age} | Level: ${level}`;
}

function changePet() {
  const pet = petType.value;

  // Set new image based on pet type
  const imgUrl = pet === "dog"
    ? "https://cdn-icons-png.flaticon.com/512/616/616408.png"
    : "https://cdn-icons-png.flaticon.com/512/616/616430.png"; // Cat image
  petImage.src = imgUrl;

  // Save pet type
  localStorage.setItem("petType", pet);

  // Reset all stats
  resetStats();
}

function resetStats() {
  hunger = 50;
  happiness = 80;
  energy = 70;
  health = 100;
  age = 0;
  level = 0;
  isSleeping = false;

  localStorage.setItem("hunger", hunger);
  localStorage.setItem("happiness", happiness);
  localStorage.setItem("energy", energy);
  localStorage.setItem("age", age);

  updateBars();
}



function changeColor() {
  petImage.style.filter = petColor.value;
}

function updateBars() {
  hungerBar.style.width = `${100 - hunger}%`;
  happinessBar.style.width = `${happiness}%`;
  energyBar.style.width = `${energy}%`;

  health = 100 - (hunger * 0.4 + (100 - happiness) * 0.3 + (30 - energy) * 0.3);
  health = Math.max(0, Math.min(100, health));
  healthBar.style.width = `${health}%`;

  localStorage.setItem("hunger", hunger);
  localStorage.setItem("happiness", happiness);
  localStorage.setItem("energy", energy);

  let mood = "😊 Happy";
  petContainer.className = "happy";

  if (health < 40) {
    mood = "😷 Sick";
    petContainer.className = "sick";
  } else if (isSleeping) {
    mood = "😴 Sleeping";
    petContainer.className = "sleeping";
  } else if (happiness < 40 || hunger > 70 || energy < 30) {
    mood = "😢 Sad";
    petContainer.className = "sad";
  }

  status.textContent = `${mood} - ${petName || "Your pet"}`;
  displayPetName();
}

function feedPet() {
  if (isSleeping) return;
  hunger = Math.max(0, hunger - 20);
  energy = Math.min(100, energy + 15);
  feedSound.play();
  petImage.style.transform = "scale(1.1)";
  setTimeout(() => petImage.style.transform = "scale(1)", 200);
  updateBars();
}

function playWithPet() {
  if (isSleeping) return;
  happiness = Math.min(100, happiness + 20);
  energy = Math.max(0, energy - 15);
  playSound.play();
  petImage.style.transform = "rotate(10deg)";
  setTimeout(() => petImage.style.transform = "rotate(0deg)", 200);
  updateBars();
}

// Age every 30 seconds
setInterval(() => {
  age++;
  level = Math.floor(age / 5);
  localStorage.setItem("age", age);
  displayPetName();
}, 30000);

// Stat decay every 5 seconds
setInterval(() => {
  if (!isSleeping) {
    hunger = Math.min(100, hunger + 2);
    happiness = Math.max(0, happiness - 1);
    energy = Math.max(0, energy - 1);
  }

  if (energy < 20) {
    isSleeping = true;
    energy = Math.min(100, energy + 5);
  } else if (energy > 60) {
    isSleeping = false;
  }

  updateBars();
}, 5000);

// Day/Night cycle every 60 seconds
let isDay = true;
setInterval(() => {
  document.body.className = isDay ? "night" : "day";
  isDay = !isDay;
}, 60000);

window.onload = () => {
  const savedType = localStorage.getItem("petType") || "dog";
  petType.value = savedType;
  changePet(); // <- loads correct image and resets stats

  petNameInput.value = localStorage.getItem("petName") || "";
  displayPetName();
  changeColor();
  updateBars();
  document.body.className = "day";
};

