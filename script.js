// script.js

// -----------------------------------------------------------
// 1. OPENING SEQUENCE
// -----------------------------------------------------------
const bootSequence = [
    "Scanning Earth...",
    "Searching for awesome humans...",
    "Match Found...",
    "JHINGUR DETECTED ✅"
];

const terminalContainer = document.getElementById('terminal-text');
const openingFinale = document.getElementById('opening-finale');
const startBtn = document.getElementById('start-btn');
const openingSection = document.getElementById('opening-sequence');
const mainContent = document.getElementById('main-content');

let bootIndex = 0;

function typeBootSequence() {
    if (bootIndex < bootSequence.length) {
        // Clear previous
        terminalContainer.innerHTML = '';
        
        const p = document.createElement('div');
        p.className = 'opacity-0 transition-opacity duration-500';
        
        let colorClass = 'text-green-500 text-xl md:text-2xl';
        let text = '> ' + bootSequence[bootIndex];
        
        if (bootIndex === 1) colorClass = 'text-green-400 text-xl md:text-2xl';
        if (bootIndex === 2) colorClass = 'text-neon-blue text-2xl md:text-4xl font-bold uppercase tracking-widest';
        if (bootIndex === 3) {
            colorClass = 'text-neon-gold text-4xl md:text-6xl font-black uppercase tracking-widest drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]';
            text = bootSequence[bootIndex];
        }

        p.className = `${colorClass} opacity-0 transition-all duration-500 transform scale-50`;
        p.innerHTML = `${text}<span class="animate-pulse">_</span>`;
        terminalContainer.appendChild(p);

        // trigger fade in and scale up
        requestAnimationFrame(() => {
            setTimeout(() => {
                p.classList.remove('opacity-0', 'scale-50');
                p.classList.add('scale-100');
            }, 50);
        });

        bootIndex++;
        setTimeout(typeBootSequence, 2000); // 2 second between lines
    } else {
        setTimeout(() => {
            terminalContainer.classList.add('hidden');
            openingFinale.classList.remove('hidden');
            openingFinale.classList.add('flex');
            
            if (window.confetti) {
                confetti({ particleCount: 800, spread: 360, gravity: 0.15, zIndex: 60 });
            }

            // Slight fade in
            openingFinale.style.opacity = '0';
            setTimeout(() => {
                openingFinale.style.transition = 'opacity 1s';
                openingFinale.style.opacity = '1';
            }, 50);
        }, 1000);
    }
}

startBtn.addEventListener('click', () => {
    openingSection.style.opacity = '0';
    setTimeout(() => {
        openingSection.classList.add('hidden');
        mainContent.classList.remove('hidden');
        mainContent.classList.add('flex');
        
        // Setup Three.js starfield because it needs the container to be visible to get dimensions
        initThreeJS();
    }, 1000);
});

// Start boot sequence
setTimeout(typeBootSequence, 500);

// -----------------------------------------------------------
// 2. STATISTICS CENTER
// -----------------------------------------------------------
const stats = [
    { id: "kindness", label: "Kindness", value: 100, suffix: "%", icon: "heart", color: "text-pink-500", bg: "bg-pink-500", glow: "hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]" },
    { id: "loyalty", label: "Loyalty", value: 100, suffix: "%", icon: "shield", color: "text-blue-500", bg: "bg-blue-500", glow: "hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]" },
    { id: "humor", label: "Humor", value: 999, suffix: "%", icon: "zap", color: "text-yellow-400", bg: "bg-yellow-400", glow: "hover:shadow-[0_0_20px_rgba(250,204,21,0.5)]" },
    { id: "intelligence", label: "Intelligence", value: "Unlimited", suffix: "", icon: "cpu", color: "text-neon-purple", bg: "bg-neon-purple", glow: "hover:shadow-[0_0_20px_rgba(176,38,255,0.5)]" },
    { id: "chaos", label: "Chaos Level", value: "Dangerous", suffix: "", icon: "activity", color: "text-orange-500", bg: "bg-orange-500", glow: "hover:shadow-[0_0_20px_rgba(249,115,22,0.5)]" },
    { id: "power", label: "Friendship Power", value: "MAXIMUM", suffix: "", icon: "star", color: "text-neon-gold", bg: "bg-neon-gold", glow: "hover:shadow-[0_0_20px_rgba(255,215,0,0.5)]" },
];

const statsContainer = document.getElementById('stats-container');
const legendTitle = document.getElementById('legend-profile-title');
let statsRendered = false;

