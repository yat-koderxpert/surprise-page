// Get elements
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const popup = document.getElementById('popup');
const container = document.querySelector('.container');
const buttonContainer = document.querySelector('.button-container');
const bear = document.getElementById('bear');
const speechBubble = document.getElementById('speechBubble');

let noClickCount = 0;
let isMobile = false;

// Detect mobile/touch device
function checkMobile() {
    isMobile = ('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0) ||
               (window.innerWidth <= 768);
}

// Run on load and resize
checkMobile();
window.addEventListener('resize', checkMobile);

// Yes button click handler
yesBtn.addEventListener('click', () => {
    // Make bear happy
    makeBearHappy();

    // Show popup after a short delay
    setTimeout(() => {
        popup.classList.add('show');
        // Create confetti effect
        createConfetti();
    }, 500);
});

// No button hover handler (only for desktop)
noBtn.addEventListener('mouseenter', () => {
    if (!isMobile) {
        moveNoButton();
    }
});

// No button click handler (for mobile and desktop)
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
});

// Touch handler for mobile
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
}, { passive: false });

// Function to make bear happy
function makeBearHappy() {
    bear.classList.remove('angry', 'very-angry');
    bear.classList.add('happy');

    // Show happy speech bubble
    showSpeechBubble('YAY! I love you! 💕', 'happy');
}

// Function to make bear angry with escalating levels
function makeBearAngry(level) {
    bear.classList.remove('happy');

    if (level >= 5) {
        bear.classList.add('very-angry');
        bear.classList.add('angry');
    } else {
        bear.classList.add('angry');
        bear.classList.remove('very-angry');
    }

    // Show angry speech bubbles based on level
    const angryMessages = [
        'Hey! 😠',
        'Come on! 😤',
        'Please?! 😡',
        'WHY?! 🤬',
        'FINE!! 💢'
    ];

    const messageIndex = Math.min(level - 1, angryMessages.length - 1);
    showSpeechBubble(angryMessages[messageIndex], 'angry');

    // Reset after a delay (but stay angry if high level)
    if (level < 3) {
        setTimeout(() => {
            bear.classList.remove('angry', 'very-angry');
            hideSpeechBubble();
        }, 2000);
    }
}

// Function to show speech bubble
function showSpeechBubble(text, mood) {
    speechBubble.textContent = text;
    speechBubble.classList.remove('angry', 'happy');
    if (mood) {
        speechBubble.classList.add(mood);
    }
    speechBubble.classList.add('show');
}

// Function to hide speech bubble
function hideSpeechBubble() {
    speechBubble.classList.remove('show');
}

// Function to move the No button
function moveNoButton() {
    noClickCount++;

    // Make bear angry
    makeBearAngry(noClickCount);

    if (noClickCount >= 5) {
        makeButtonAngry();
        return;
    }

    const containerRect = buttonContainer.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    // Calculate available space
    const availableWidth = containerRect.width - btnRect.width - 20;
    const availableHeight = containerRect.height - btnRect.height;

    // Generate random positions within the button container
    let randomX = Math.random() * availableWidth;
    let randomY = Math.random() * Math.max(availableHeight, 60);

    // Make sure button doesn't overlap with Yes button on mobile
    const yesBtnRect = yesBtn.getBoundingClientRect();
    const yesBtnLeft = yesBtnRect.left - containerRect.left;
    const yesBtnRight = yesBtnLeft + yesBtnRect.width;

    // If button would overlap with Yes button, move it
    if (randomX + btnRect.width > yesBtnLeft - 10 && randomX < yesBtnRight + 10) {
        if (randomX < availableWidth / 2) {
            randomX = Math.max(0, yesBtnLeft - btnRect.width - 20);
        } else {
            randomX = Math.min(availableWidth, yesBtnRight + 20);
        }
    }

    // Position the button
    noBtn.style.position = 'absolute';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    noBtn.classList.add('moving');

    // Remove moving class after position is set
    setTimeout(() => {
        noBtn.classList.remove('moving');
    }, 50);

    // Change button text based on click count
    const messages = [
        'No',
        'Are you sure?',
        'Really?',
        'Think again!',
        'Last chance!'
    ];

    noBtn.textContent = messages[Math.min(noClickCount, messages.length - 1)];

    // Make Yes button bigger with each No attempt
    const yesScale = 1 + (noClickCount * 0.08);
    yesBtn.style.transform = `scale(${yesScale})`;
}

// Function to make the button angry
function makeButtonAngry() {
    noBtn.textContent = 'FINE! 😤';

    // Remove event listeners
    noBtn.removeEventListener('mouseenter', moveNoButton);

    // Shake the whole container
    container.style.animation = 'shake 0.5s';

    setTimeout(() => {
        container.style.animation = '';

        // After angry animation, make No button disappear and Yes button huge
        setTimeout(() => {
            noBtn.style.display = 'none';
            yesBtn.style.transform = 'scale(1.3)';
            yesBtn.textContent = 'YES! 😊';

            // Show final angry message
            showSpeechBubble('Just say YES! 💢', 'angry');
        }, 1500);
    }, 1500);
}

// Shake animation for container
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// Create confetti effect
function createConfetti() {
    const colors = ['#e94560', '#f9d923', '#4ecdc4', '#a8e6cf', '#ffeaa7', '#dfe6e9'];
    const confettiCount = isMobile ? 60 : 100;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = (isMobile ? 8 : 10) + 'px';
            confetti.style.height = (isMobile ? 8 : 10) + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.opacity = '1';
            confetti.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
            confetti.style.transition = 'all 3s ease-out';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';

            document.body.appendChild(confetti);

            // Animate confetti falling
            setTimeout(() => {
                confetti.style.top = window.innerHeight + 'px';
                confetti.style.opacity = '0';
                confetti.style.transform = 'rotate(' + (Math.random() * 720 + 360) + 'deg)';
            }, 10);

            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * (isMobile ? 40 : 30));
    }
}

// Close popup when clicking outside
popup.addEventListener('click', (e) => {
    if (e.target === popup) {
        popup.classList.remove('show');
    }
});

// Initialize button container for mobile
window.addEventListener('load', () => {
    // Set initial button container height for mobile
    if (isMobile) {
        buttonContainer.style.minHeight = '120px';
    }
});
