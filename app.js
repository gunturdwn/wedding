// ================= CONFIG =================
const API_URL = "https://script.google.com/macros/s/AKfycbx9Gv3GsG3-Dj5gUNwhlWZwud0EbCSIaIq-lwUc3LORXOnsfrvKFr7GiST4zEwCFl2C/exec";

// ================= DOM =================
const heroOverlay = document.getElementById('heroOverlay');
const openInvitationBtn = document.getElementById('openInvitationBtn');
const mainContent = document.getElementById('mainContent');
const weddingMusic = document.getElementById('weddingMusic');
const musicIndicator = document.getElementById('musicIndicator');
const guestNameEl = document.getElementById('guestName');

// ================= INIT =================
window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  const guest = params.get("to");

  if (guest) {
    showInvitation(guest);
  } else {
    // Jika tidak ada tamu, tampilkan halaman RSVP kosong
    document.getElementById("invitationPage").classList.remove("hidden");
    guestNameEl.innerText = "Dear Guest";
    document.getElementById("name").value = "Guest";
  }

  initParticles();
  updateCountdown();
  setInterval(updateCountdown, 1000);
};

// ================= VIEWS =================
function showInvitation(nama) {
  const n = nama.replace(/_/g, " ");
  guestNameEl.innerText = "Dear " + n;
  document.getElementById("name").value = n;
  document.getElementById("invitationPage").classList.remove("hidden");
}

// ================= MUSIC =================
let isMusicPlaying = true;
musicIndicator.addEventListener('click', () => {
  if (isMusicPlaying) {
    weddingMusic.pause();
    musicIndicator.innerHTML = '<i class="fas fa-volume-mute"></i><span>Music Off</span>';
  } else {
    weddingMusic.play();
    musicIndicator.innerHTML = '<i class="fas fa-volume-up"></i><span>Music On</span>';
  }
  isMusicPlaying = !isMusicPlaying;
});

// ================= COUNTDOWN =================
const weddingDate = new Date("June 15, 2026 16:00:00").getTime();
function updateCountdown() {
  const now = new Date().getTime();
  const distance = weddingDate - now;
  if (distance < 0) return ["00", "00", "00", "00"];
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  document.getElementById("days").innerText = String(days).padStart(2, '0');
  document.getElementById("hours").innerText = String(hours).padStart(2, '0');
  document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
  document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
}

// ================= PARTICLES =================
function initParticles() {
  particlesJS('particles-js', {
    particles: {
      number: { value: 50, density: { enable: true, value_area: 600 } },
      color: { value: "#ff6b9d" },
      shape: { type: "circle" },
      opacity: { value: 0.15, random: true, anim: { enable: true, speed: 0.8, opacity_min: 0.08 } },
      size: { value: 4, random: true, anim: { enable: true, speed: 1.5 } },
      line_linked: { enable: true, distance: 130, color: "#ff6b9d", opacity: 0.2, width: 1 },
      move: { enable: true, speed: 0.8, direction: "none", random: true }
    },
    interactivity: {
      detect_on: "canvas",
      events: { onclick: { enable: true, mode: "push" }, resize: true },
      modes: { push: { particles_nb: 3 } }
    },
    retina_detect: true
  });
}

// ================= OPEN INVITATION =================
openInvitationBtn.addEventListener('click', () => {
  weddingMusic.play().catch(e => console.log("Autoplay prevented"));
  heroOverlay.style.opacity = '0';
  heroOverlay.style.visibility = 'hidden';
  setTimeout(() => {
    mainContent.classList.remove('hidden-hero');
    mainContent.classList.add('show-hero');
    document.body.classList.remove('overflow-hidden');
    createConfetti();
  }, 800);
});

// ================= CONFETTI =================
function createConfetti() {
  const colors = ['#ff6b9d', '#ff8ecb', '#ffffff'];
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
    confetti.style.width = (Math.random() * 10 + 5) + 'px';
    confetti.style.height = confetti.style.width;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 5000);
  }
}

// ================= RSVP SUBMIT =================
document.getElementById("rsvpForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const jumlah = document.getElementById("jumlah").value;
  if (!jumlah || jumlah <= 0) {
    alert("Jumlah orang wajib diisi minimal 1 ya 😊");
    return;
  }

  const data = {
    nama: document.getElementById("name").value,
    status: document.getElementById("status").value,
    jumlah: jumlah,
    catatan: document.getElementById("catatan").value
  };

  try {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data)
    });
    alert("Terima kasih! RSVP berhasil dikirim 💖");
    document.getElementById("jumlah").value = "";
    document.getElementById("catatan").value = "";
  } catch (err) {
    alert("Gagal mengirim RSVP. Coba lagi nanti.");
  }
});