function renderStats() {
    if (statsRendered) return;
    statsRendered = true;
    
    legendTitle.classList.remove('opacity-0', 'scale-75');
    
    stats.forEach((stat, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = `glass-panel p-6 flex items-center relative overflow-hidden group transition-all duration-300 border-l-4 border-transparent hover:border-white ${stat.glow} opacity-0 -translate-x-10`;
        wrapper.style.transition = `all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 150}ms`;

        // Background grid pattern
        const bgGrid = document.createElement('div');
        bgGrid.className = 'absolute inset-0 opacity-10 pointer-events-none';
        bgGrid.style.backgroundImage = 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)';
        bgGrid.style.backgroundSize = '10px 10px';
        wrapper.appendChild(bgGrid);

        const iconContainer = document.createElement('div');
        iconContainer.className = `mr-6 p-4 rounded bg-bg-dark border border-white/10 ${stat.color} relative z-10 group-hover:scale-110 transition-transform`;
        // Brain replacement for hexagon, sword replacement for sun (since feather doesn't have brain/sword exactly, we use alternatives or close matches)
        // Wait, actually feather icons has 'shield', 'heart', 'zap'. Let's use 'cpu' for Intelligence, 'wind' for chaos, 'star' for power.
        const featherIcon = stat.icon;
        iconContainer.innerHTML = `<i data-feather="${featherIcon}" class="w-10 h-10 drop-shadow-[0_0_10px_currentColor]"></i>`;
        wrapper.appendChild(iconContainer);

        const textContainer = document.createElement('div');
        textContainer.className = 'flex-1 relative z-10';
        textContainer.innerHTML = `
            <h3 class="text-gray-400 tracking-widest uppercase text-xs mb-1">${stat.label}</h3>
            <div class="text-2xl md:text-3xl font-black uppercase ${stat.color} tracking-wider">
                <span class="animated-number" data-val="${stat.value}">${typeof stat.value === 'string' ? stat.value : '0'}</span>${stat.suffix}
            </div>
        `;
        wrapper.appendChild(textContainer);

        if (typeof stat.value === 'number') {
            const barContainer = document.createElement('div');
            barContainer.className = 'absolute bottom-0 left-0 w-full h-1 bg-gray-800';
            const barFill = document.createElement('div');
            barFill.className = `h-full ${stat.bg} shadow-[0_0_10px_currentColor] transition-all duration-[2500ms] ease-out w-0`;
            barFill.style.transitionDelay = '500ms';
            barContainer.appendChild(barFill);
            wrapper.appendChild(barContainer);

            // Animate number logic
            setTimeout(() => {
                barFill.style.width = '100%';
                let startTimestamp = null;
                const duration = 2500;
                const finalValue = stat.value;
                const span = textContainer.querySelector('.animated-number');
                const step = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    span.innerText = Math.floor(progress * finalValue);
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    } else {
                        span.innerText = finalValue;
                    }
                };
                window.requestAnimationFrame(step);
            }, 500);
        }

        statsContainer.appendChild(wrapper);

        // Trigger animations next frame
        requestAnimationFrame(() => {
            setTimeout(() => {
                wrapper.classList.remove('opacity-0', '-translate-x-10');
            }, 50);
        });
    });
    
    // Replace icons for the newly added stats
    feather.replace();
}

// -----------------------------------------------------------
// 3. AWESOME QUALITIES
// -----------------------------------------------------------
const qualities = [
    { text: "Always there when needed", color: "text-blue-400", shadow: "shadow-[0_0_30px_rgba(96,165,250,0.5)]" },
    { text: "Always try to make people happy", color: "text-pink-400", shadow: "shadow-[0_0_30px_rgba(244,114,182,0.5)]" },
    { text: "Always Responsible", color: "text-yellow-400", shadow: "shadow-[0_0_30px_rgba(250,204,21,0.5)]" },
    { text: "Creates unforgettable moments", color: "text-purple-400", shadow: "shadow-[0_0_30px_rgba(192,132,252,0.5)]" },
    { text: "One of a kind", color: "text-green-400", shadow: "shadow-[0_0_30px_rgba(74,222,128,0.5)]" },
];

const sparklesSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`;

const qualitiesContainer = document.getElementById('qualities-container');

qualities.forEach((q, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] min-h-[300px] opacity-0 translate-y-10 transition-all duration-1000';
    wrapper.style.transitionDelay = `${i * 100}ms`;

    const floater = document.createElement('div');
    floater.className = 'h-full flex items-center justify-center';
    floater.style.perspective = '1000px';

    const card = document.createElement('div');
    card.className = `glass-panel p-8 md:p-12 rounded-3xl relative group cursor-pointer transition-colors w-full h-full flex flex-col items-center justify-center border-2 border-white/10 hover:border-white/30 ${q.shadow}`;
    card.style.transformStyle = 'preserve-3d';
    card.style.transition = 'transform 0.1s ease-out';
    
    // Quick CSS keyframe inject for floating
    if (!document.getElementById('floatKeyframes')) {
        const style = document.createElement('style');
        style.id = 'floatKeyframes';
        style.innerHTML = `@keyframes floatUpAndDown { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }`;
        document.head.appendChild(style);
    }
    
    // Float applied to outer floater so rotateX/Y doesn't overwrite it
    floater.style.animation = `floatUpAndDown ${3 + (i % 2)}s ease-in-out infinite`;

    card.innerHTML = `
        <div style="transform: translateZ(50px)" class="flex flex-col items-center text-center pointer-events-none transition-transform duration-200">
            <div class="${q.color} mb-6">
                ${sparklesSVG}
            </div>
            <h3 class="text-2xl md:text-3xl font-black text-white uppercase tracking-widest leading-relaxed">
                ${q.text}
            </h3>
        </div>
    `;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = (mouseX / rect.width) - 0.5;
        const yPct = (mouseY / rect.height) - 0.5;
        card.style.transform = `rotateX(${yPct * -30}deg) rotateY(${xPct * 30}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `rotateX(0deg) rotateY(0deg)`;
        card.style.transition = 'transform 0.5s ease-out';
        setTimeout(() => card.style.transition = 'transform 0.1s ease-out', 500);
    });

    floater.appendChild(card);
    wrapper.appendChild(floater);
    qualitiesContainer.appendChild(wrapper);
});

// -----------------------------------------------------------
// 4. SECRET VAULT
// -----------------------------------------------------------
const vaultMessages = [
    "You are appreciated.",
    "You matter more than you know.",
    "You make life more fun.",
    "The world is better with you in it.",
    "Even when you're annoying, you're my favorite.",
    "Legendary status isn't given, it's earned. You've earned it."
];

const vaultForm = document.getElementById('vault-form');
const vaultInput = document.getElementById('vault-input');
const vaultError = document.getElementById('vault-error');
const vaultDoor = document.getElementById('vault-door');
const vaultOpened = document.getElementById('vault-opened');
const vaultGlow = document.getElementById('vault-glow');
const vaultMessagesContainer = document.getElementById('vault-messages');

vaultForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (vaultInput.value.trim().toLowerCase() === 'jhingur') {
        vaultError.classList.add('hidden');
        
        // Hide Door
        vaultDoor.style.transform = 'scale(1.5)';
        vaultDoor.style.filter = 'blur(20px)';
        vaultDoor.style.opacity = '0';
        
        vaultGlow.classList.replace('bg-neon-blue/10', 'bg-neon-gold/30');

        setTimeout(() => {
            vaultDoor.classList.add('hidden');
            vaultOpened.classList.remove('hidden');
            
            // Render messages
            vaultMessages.forEach((msg, i) => {
                const div = document.createElement('div');
                div.className = 'glass-panel p-8 group hover:-translate-y-2 transition-transform duration-300 border border-white/5 hover:border-neon-gold/50 relative overflow-hidden opacity-0 translate-y-10';
                div.style.transition = `all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${1000 + i * 100}ms`;
                div.innerHTML = `
                    <div class="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <i data-feather="message-square" class="w-24 h-24"></i>
                    </div>
                    <div class="h-full flex items-center justify-center min-h-[150px]">
                        <p class="text-xl font-bold text-white text-center leading-relaxed z-10 relative">"${msg}"</p>
                    </div>
                `;
                vaultMessagesContainer.appendChild(div);
                feather.replace(); // Refresh icons
                
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        div.classList.remove('opacity-0', 'translate-y-10');
                    }, 50);
                });
            });

            setTimeout(() => {
                vaultOpened.classList.remove('opacity-0');
            }, 500);

        }, 1000);

    } else {
        vaultError.classList.remove('hidden');
        vaultInput.value = '';
        vaultInput.classList.add('border-red-500');
    }
});

