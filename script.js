const form = document.getElementById('interactiveForm');
const passInput = document.getElementById('password');
const strengthMeter = document.getElementById('strengthMeter');
const strengthBar = document.getElementById('strengthBar');

// --- Real-time Password Strength Meter Engine ---
passInput.addEventListener('input', () => {
    const val = passInput.value;
    if (!val) {
        strengthMeter.style.display = 'none';
        return;
    }
    
    strengthMeter.style.display = 'block';
    let checks = 0;
    if (val.length >= 8) checks++;
    if (/[A-Z]/.test(val)) checks++;
    if (/[0-9]/.test(val)) checks++;
    if (/[^A-Za-z0-9]/.test(val)) checks++;

    if (checks <= 1) {
        strengthBar.style.width = '30%';
        strengthBar.style.background = '#ff5252';
    } else if (checks === 2 || checks === 3) {
        strengthBar.style.width = '65%';
        strengthBar.style.background = '#ffeb3b';
    } else {
        strengthBar.style.width = '100%';
        strengthBar.style.background = '#00e676';
    }
});

// --- Validation and Submission Control ---
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Field Extraction
    const nameVal = document.getElementById('fullName').value.trim();
    const emailVal = document.getElementById('email').value.trim();
    const mobileVal = document.getElementById('mobile').value.trim();
    const dobVal = document.getElementById('dob').value;
    const passVal = passInput.value;
    const cPassVal = document.getElementById('confirmPassword').value;
    const genderChecked = document.querySelector('input[name="gender"]:checked');
    const courseVal = document.getElementById('course').value;
    const addressVal = document.getElementById('address').value.trim();

    // Clear Previous State Error Layouts
    document.querySelectorAll('.error-message').forEach(el => el.innerText = '');
    let pass = true;

    // 1. Mandatory Name Check
    if (!nameVal) { document.getElementById('nameError').innerText = 'Full name is required.'; pass = false; }
    
    // 2. Email Formatting Check
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) { document.getElementById('emailError').innerText = 'Email address is required.'; pass = false; }
    else if (!emailFormat.test(emailVal)) { document.getElementById('emailError').innerText = 'Please enter a valid email format.'; pass = false; }

    // 3. 10-Digit Mobile Check
    const mobileFormat = /^\d{10}$/;
    if (!mobileVal) { document.getElementById('mobileError').innerText = 'Mobile number is required.'; pass = false; }
    else if (!mobileFormat.test(mobileVal)) { document.getElementById('mobileError').innerText = 'Mobile number must be exactly 10 digits.'; pass = false; }

    // 4. DOB Mandatory Check
    if (!dobVal) { document.getElementById('dobError').innerText = 'Date of birth is required.'; pass = false; }

    // 5. 8-Character Password Check
    if (!passVal) { document.getElementById('passwordError').innerText = 'Password is required.'; pass = false; }
    else if (passVal.length < 8) { document.getElementById('passwordError').innerText = 'Password must contain at least 8 characters.'; pass = false; }

    // 6. Matching Passwords Check
    if (!cPassVal) { document.getElementById('cPasswordError').innerText = 'Please confirm your password.'; pass = false; }
    else if (passVal !== cPassVal) { document.getElementById('cPasswordError').innerText = 'Password and Confirm Password must match.'; pass = false; }

    // 7, 8, 9. Gender, Course, & Address Checks
    if (!genderChecked) { document.getElementById('genderError').innerText = 'Gender selection is required.'; pass = false; }
    if (!courseVal) { document.getElementById('courseError').innerText = 'Please choose a course.'; pass = false; }
    if (!addressVal) { document.getElementById('addressError').innerText = 'Address field cannot be empty.'; pass = false; }

    // If validation succeeds, trigger success view overlay and confetti particles
    if (pass) {
        document.getElementById('successScreen').classList.add('active');
        triggerConfettiShower();
    }
});

function resetFormView() {
    document.getElementById('successScreen').classList.remove('active');
    form.reset();
    strengthMeter.style.display = 'none';
}

// --- Canvas Confetti Engine Architecture ---
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animId;

function runResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', runResize);

function triggerConfettiShower() {
    runResize();
    particles = [];
    const colors = ['#00e676', '#00b0ff', '#ffeb3b', '#ff5252', '#e040fb'];
    
    for (let i = 0; i < 120; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 6 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedX: Math.random() * 4 - 2,
            speedY: Math.random() * 5 + 4,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 4 - 2
        });
    }
    cancelAnimationFrame(animId);
    animateConfettiLoop();

    // End loop animation automatically after 4.5s to preserve performance
    setTimeout(() => {
        cancelAnimationFrame(animId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 4500);
}

function animateConfettiLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
    });
    animId = requestAnimationFrame(animateConfettiLoop);
}