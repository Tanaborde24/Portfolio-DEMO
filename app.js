// ============================================
// Main Application Logic — app.js
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ============ ELEMENT REFERENCES ============
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navLinks');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');

    // Admin / Auth / Navbar Auth Elements
    const loginModal = document.getElementById('loginModal');
    const loginModalClose = document.getElementById('loginModalClose');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const adminControls = document.getElementById('adminControls');

    const navLoginBtn = document.getElementById('navLoginBtn');
    const navUserArea = document.getElementById('navUserArea');
    const navUserBtn = document.getElementById('navUserBtn');
    const navDropdown = document.getElementById('navDropdown');
    const navAvatar = document.getElementById('navAvatar');
    const navUserEmail = document.getElementById('navUserEmail');
    const dropdownAvatar = document.getElementById('dropdownAvatar');
    const dropdownEmail = document.getElementById('dropdownEmail');
    const navLogoutBtn = document.getElementById('navLogoutBtn');

    // Project Modal
    const addProjectBtn = document.getElementById('addProjectBtn');
    const projectModal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const projectForm = document.getElementById('projectForm');
    const projectImage = document.getElementById('projectImage');
    const fileLabel = document.getElementById('fileLabel');
    const imagePreview = document.getElementById('imagePreview');
    const submitBtn = document.getElementById('submitBtn');

    // Project Grid
    const projectsGrid = document.getElementById('projectsGrid');
    const staticProjects = document.getElementById('staticProjects');
    const loadingProjects = document.getElementById('loadingProjects');


    // ============ 1. DARK / LIGHT THEME TOGGLE ============
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
        localStorage.setItem('portfolio-theme', theme);
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    setTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
    });


    // ============ 2. NAVBAR SCROLL BEHAVIOR ============
    window.addEventListener('scroll', () => {
        // Add shadow on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link tracking
        const sections = document.querySelectorAll('section, .hero-section');
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });


    // ============ 3. HAMBURGER MENU (MOBILE) ============
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });


    // ============ 4. SMOOTH SCROLL ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


    // ============ 5. SCROLL ANIMATIONS ============
    // Animate skill progress bars on scroll
    const progressBars = document.querySelectorAll('.progress-fill');
    let skillsAnimated = false;

    function animateSkills() {
        const skillsSection = document.getElementById('skills');
        if (!skillsSection) return;
        const rect = skillsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75 && !skillsAnimated) {
            skillsAnimated = true;
            progressBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
            });
        }
    }

    // Animate elements on scroll (IntersectionObserver)
    function setupScrollAnimations() {
        const animTargets = document.querySelectorAll(
            '.skill-card, .soft-skill-card, .language-card, .timeline-item, .project-card, .contact-card'
        );

        animTargets.forEach(el => el.classList.add('animate-on-scroll'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        animTargets.forEach(el => observer.observe(el));
    }

    window.addEventListener('scroll', animateSkills);
    animateSkills(); // Check initial state
    setupScrollAnimations();


    // ============ 6. MODAL UTILITIES ============
    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Close modals on overlay click
    [projectModal, loginModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal(modal);
            });
        }
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (projectModal) closeModal(projectModal);
            if (loginModal) closeModal(loginModal);
        }
    });

    if (modalClose) modalClose.addEventListener('click', () => closeModal(projectModal));
    if (loginModalClose) loginModalClose.addEventListener('click', () => closeModal(loginModal));


    // ============ 7. FIREBASE: AUTH & DATABASE ============

    // --- Login button in Navbar opens login modal ---
    if (navLoginBtn) {
        navLoginBtn.addEventListener('click', () => {
            if (!isFirebaseConfigured) {
                console.log('Firebase not configured. Opening login modal in local demo mode.');
                const noticeId = 'demoLoginNotice';
                let notice = document.getElementById(noticeId);
                if (!notice) {
                    notice = document.createElement('div');
                    notice.id = noticeId;
                    notice.style.background = 'rgba(108, 99, 255, 0.1)';
                    notice.style.border = '1px solid var(--accent)';
                    notice.style.color = 'var(--accent)';
                    notice.style.padding = '10px 14px';
                    notice.style.borderRadius = 'var(--radius-sm)';
                    notice.style.fontSize = '0.85rem';
                    notice.style.marginBottom = '16px';
                    notice.style.textAlign = 'center';
                    notice.innerHTML = '⚙️ <strong>โหมดทดสอบ (Local Demo)</strong><br>Email: <code>admin@example.com</code><br>Password: <code>admin</code>';
                    if (loginForm) loginForm.insertBefore(notice, loginForm.firstChild);
                }
            }
            openModal(loginModal);
        });
    }

    let auth, db, storage;

    if (isFirebaseConfigured) {
        auth = firebase.auth();
        db = firebase.firestore();
        storage = firebase.storage();
    } else {
        console.log("⚠️ Firebase not configured. Initializing Local Mock Services.");
        auth = {
            currentUser: localStorage.getItem('mock-auth-logged-in') === 'true' ? { email: 'admin@example.com' } : null,
            onAuthStateChanged: (callback) => {
                const loggedIn = localStorage.getItem('mock-auth-logged-in') === 'true';
                const mockUser = loggedIn ? { email: 'admin@example.com' } : null;
                callback(mockUser);
                window.triggerMockAuthStateChanged = (user) => {
                    auth.currentUser = user;
                    callback(user);
                };
            },
            signInWithEmailAndPassword: async (email, password) => {
                if (email === 'admin@example.com' && password === 'admin') {
                    localStorage.setItem('mock-auth-logged-in', 'true');
                    if (window.triggerMockAuthStateChanged) {
                        window.triggerMockAuthStateChanged({ email: 'admin@example.com' });
                    }
                    return { user: { email: 'admin@example.com' } };
                } else {
                    const err = new Error('Invalid email or password');
                    err.code = 'auth/invalid-credential';
                    throw err;
                }
            },
            signOut: async () => {
                localStorage.removeItem('mock-auth-logged-in');
                if (window.triggerMockAuthStateChanged) {
                    window.triggerMockAuthStateChanged(null);
                }
            }
        };

        db = {
            collection: (colName) => {
                return {
                    orderBy: () => {
                        return {
                            onSnapshot: (callback) => {
                                const loadFromLocal = () => {
                                    const data = JSON.parse(localStorage.getItem('mock-projects') || '[]');
                                    const docs = data.map((item, index) => ({
                                        id: item.id || `local_${index}`,
                                        data: () => ({
                                            name: item.name,
                                            description: item.description,
                                            imageUrl: item.imageUrl,
                                            createdAt: item.createdAt
                                        })
                                    }));
                                    callback({
                                        empty: docs.length === 0,
                                        forEach: (docCallback) => docs.forEach(docCallback)
                                    });
                                };

                                loadFromLocal();
                                window.addEventListener('mock-db-updated', loadFromLocal);
                                return () => {
                                    window.removeEventListener('mock-db-updated', loadFromLocal);
                                };
                            }
                        };
                    },
                    add: async (docData) => {
                        const data = JSON.parse(localStorage.getItem('mock-projects') || '[]');
                        docData.id = `local_${Date.now()}`;
                        data.unshift(docData);
                        localStorage.setItem('mock-projects', JSON.stringify(data));
                        window.dispatchEvent(new Event('mock-db-updated'));
                        return docData;
                    },
                    doc: (id) => {
                        return {
                            delete: async () => {
                                const data = JSON.parse(localStorage.getItem('mock-projects') || '[]');
                                const filtered = data.filter(item => item.id !== id);
                                localStorage.setItem('mock-projects', JSON.stringify(filtered));
                                window.dispatchEvent(new Event('mock-db-updated'));
                            }
                        };
                    }
                };
            }
        };

        storage = {
            ref: () => {
                return {
                    put: async (file) => {
                        return {
                            ref: {
                                getDownloadURL: async () => {
                                    return new Promise((resolve) => {
                                        const reader = new FileReader();
                                        reader.onload = (e) => resolve(e.target.result);
                                        reader.readAsDataURL(file);
                                    });
                                }
                            }
                        };
                    }
                };
            },
            refFromURL: () => {
                return {
                    delete: async () => { }
                };
            }
        };
    }

    // --- Dropdown Toggle ---
    if (navUserBtn && navDropdown) {
        navUserBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            navDropdown.classList.remove('active');
        });

        // Prevent dropdown closure when clicking inside it
        navDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // --- Auth State Listener ---
    auth.onAuthStateChanged(user => {
        if (user) {
            console.log('✅ Logged in as:', user.email);

            // Show user area, hide login button
            if (navLoginBtn) navLoginBtn.style.display = 'none';
            if (navUserArea) navUserArea.style.display = 'flex';

            // Set user email and avatar text
            const emailParts = user.email.split('@');
            const displayName = emailParts[0];
            const initial = displayName.charAt(0).toUpperCase();

            if (navUserEmail) navUserEmail.textContent = displayName;
            if (navAvatar) navAvatar.textContent = initial;
            if (dropdownAvatar) dropdownAvatar.textContent = initial;
            if (dropdownEmail) dropdownEmail.textContent = user.email;

            // Show admin controls
            if (adminControls) adminControls.style.display = 'flex';
        } else {
            console.log('🔒 Not logged in');

            // Show login button, hide user area
            if (navLoginBtn) navLoginBtn.style.display = 'flex';
            if (navUserArea) navUserArea.style.display = 'none';

            // Hide admin controls
            if (adminControls) adminControls.style.display = 'none';

            // Ensure dropdown is closed
            if (navDropdown) navDropdown.classList.remove('active');
        }
    });

    // --- Login Form ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (loginError) loginError.style.display = 'none';
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                await auth.signInWithEmailAndPassword(email, password);
                closeModal(loginModal);
                loginForm.reset();
            } catch (error) {
                if (loginError) {
                    loginError.textContent = getAuthErrorMessage(error.code);
                    loginError.style.display = 'block';
                }
            }
        });
    }

    // --- Logout ---
    if (navLogoutBtn) {
        navLogoutBtn.addEventListener('click', async () => {
            await auth.signOut();
        });
    }

    // --- Add Project Button ---
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', () => {
            openModal(projectModal);
        });
    }

    // --- Image Preview ---
    if (projectImage) {
        projectImage.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (fileLabel) fileLabel.innerHTML = `<span>📁</span> ${file.name}`;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    if (imagePreview) {
                        imagePreview.src = ev.target.result;
                        imagePreview.style.display = 'block';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // --- Submit New Project ---
    if (projectForm) {
        projectForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('projectName').value.trim();
            const desc = document.getElementById('projectDesc').value.trim();
            const file = projectImage.files[0];

            if (!name || !desc || !file) {
                alert('กรุณากรอกข้อมูลให้ครบถ้วน');
                return;
            }

            // Show loading state
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            if (btnText) btnText.style.display = 'none';
            if (btnLoading) btnLoading.style.display = 'inline';
            submitBtn.disabled = true;

            try {
                // 1. Upload image to Storage
                const timestamp = Date.now();
                const storageRef = storage.ref(`projects/${timestamp}_${file.name}`);
                const uploadTask = await storageRef.put(file);
                const imageUrl = await uploadTask.ref.getDownloadURL();

                // 2. Save project data to Firestore
                const projectData = {
                    name: name,
                    description: desc,
                    imageUrl: imageUrl
                };
                if (isFirebaseConfigured) {
                    projectData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                } else {
                    projectData.createdAt = new Date().toISOString();
                }
                await db.collection('projects').add(projectData);

                // 3. Reset form & close modal
                projectForm.reset();
                if (imagePreview) imagePreview.style.display = 'none';
                if (fileLabel) fileLabel.innerHTML = '<span>📁</span> เลือกรูปภาพ';
                closeModal(projectModal);
                alert('✅ เพิ่มผลงานสำเร็จ!');

            } catch (error) {
                console.error('Error adding project:', error);
                alert('❌ เกิดข้อผิดพลาด: ' + error.message);
            } finally {
                if (btnText) btnText.style.display = 'inline';
                if (btnLoading) btnLoading.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
    }

    // --- Load Projects from Firestore (Real-time) ---
    function loadProjects() {
        db.collection('projects')
            .orderBy('createdAt', 'desc')
            .onSnapshot((snapshot) => {
                // Hide loading
                if (loadingProjects) loadingProjects.style.display = 'none';

                // Remove old Firebase project cards (keep loading div)
                if (projectsGrid) {
                    const existingCards = projectsGrid.querySelectorAll('.project-card');
                    existingCards.forEach(card => card.remove());
                }

                if (snapshot.empty) {
                    if (staticProjects) staticProjects.style.display = 'grid';
                    return;
                }

                if (staticProjects) staticProjects.style.display = 'none';

                snapshot.forEach(doc => {
                    const data = doc.data();
                    const card = createProjectCard(doc.id, data);
                    if (projectsGrid) projectsGrid.appendChild(card);
                });

                // Re-apply scroll animations to new cards
                setupScrollAnimations();
            }, (error) => {
                console.error('Error loading projects:', error);
                if (loadingProjects) loadingProjects.style.display = 'none';
                if (staticProjects) staticProjects.style.display = 'grid';
            });
    }

    // --- Create Project Card Element ---
    function createProjectCard(id, data) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <div class="project-image">
                <img src="${data.imageUrl}" alt="${escapeHtml(data.name)}" loading="lazy">
                <div class="project-overlay">
                    <span class="overlay-icon">🔍</span>
                </div>
            </div>
            <div class="project-info">
                <h3>${escapeHtml(data.name)}</h3>
                <p>${escapeHtml(data.description)}</p>
            </div>
        `;

        // Add delete button if admin is logged in
        if (auth.currentUser) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'project-delete-btn';
            deleteBtn.innerHTML = '🗑️';
            deleteBtn.title = 'ลบผลงานนี้';
            deleteBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (confirm('⚠️ คุณต้องการลบผลงานนี้หรือไม่?')) {
                    try {
                        // Delete image from Storage
                        if (data.imageUrl && isFirebaseConfigured) {
                            try {
                                const imageRef = storage.refFromURL(data.imageUrl);
                                await imageRef.delete();
                            } catch (storageErr) {
                                console.warn('Could not delete image:', storageErr);
                            }
                        }
                        // Delete document from Firestore
                        await db.collection('projects').doc(id).delete();
                    } catch (error) {
                        alert('❌ ลบไม่สำเร็จ: ' + error.message);
                    }
                }
            });
            card.appendChild(deleteBtn);
        }

        return card;
    }

    // Start loading projects
    loadProjects();


    // ============ 8. UTILITY FUNCTIONS ============

    // Escape HTML for XSS prevention
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Firebase Auth error messages (Thai)
    function getAuthErrorMessage(code) {
        const messages = {
            'auth/user-not-found': '❌ ไม่พบบัญชีผู้ใช้นี้',
            'auth/wrong-password': '❌ รหัสผ่านไม่ถูกต้อง',
            'auth/invalid-email': '❌ รูปแบบอีเมลไม่ถูกต้อง',
            'auth/too-many-requests': '⏳ มีการพยายามเข้าสู่ระบบมากเกินไป กรุณารอสักครู่',
            'auth/invalid-credential': '❌ อีเมลหรือรหัสผ่านไม่ถูกต้อง',
        };
        return messages[code] || '❌ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
    }


    // ============ 9. HERO PHOTO FALLBACK ============
    const heroPhoto = document.getElementById('heroPhoto');
    if (heroPhoto) {
        heroPhoto.addEventListener('error', () => {
            // Generate a placeholder avatar using initials
            heroPhoto.style.display = 'none';
            const ring = heroPhoto.closest('.hero-photo-ring');
            if (ring) {
                ring.style.display = 'flex';
                ring.style.alignItems = 'center';
                ring.style.justifyContent = 'center';
                ring.style.fontSize = '3rem';
                ring.style.fontWeight = '800';
                ring.style.color = '#fff';
                ring.innerHTML = '<span style="background:linear-gradient(135deg,#6C63FF,#B06CFF);width:100%;height:100%;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:3.5rem;">T</span>';
            }
        });
    }

});