// -----------------------------------------------------------
// 5. BIRTHDAY LETTER & SCROLL OBSERVERS
// -----------------------------------------------------------
const letterContent = `
Dear Jhingur,

It's crazy to think how far we've come. I still remember when we first met, and honestly, I never imagined you'd become such an important part of my life.

Over time, you became more than just a friend—you became someone I could truly trust. In a world where people change so easily, you've always been genuine. You've never been fake, never given me a reason to doubt our friendship, and that's something I value more than words can express.

Thank you for always being there whenever I needed you. Whether I was having a good day or going through a tough time, you always showed up. Sometimes with advice, sometimes with jokes, and sometimes just by listening—but somehow, you always made things better.

What I admire most about you is your loyalty and support. You've celebrated my successes, stood by me during my failures, and reminded me that I never have to face things alone. Knowing I can count on you is something I'll always be grateful for.

We've shared so many laughs, random conversations, and unforgettable memories. Life genuinely wouldn't be the same without your humor, your chaos, and your presence.

I hope this year brings you all the happiness, success, and opportunities you deserve. No matter where life takes us, I'll always be thankful for our friendship and for having someone as real as you in my life.

Happy Birthday, Jhingur. ❤️

Stay exactly the way you are.

Always rooting for you,
Your friend
Butki`;

const letterContainer = document.getElementById('letter-container');
const typewriterOutput = document.getElementById('typewriter-output');
const cursor = document.getElementById('typewriter-cursor');
const letterEnd = document.getElementById('letter-end');
const postLetterContent = document.getElementById('post-letter-content');

let letterTypingStarted = false;

function startLetterTyping() {
    if (letterTypingStarted) return;
    letterTypingStarted = true;
    
    letterContainer.classList.remove('opacity-0', 'translate-y-10');
    cursor.classList.remove('hidden');

    let i = 0;
    const textNode = document.createTextNode('');
    typewriterOutput.insertBefore(textNode, cursor);

    const interval = setInterval(() => {
        textNode.textContent = letterContent.slice(0, i);
        i++;
        if (i > letterContent.length) {
            clearInterval(interval);
            letterEnd.classList.remove('hidden');
            setTimeout(() => letterEnd.classList.remove('opacity-0'), 50);
            
            // Unlock rest of page
            postLetterContent.classList.remove('hidden');
            postLetterContent.classList.add('flex');
            
            // Need to set up observers for the new content
            setupPostLetterObservers();
        }
    }, 20);
}

// Global Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.id === 'statistics-center') renderStats();
            if (entry.target.id === 'awesome-qualities') {
                Array.from(qualitiesContainer.children).forEach(el => el.classList.remove('opacity-0', 'translate-y-10'));
            }
            if (entry.target.id === 'birthday-letter') startLetterTyping();
            if (entry.target.id === 'forbidden-button') triggerForbiddenEnter();
            if (entry.target.id === 'grand-finale') triggerGrandFinale();
        }
    });
}, { threshold: 0.2 });

observer.observe(document.getElementById('statistics-center'));
observer.observe(document.getElementById('awesome-qualities'));
observer.observe(document.getElementById('birthday-letter'));

function setupPostLetterObservers() {
    observer.observe(document.getElementById('forbidden-button'));
    observer.observe(document.getElementById('grand-finale'));
}

// -----------------------------------------------------------
// 6. FORBIDDEN BUTTON
// -----------------------------------------------------------
const forbiddenInitialState = document.getElementById('forbidden-initial-state');
const forbiddenPressedState = document.getElementById('forbidden-pressed-state');
const forbiddenWrapper = document.getElementById('forbidden-wrapper');
const theButton = document.getElementById('the-button');

function triggerForbiddenEnter() {
    forbiddenInitialState.classList.remove('opacity-0', 'scale-50');
    forbiddenInitialState.classList.add('scale-100');
}

theButton.addEventListener('click', () => {
    // Screen shake simulation for framer motion x/y animate
    forbiddenWrapper.style.animation = 'shakeXY 0.5s cubic-bezier(.36,.07,.19,.97) both';
    if (!document.getElementById('shakeXY-style')) {
        const style = document.createElement('style');
        style.id = 'shakeXY-style';
        style.innerHTML = `
            @keyframes shakeXY {
                0% { transform: translate(0, 0); }
                16% { transform: translate(-30px, 30px); }
                33% { transform: translate(30px, -30px); }
                50% { transform: translate(-30px, 30px); }
                66% { transform: translate(30px, -30px); }
                100% { transform: translate(0, 0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Hide initial state and show pressed state
    forbiddenInitialState.classList.add('opacity-0', 'scale-0');
    forbiddenInitialState.classList.remove('scale-100');
    
    setTimeout(() => {
        forbiddenInitialState.classList.add('hidden');
        forbiddenPressedState.classList.remove('hidden');
        // Trigger reflow
        void forbiddenPressedState.offsetWidth;
        forbiddenPressedState.classList.remove('opacity-0', 'scale-50');
        forbiddenPressedState.classList.add('scale-100');
    }, 500);

    // Confetti
    if (window.confetti) {
        confetti({ particleCount: 1000, gravity: 0.3, spread: 360, startVelocity: 20 });
    }
});

// -----------------------------------------------------------
// 7. GRAND FINALE
// -----------------------------------------------------------
const finaleTextContainer = document.getElementById('finale-text-container');
const lanternsContainer = document.getElementById('lanterns-container');
let finaleTriggered = false;

function triggerGrandFinale() {
    if (finaleTriggered) return;
    finaleTriggered = true;

    // Sequence timing
    setTimeout(() => showFinaleText("Out of 8 billion people..."), 0);
    setTimeout(() => showFinaleText("One became Jhingur."), 3000);
    setTimeout(() => showFinaleText("And that's pretty awesome."), 6000);
    setTimeout(() => {
        finaleTextContainer.innerHTML = '';
        finaleTextContainer.innerHTML = `
            <div class="flex items-center justify-center gap-4 mb-8">
                <i data-feather="heart" fill="#ff00ea" class="text-neon-pink w-16 h-16 drop-shadow-[0_0_30px_rgba(255,0,234,0.8)] animate-pulse"></i>
                <h1 class="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-gold via-white to-neon-pink drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] uppercase text-center leading-tight scale-50 opacity-0 transition-all duration-1000" id="finale-hbd">
                    HAPPY BIRTHDAY<br/>JHINGUR
                </h1>
                <i data-feather="heart" fill="#ff00ea" class="text-neon-pink w-16 h-16 drop-shadow-[0_0_30px_rgba(255,0,234,0.8)] animate-pulse"></i>
            </div>
            <div id="stay-legendary" class="mt-16 text-3xl md:text-5xl text-white font-black tracking-[0.3em] uppercase bg-black/50 px-10 py-6 border border-white/20 rounded-xl shadow-[0_0_50px_rgba(255,255,255,0.1)] backdrop-blur-md opacity-0 translate-y-10 transition-all duration-1000 hidden">
                "Stay legendary, Jhingur."
            </div>
        `;
        feather.replace();
        
        requestAnimationFrame(() => {
            document.getElementById('finale-hbd').classList.remove('scale-50', 'opacity-0');
            // Confetti
            if (window.confetti) {
                confetti({ particleCount: 1000, spread: 360, gravity: 0.1, origin: {y: -0.2} });
            }
            lanternsContainer.classList.remove('hidden');
            renderLanterns();
        });

    }, 10000);
    setTimeout(() => {
        const sl = document.getElementById('stay-legendary');
        sl.classList.remove('hidden');
        requestAnimationFrame(() => sl.classList.remove('opacity-0', 'translate-y-10'));
    }, 15000);
}

function showFinaleText(text) {
    finaleTextContainer.innerHTML = `<div class="text-4xl md:text-6xl font-bold text-gray-300 uppercase tracking-widest opacity-0 translate-y-10 transition-all duration-1000" id="ft">${text}</div>`;
    requestAnimationFrame(() => {
        document.getElementById('ft').classList.remove('opacity-0', 'translate-y-10');
    });
}

function renderLanterns() {
    for (let i=0; i<30; i++) {
        const l = document.createElement('div');
        l.className = 'absolute w-8 h-12 bg-orange-500/80 rounded-t-xl rounded-b-md blur-[2px] shadow-[0_0_20px_#ff8c00] lantern';
        l.style.left = `${Math.random() * 100}vw`;
        l.style.animationDuration = `${10 + Math.random() * 10}s`;
        l.style.animationDelay = `${Math.random() * 5}s`;
        lanternsContainer.appendChild(l);
    }
}

// -----------------------------------------------------------
// 8. RAW THREE.JS STARFIELD
// -----------------------------------------------------------
function initThreeJS() {
    const container = document.getElementById('three-canvas-container');
    if (!window.THREE || !container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Create stars
    const starsGeometry = new THREE.BufferGeometry();
    const count = 3000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 5;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.005,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    camera.position.z = 1;

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        
        starField.rotation.y += 0.0005;
        starField.rotation.x -= 0.0005;
        
        renderer.render(scene, camera);
    }

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// -----------------------------------------------------------
// 9. EASTER EGGS
// -----------------------------------------------------------
const secretCode = ['l', 'e', 'g', 'e', 'n', 'd'];
let keys = [];

window.addEventListener('keydown', (e) => {
    keys.push(e.key.toLowerCase());
    if (keys.length > secretCode.length) {
        keys.shift();
    }
    
    if (keys.join('') === secretCode.join('')) {
        alert("🎉 YOU FOUND THE LEGENDARY EASTER EGG! 🎉\n(Jhingur's secret coolness level just increased)");
        if (window.confetti) confetti({ particleCount: 500, spread: 180 });
        keys = [];
    }
});
