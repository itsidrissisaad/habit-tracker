import { supabase } from './supabaseClient.js';
async function loadHabitsFromSupabase() {
  try {
    const { data, error } = await supabase.from('habits').select('*');
    if (error) throw error;
    
    console.log('Successfully fetched habits from Supabase:', data);
    // TODO: Pass this data into your local rendering functions so they appear on screen!
  } catch (err) {
    console.error('Error fetching habits:', err.message);
  }
}

/**
 * Habit Tracker - Core Application Engine
 * Pure Vanilla JavaScript / Modern Browser Standard
 */

// Library of Professional Vector SVG Icons (No Emojis)
const SVG_ICONS = {
    'target': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,
    'activity': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,
    'book': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
    'briefcase': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
    'dumbbell': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"></path><path d="m21 21-1-1"></path><path d="m3 3 1 1"></path><path d="m18 22 4-4"></path><path d="m2 6 4-4"></path><path d="m3 10 7-7"></path><path d="m14 21 7-7"></path></svg>`,
    'feather': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line></svg>`,
    'wallet': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path></svg>`,
    'coffee': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`,
    'code': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
    'sparkles': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>`,
    'sun': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
    'droplet': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>`
};

// Default Starter Categories
const DEFAULT_CATEGORIES = [
    { id: 'cat_health', name: 'Health & Fitness', icon: 'activity', color: '#059669' },
    { id: 'cat_productivity', name: 'Productivity', icon: 'briefcase', color: '#4f46e5' },
    { id: 'cat_learning', name: 'Learning', icon: 'book', color: '#0284c7' },
    { id: 'cat_wellness', name: 'Mindfulness', icon: 'feather', color: '#7c3aed' },
    { id: 'cat_finance', name: 'Finance', icon: 'wallet', color: '#d97706' }
];

// Motivational Quotes
const MOTIVATIONAL_QUOTES = [
    '"We are what we repeatedly do. Excellence, then, is not an act, but a habit."',
    '"Small disciplines repeated with consistency every day lead to great achievements."',
    '"Success is the sum of small efforts repeated day in and day out."',
    '"Motivation gets you going, but discipline keeps you growing."',
    '"Focus on the process, and the results will naturally follow."'
];

// Starter Inspirations Ideas
const STARTER_INSPIRATIONS = [
    { name: 'Hydration 2L', category: 'Health & Fitness', desc: 'Drink 2+ litres of fresh water daily', icon: 'droplet', color: '#0284c7', freq: 'daily' },
    { name: 'Read 20 Mins', category: 'Learning', desc: 'Read tech articles or books', icon: 'book', color: '#4f46e5', freq: 'daily' },
    { name: 'Morning Workout', category: 'Health & Fitness', desc: 'Zone 2 cardio or strength session', icon: 'dumbbell', color: '#059669', freq: 'daily' },
    { name: 'Mindful Breathing', category: 'Mindfulness', desc: '10 min mindfulness or meditation', icon: 'feather', color: '#7c3aed', freq: 'daily' }
];

class HabitTrackerApp {
    constructor() {
        this.habits = [];
        this.categories = [];
        this.currentUser = null;
        this.selectedCategory = 'all';
        this.selectedFrequency = 'all';
        this.selectedStatus = 'all';
        this.searchQuery = '';
        this.sortOrder = 'streak';

        this.canvas = document.getElementById('confettiCanvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.confettiParticles = [];
        this.animationId = null;

        this.init();
    }

    init() {
        this.loadUser();
        this.loadCategories();
        this.loadHabits();
        this.setupIconPicker();
        this.setupStarterInspirations();
        this.setupEventListeners();
        this.setupConfetti();
        this.updateUserGreeting();
        this.render();

        loadHabitsFromSupabase();
    }

    /* --------------------------------------------------------------------------
       AUTHENTICATION & USER SESSION
       -------------------------------------------------------------------------- */
    loadUser() {
        const rawUser = localStorage.getItem('habit_tracker_user');
        if (rawUser) {
            try {
                this.currentUser = JSON.parse(rawUser);
            } catch (e) {
                this.currentUser = { name: 'Alex Rivera', email: 'alex@example.com', avatarColor: '#4f46e5', isGuest: false };
            }
        } else {
            this.currentUser = { name: 'Guest User', email: 'guest@habittracker.app', avatarColor: '#4f46e5', isGuest: true };
            this.saveUser();
        }
        this.updateUserUI();
    }

    saveUser() {
        localStorage.setItem('habit_tracker_user', JSON.stringify(this.currentUser));
    }

    updateUserUI() {
        if (!this.currentUser) return;
        const nameLabel = document.getElementById('userNameLabel');
        const avatarCircle = document.getElementById('userAvatarCircle');
        const dropdownName = document.getElementById('dropdownUserName');
        const dropdownEmail = document.getElementById('dropdownUserEmail');
        const authText = document.getElementById('dropdownAuthText');

        const initials = this.currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

        if (nameLabel) nameLabel.textContent = this.currentUser.name;
        if (avatarCircle) {
            avatarCircle.textContent = initials;
            avatarCircle.style.backgroundColor = this.currentUser.avatarColor || '#4f46e5';
        }
        if (dropdownName) dropdownName.textContent = this.currentUser.name;
        if (dropdownEmail) dropdownEmail.textContent = this.currentUser.email;
        if (authText) authText.textContent = this.currentUser.isGuest ? 'Sign In / Sign Up' : 'Switch Account / Log Out';
    }

    updateUserGreeting() {
        const hour = new Date().getHours();
        let greeting = "Good morning";
        if (hour >= 12 && hour < 17) greeting = "Good afternoon";
        else if (hour >= 17) greeting = "Good evening";

        const greetingEl = document.getElementById('greetingTime');
        if (greetingEl) {
            const firstName = this.currentUser ? this.currentUser.name.split(' ')[0] : 'there';
            greetingEl.textContent = `${greeting}, ${firstName}! 👋`;
        }

        const quoteEl = document.getElementById('headerQuote');
        if (quoteEl) {
            quoteEl.textContent = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
        }
    }

    /* --------------------------------------------------------------------------
       STORAGE (CATEGORIES & HABITS)
       -------------------------------------------------------------------------- */
    loadCategories() {
        try {
            const raw = localStorage.getItem('habit_tracker_categories');
            if (raw) {
                this.categories = JSON.parse(raw);
            } else {
                this.categories = [...DEFAULT_CATEGORIES];
                this.saveCategories();
            }
        } catch (e) {
            this.categories = [...DEFAULT_CATEGORIES];
        }
    }

    saveCategories() {
        localStorage.setItem('habit_tracker_categories', JSON.stringify(this.categories));
    }

    loadHabits() {
        try {
            const raw = localStorage.getItem('habit_tracker_habits');
            if (raw) {
                this.habits = JSON.parse(raw);
            } else {
                this.habits = [];
            }
        } catch (e) {
            this.habits = [];
        }
    }

    saveHabits() {
        localStorage.setItem('habit_tracker_habits', JSON.stringify(this.habits));
    }

    /* --------------------------------------------------------------------------
       CUSTOM MODAL DIALOGS (REPLACING NATIVE ALERT & CONFIRM)
       -------------------------------------------------------------------------- */
    showConfirmDialog({
        title = 'Are you sure?',
        message = 'This action cannot be undone.',
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        confirmClass = 'btn-danger',
        type = 'danger'
    } = {}) {
        return new Promise((resolve) => {
            const modal = document.getElementById('confirmDialogModal');
            const titleEl = document.getElementById('confirmDialogTitle');
            const messageEl = document.getElementById('confirmDialogMessage');
            const iconBox = document.getElementById('confirmDialogIconBox');
            const iconSvg = document.getElementById('confirmDialogIconSvg');
            const confirmBtn = document.getElementById('confirmDialogConfirmBtn');
            const cancelBtn = document.getElementById('confirmDialogCancelBtn');

            if (!modal || !titleEl || !messageEl || !confirmBtn || !cancelBtn) {
                resolve(window.confirm(`${title}\n${message}`));
                return;
            }

            titleEl.textContent = title;
            messageEl.textContent = message;
            confirmBtn.textContent = confirmText;
            confirmBtn.className = `btn ${confirmClass}`;
            cancelBtn.textContent = cancelText;
            cancelBtn.style.display = 'inline-flex';

            if (iconBox) {
                iconBox.className = `confirm-icon-box ${type}`;
            }

            if (iconSvg) {
                if (type === 'info') {
                    iconSvg.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
                } else if (type === 'warning') {
                    iconSvg.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
                } else {
                    iconSvg.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
                }
            }

            const cleanup = (result) => {
                modal.classList.remove('show');
                confirmBtn.onclick = null;
                cancelBtn.onclick = null;
                resolve(result);
            };

            confirmBtn.onclick = () => cleanup(true);
            cancelBtn.onclick = () => cleanup(false);

            modal.classList.add('show');
        });
    }

    showAlertDialog({
        title = 'Notice',
        message = '',
        buttonText = 'OK',
        type = 'info'
    } = {}) {
        return new Promise((resolve) => {
            const modal = document.getElementById('confirmDialogModal');
            const titleEl = document.getElementById('confirmDialogTitle');
            const messageEl = document.getElementById('confirmDialogMessage');
            const iconBox = document.getElementById('confirmDialogIconBox');
            const iconSvg = document.getElementById('confirmDialogIconSvg');
            const confirmBtn = document.getElementById('confirmDialogConfirmBtn');
            const cancelBtn = document.getElementById('confirmDialogCancelBtn');

            if (!modal || !titleEl || !messageEl || !confirmBtn) {
                window.alert(`${title}\n${message}`);
                resolve();
                return;
            }

            titleEl.textContent = title;
            messageEl.textContent = message;
            confirmBtn.textContent = buttonText;
            confirmBtn.className = type === 'danger' ? 'btn btn-danger' : 'btn btn-primary';
            if (cancelBtn) cancelBtn.style.display = 'none';

            if (iconBox) iconBox.className = `confirm-icon-box ${type}`;
            if (iconSvg) {
                if (type === 'danger') {
                    iconSvg.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
                } else {
                    iconSvg.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
                }
            }

            const cleanup = () => {
                modal.classList.remove('show');
                confirmBtn.onclick = null;
                if (cancelBtn) cancelBtn.style.display = 'inline-flex';
                resolve();
            };

            confirmBtn.onclick = cleanup;
            modal.classList.add('show');
        });
    }

    /* --------------------------------------------------------------------------
       SEARCH HELPERS (ESCAPE & HIGHLIGHT)
       -------------------------------------------------------------------------- */
    escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/[&<>"']/g, function(m) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[m];
        });
    }

    highlightMatch(text, query) {
        if (!text || !query) return this.escapeHtml(text);
        const safeText = this.escapeHtml(text);
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return safeText.replace(regex, '<mark class="search-highlight">$1</mark>');
    }

    clearSearch() {
        const searchInput = document.getElementById('searchInput');
        const clearSearchBtn = document.getElementById('clearSearchBtn');
        if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
        }
        if (clearSearchBtn) {
            clearSearchBtn.style.display = 'none';
        }
        this.searchQuery = '';
        this.renderHabitsGrid();
    }

    /* --------------------------------------------------------------------------
       EVENT LISTENERS & UI WIRING
       -------------------------------------------------------------------------- */
    setupEventListeners() {
        // User Profile Dropdown Toggle
        const userBtn = document.getElementById('userProfileBtn');
        const userMenu = document.getElementById('userDropdownMenu');
        if (userBtn && userMenu) {
            userBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userMenu.classList.toggle('show');
            });
            document.addEventListener('click', () => userMenu.classList.remove('show'));
        }

        // Dropdown Items
        document.getElementById('dropdownAuthBtn')?.addEventListener('click', () => this.openAuthModal());
        document.getElementById('closeAuthModalBtn')?.addEventListener('click', () => this.closeAuthModal());
        document.getElementById('dropdownClearAllBtn')?.addEventListener('click', () => this.clearAllHabits());

        // Auth Tabs
        const tabLoginBtn = document.getElementById('tabLoginBtn');
        const tabSignUpBtn = document.getElementById('tabSignUpBtn');
        const loginForm = document.getElementById('loginForm');
        const signUpForm = document.getElementById('signUpForm');

        tabLoginBtn?.addEventListener('click', () => {
            tabLoginBtn.classList.add('active');
            tabSignUpBtn?.classList.remove('active');
            loginForm.style.display = 'flex';
            signUpForm.style.display = 'none';
        });

        tabSignUpBtn?.addEventListener('click', () => {
            tabSignUpBtn.classList.add('active');
            tabLoginBtn?.classList.remove('active');
            signUpForm.style.display = 'flex';
            loginForm.style.display = 'none';
        });

        loginForm?.addEventListener('submit', (e) => this.handleLogin(e));
        signUpForm?.addEventListener('submit', (e) => this.handleSignUp(e));
        document.getElementById('guestLoginBtn')?.addEventListener('click', () => this.handleGuestLogin());

        // Avatar Color Picker in Sign Up
        const userColorPicker = document.getElementById('userAvatarColorPicker');
        if (userColorPicker) {
            userColorPicker.addEventListener('click', (e) => {
                const btn = e.target.closest('.color-option');
                if (!btn) return;
                userColorPicker.querySelectorAll('.color-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById('signUpAvatarColor').value = btn.dataset.color || '#4f46e5';
            });
        }

        // Search Box Wiring (Real-time live search)
        const searchInput = document.getElementById('searchInput');
        const clearSearchBtn = document.getElementById('clearSearchBtn');

        if (searchInput) {
            const handleSearch = (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                if (clearSearchBtn) {
                    clearSearchBtn.style.display = this.searchQuery ? 'inline-flex' : 'none';
                }
                this.renderHabitsGrid();
            };

            searchInput.addEventListener('input', handleSearch);
            searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Escape') {
                    this.clearSearch();
                    searchInput.blur();
                } else {
                    handleSearch(e);
                }
            });
            searchInput.addEventListener('search', handleSearch);
            searchInput.addEventListener('paste', () => {
                setTimeout(() => handleSearch({ target: searchInput }), 10);
            });
        }

        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                this.clearSearch();
            });
        }

        // Global Shortcut: Press '/' or 'Ctrl+K' / 'Cmd+K' to focus search
        document.addEventListener('keydown', (e) => {
            const tag = (document.activeElement?.tagName || '').toUpperCase();
            if ((e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') ||
                ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
                e.preventDefault();
                const searchEl = document.getElementById('searchInput');
                if (searchEl) {
                    searchEl.focus();
                    searchEl.select();
                }
            }
        });

        // Frequency Filter
        const freqContainer = document.getElementById('frequencyFilters');
        if (freqContainer) {
            freqContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.filter-pill');
                if (!btn) return;
                freqContainer.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedFrequency = btn.dataset.freq || 'all';
                this.renderHabitsGrid();
            });
        }

        // Status Segment Control
        const statusControl = document.getElementById('statusFilterControl');
        if (statusControl) {
            statusControl.addEventListener('click', (e) => {
                const btn = e.target.closest('.segment-btn');
                if (!btn) return;
                statusControl.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedStatus = btn.dataset.status || 'all';
                this.renderHabitsGrid();
            });
        }

        // Sort Select
        document.getElementById('sortSelect')?.addEventListener('change', (e) => {
            this.sortOrder = e.target.value;
            this.renderHabitsGrid();
        });

        // Habit Modal Triggers
        document.getElementById('openAddModalBtn')?.addEventListener('click', () => this.openHabitModal());
        document.getElementById('closeHabitModalBtn')?.addEventListener('click', () => this.closeHabitModal());
        document.getElementById('cancelHabitModalBtn')?.addEventListener('click', () => this.closeHabitModal());
        document.getElementById('habitForm')?.addEventListener('submit', (e) => this.handleHabitSubmit(e));

        // Category Modal Triggers
        document.getElementById('openAddCategoryBtn')?.addEventListener('click', () => this.openCategoryModal());
        document.getElementById('dropdownManageCategoriesBtn')?.addEventListener('click', () => this.openCategoryModal());
        document.getElementById('closeCategoryModalBtn')?.addEventListener('click', () => this.closeCategoryModal());
        document.getElementById('cancelCategoryModalBtn')?.addEventListener('click', () => this.closeCategoryModal());
        document.getElementById('categoryForm')?.addEventListener('submit', (e) => this.handleCategorySubmit(e));

        // Category Color Picker
        const categoryColorPicker = document.getElementById('categoryColorPickerGroup');
        if (categoryColorPicker) {
            categoryColorPicker.addEventListener('click', (e) => {
                const btn = e.target.closest('.color-option');
                if (!btn) return;
                categoryColorPicker.querySelectorAll('.color-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById('categoryColorInput').value = btn.dataset.color || '#4f46e5';
            });
        }

        // Habit Color Picker
        const habitColorPicker = document.getElementById('colorPickerGroup');
        if (habitColorPicker) {
            habitColorPicker.addEventListener('click', (e) => {
                const btn = e.target.closest('.color-option');
                if (!btn) return;
                habitColorPicker.querySelectorAll('.color-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById('habitColor').value = btn.dataset.color || '#4f46e5';
            });
        }

        // Analytics Modal
        document.getElementById('analyticsBtn')?.addEventListener('click', () => this.openAnalyticsModal());
        document.getElementById('closeAnalyticsModalBtn')?.addEventListener('click', () => this.closeAnalyticsModal());

        // Background click to close modals
        ['authModal', 'categoryModal', 'habitModal', 'analyticsModal'].forEach(id => {
            const modal = document.getElementById(id);
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) modal.classList.remove('show');
                });
            }
        });
    }

    /* --------------------------------------------------------------------------
       AUTH HANDLERS
       -------------------------------------------------------------------------- */
    openAuthModal() {
        document.getElementById('authModal')?.classList.add('show');
    }

    closeAuthModal() {
        document.getElementById('authModal')?.classList.remove('show');
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const name = email.split('@')[0].replace('.', ' ') || 'User';
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

        this.currentUser = {
            name: formattedName,
            email: email,
            avatarColor: '#4f46e5',
            isGuest: false
        };
        this.saveUser();
        this.updateUserUI();
        this.updateUserGreeting();
        this.closeAuthModal();
        this.showToast(`Signed in as ${this.currentUser.name}`, 'success');
    }

    handleSignUp(e) {
        e.preventDefault();
        const name = document.getElementById('signUpName').value.trim();
        const email = document.getElementById('signUpEmail').value.trim();
        const color = document.getElementById('signUpAvatarColor').value;

        this.currentUser = {
            name: name,
            email: email,
            avatarColor: color,
            isGuest: false
        };
        this.saveUser();
        this.updateUserUI();
        this.updateUserGreeting();
        this.closeAuthModal();
        this.showToast(`Welcome, ${this.currentUser.name}!`, 'success');
        this.triggerConfetti();
    }

    handleGuestLogin() {
        this.currentUser = {
            name: 'Guest Explorer',
            email: 'guest@habittracker.app',
            avatarColor: '#059669',
            isGuest: true
        };
        this.saveUser();
        this.updateUserUI();
        this.updateUserGreeting();
        this.closeAuthModal();
        this.showToast('Continuing as Guest', 'success');
    }

    /* --------------------------------------------------------------------------
       CATEGORY CUSTOMIZATION & CRUD
       -------------------------------------------------------------------------- */
    setupIconPicker() {
        const grid = document.getElementById('iconPickerGrid');
        if (!grid) return;

        const iconKeys = Object.keys(SVG_ICONS);
        grid.innerHTML = iconKeys.map((key, index) => `
            <button type="button" class="icon-picker-btn ${index === 0 ? 'active' : ''}" data-icon="${key}" title="${key}">
                ${SVG_ICONS[key]}
            </button>
        `).join('');

        grid.addEventListener('click', (e) => {
            const btn = e.target.closest('.icon-picker-btn');
            if (!btn) return;
            grid.querySelectorAll('.icon-picker-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('categoryIconKey').value = btn.dataset.icon;
        });
    }

    openCategoryModal(categoryToEdit = null) {
        const modal = document.getElementById('categoryModal');
        const title = document.getElementById('categoryModalTitle');
        const form = document.getElementById('categoryForm');
        if (!modal || !form) return;

        form.reset();

        if (categoryToEdit) {
            if (title) title.textContent = 'Edit Category';
            document.getElementById('editCategoryId').value = categoryToEdit.id;
            document.getElementById('categoryNameInput').value = categoryToEdit.name;
            document.getElementById('categoryIconKey').value = categoryToEdit.icon || 'target';
            document.getElementById('categoryColorInput').value = categoryToEdit.color || '#4f46e5';

            document.querySelectorAll('#iconPickerGrid .icon-picker-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.icon === categoryToEdit.icon);
            });
            document.querySelectorAll('#categoryColorPickerGroup .color-option').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.color === categoryToEdit.color);
            });
        } else {
            if (title) title.textContent = 'Create New Category';
            document.getElementById('editCategoryId').value = '';
            document.getElementById('categoryIconKey').value = 'target';
            document.getElementById('categoryColorInput').value = '#4f46e5';
            document.querySelectorAll('#iconPickerGrid .icon-picker-btn').forEach((btn, idx) => {
                btn.classList.toggle('active', idx === 0);
            });
        }

        modal.classList.add('show');
        document.getElementById('categoryNameInput')?.focus();
    }

    closeCategoryModal() {
        document.getElementById('categoryModal')?.classList.remove('show');
    }

    handleCategorySubmit(e) {
        e.preventDefault();
        const editId = document.getElementById('editCategoryId').value;
        const name = document.getElementById('categoryNameInput').value.trim();
        const iconKey = document.getElementById('categoryIconKey').value || 'target';
        const color = document.getElementById('categoryColorInput').value || '#4f46e5';

        if (!name) return;

        if (editId) {
            const cat = this.categories.find(c => c.id === editId);
            if (cat) {
                const oldName = cat.name;
                cat.name = name;
                cat.icon = iconKey;
                cat.color = color;
                this.habits.forEach(h => {
                    if (h.category === oldName) h.category = name;
                });
                this.saveHabits();
                this.showToast(`Updated category "${name}"`, 'success');
            }
        } else {
            const newCat = {
                id: 'cat_' + Date.now(),
                name,
                icon: iconKey,
                color
            };
            this.categories.push(newCat);
            this.showToast(`Created category "${name}"!`, 'success');
        }

        this.saveCategories();
        this.closeCategoryModal();
        this.render();
    }

    async deleteCategory(id) {
        const cat = this.categories.find(c => c.id === id);
        if (!cat) return;

        const confirmed = await this.showConfirmDialog({
            title: `Delete "${cat.name}" Category?`,
            message: `Habits assigned to "${cat.name}" will be safely moved to "General". This action cannot be undone.`,
            confirmText: 'Delete Category',
            confirmClass: 'btn-danger',
            type: 'danger'
        });

        if (confirmed) {
            this.categories = this.categories.filter(c => c.id !== id);
            this.habits.forEach(h => {
                if (h.category === cat.name) h.category = 'General';
            });
            this.saveCategories();
            this.saveHabits();
            this.render();
            this.showToast(`Deleted category "${cat.name}"`);
        }
    }

    /* --------------------------------------------------------------------------
       STARTER INSPIRATIONS
       -------------------------------------------------------------------------- */
    setupStarterInspirations() {
        const list = document.getElementById('templateList');
        if (!list) return;

        list.innerHTML = STARTER_INSPIRATIONS.map(item => `
            <button type="button" class="template-card" onclick="tracker.addStarterInspiration('${item.name}')">
                <div class="template-card-left">
                    <div class="template-icon-badge" style="color: ${item.color};">
                        ${SVG_ICONS[item.icon] || SVG_ICONS['target']}
                    </div>
                    <div class="template-info">
                        <span class="template-title">${item.name}</span>
                        <span class="template-sub">${item.category} • ${item.freq}</span>
                    </div>
                </div>
                <span class="template-add-pill">+ Add</span>
            </button>
        `).join('');
    }

    addStarterInspiration(name) {
        const template = STARTER_INSPIRATIONS.find(t => t.name === name);
        if (!template) return;

        if (!this.categories.some(c => c.name === template.category)) {
            this.categories.push({
                id: 'cat_' + Date.now(),
                name: template.category,
                icon: template.icon,
                color: template.color
            });
            this.saveCategories();
        }

        const newHabit = {
            id: Date.now(),
            name: template.name,
            description: template.desc,
            category: template.category,
            frequency: template.freq,
            color: template.color,
            createdAt: this.getTodayStr(),
            completions: [this.getTodayStr()]
        };

        this.habits.unshift(newHabit);
        this.saveHabits();
        this.render();
        this.showToast(`Added habit: "${newHabit.name}"!`, 'success');
        this.triggerConfetti();
    }

    /* --------------------------------------------------------------------------
       CALCULATION HELPERS
       -------------------------------------------------------------------------- */
    getTodayStr() {
        return new Date().toISOString().split('T')[0];
    }

    getRolling7Days() {
        const days = [];
        const dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            days.push({
                dateStr,
                dayName: dayLetters[d.getDay()],
                isToday: i === 0
            });
        }
        return days;
    }

    calculateStreak(habit) {
        if (!habit.completions || habit.completions.length === 0) return 0;

        const uniqueDates = Array.from(new Set(habit.completions)).sort().reverse();
        const todayStr = this.getTodayStr();
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

        if (!uniqueDates.includes(todayStr) && !uniqueDates.includes(yesterdayStr)) {
            return 0;
        }

        let streak = 0;
        let checkDate = new Date();
        if (!uniqueDates.includes(todayStr)) checkDate = yesterdayDate;

        while (true) {
            const checkStr = checkDate.toISOString().split('T')[0];
            if (uniqueDates.includes(checkStr)) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
        return streak;
    }

    calculateBestStreak(habit) {
        if (!habit.completions || habit.completions.length === 0) return 0;
        const sorted = Array.from(new Set(habit.completions)).sort();
        if (sorted.length === 0) return 0;

        let maxStreak = 1;
        let currentRun = 1;

        for (let i = 1; i < sorted.length; i++) {
            const prev = new Date(sorted[i - 1]);
            const curr = new Date(sorted[i]);
            const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                currentRun++;
                if (currentRun > maxStreak) maxStreak = currentRun;
            } else if (diffDays > 1) {
                currentRun = 1;
            }
        }
        return maxStreak;
    }

    calculateConsistencyScore() {
        if (this.habits.length === 0) return 0;
        const rollingDays = this.getRolling7Days();
        const totalPossible = this.habits.length * 7;
        let totalCompleted = 0;

        this.habits.forEach(habit => {
            rollingDays.forEach(day => {
                if (habit.completions.includes(day.dateStr)) totalCompleted++;
            });
        });

        return Math.round((totalCompleted / totalPossible) * 100);
    }

    /* --------------------------------------------------------------------------
       RENDER METHODS
       -------------------------------------------------------------------------- */
    render() {
        this.renderCategorySidebar();
        this.renderHabitCategorySelect();
        this.renderMetrics();
        this.renderHabitsGrid();
    }

    renderCategorySidebar() {
        const container = document.getElementById('categoryFilters');
        if (!container) return;

        const counts = { all: this.habits.length };
        this.categories.forEach(cat => {
            counts[cat.name] = this.habits.filter(h => h.category === cat.name).length;
        });

        let html = `
            <div class="category-item-row ${this.selectedCategory === 'all' ? 'active' : ''}">
                <button class="category-btn" onclick="tracker.setCategoryFilter('all')">
                    <div class="category-btn-left">
                        <span class="cat-icon-svg">${SVG_ICONS['sparkles']}</span>
                        <span>All Habits</span>
                    </div>
                    <span class="category-pill-count">${counts['all'] || 0}</span>
                </button>
            </div>
        `;

        html += this.categories.map(cat => {
            const iconSvg = SVG_ICONS[cat.icon] || SVG_ICONS['target'];
            const isActive = this.selectedCategory === cat.name;

            return `
                <div class="category-item-row ${isActive ? 'active' : ''}">
                    <button class="category-btn" onclick="tracker.setCategoryFilter('${cat.name}')">
                        <div class="category-btn-left">
                            <span class="cat-icon-svg" style="color: ${cat.color};">${iconSvg}</span>
                            <span>${cat.name}</span>
                        </div>
                        <span class="category-pill-count">${counts[cat.name] || 0}</span>
                    </button>
                    <div class="category-item-actions">
                        <button class="cat-action-btn" title="Edit" onclick="tracker.editCategoryById('${cat.id}')">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="cat-action-btn" title="Delete" onclick="tracker.deleteCategory('${cat.id}')">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    }

    setCategoryFilter(catName) {
        this.selectedCategory = catName;
        this.renderCategorySidebar();
        this.renderHabitsGrid();
    }

    editCategoryById(id) {
        const cat = this.categories.find(c => c.id === id);
        if (cat) this.openCategoryModal(cat);
    }

    renderHabitCategorySelect() {
        const select = document.getElementById('habitCategorySelect');
        if (!select) return;

        select.innerHTML = this.categories.map(cat => `
            <option value="${cat.name}">${cat.name}</option>
        `).join('');
    }

    renderMetrics() {
        const todayStr = this.getTodayStr();
        const total = this.habits.length;
        const completedToday = this.habits.filter(h => h.completions.includes(todayStr)).length;
        const progressPercent = total > 0 ? Math.round((completedToday / total) * 100) : 0;

        // Progress Card
        const todayProgressText = document.getElementById('todayProgressText');
        const todayCompletedText = document.getElementById('todayCompletedText');
        if (todayProgressText) todayProgressText.textContent = `${progressPercent}%`;
        if (todayCompletedText) todayCompletedText.textContent = `${completedToday} of ${total} completed`;

        // SVG Radial Ring
        const progressRing = document.getElementById('progressRingFill');
        if (progressRing) {
            const circumference = 163.36;
            const offset = circumference - (progressPercent / 100) * circumference;
            progressRing.style.strokeDashoffset = `${offset}`;
        }

        // Best Active Streak
        let bestStreak = 0;
        let bestStreakHabitName = "No active streaks";
        this.habits.forEach(h => {
            const s = this.calculateStreak(h);
            if (s > bestStreak) {
                bestStreak = s;
                bestStreakHabitName = h.name;
            }
        });

        const bestStreakValEl = document.getElementById('bestStreakValue');
        const bestStreakNameEl = document.getElementById('bestStreakName');
        if (bestStreakValEl) bestStreakValEl.textContent = bestStreak.toString();
        if (bestStreakNameEl) bestStreakNameEl.textContent = bestStreak > 0 ? `Leading: ${bestStreakHabitName}` : 'Check in to start a streak!';

        // Total All-Time Check-Ins
        const totalLogs = this.habits.reduce((acc, h) => acc + (h.completions ? h.completions.length : 0), 0);
        const totalLogsEl = document.getElementById('totalCompletionsValue');
        if (totalLogsEl) totalLogsEl.textContent = totalLogs.toString();

        // 7-Day Consistency Score
        const consistency = this.calculateConsistencyScore();
        const weeklyScoreEl = document.getElementById('weeklyAdherenceValue');
        const weeklyScoreBar = document.getElementById('weeklyAdherenceBar');
        if (weeklyScoreEl) weeklyScoreEl.textContent = `${consistency}%`;
        if (weeklyScoreBar) weeklyScoreBar.style.width = `${consistency}%`;
    }

    getFilteredHabits() {
        const todayStr = this.getTodayStr();
        const query = this.searchQuery;

        return this.habits.filter(habit => {
            // If active search query: match against name, description, category, or frequency
            if (query) {
                const nameMatch = (habit.name || '').toLowerCase().includes(query);
                const descMatch = (habit.description || '').toLowerCase().includes(query);
                const catMatch = (habit.category || '').toLowerCase().includes(query);
                const freqMatch = (habit.frequency || '').toLowerCase().includes(query);

                if (!nameMatch && !descMatch && !catMatch && !freqMatch) {
                    return false;
                }
            }

            // Category filter
            if (this.selectedCategory !== 'all' && habit.category !== this.selectedCategory) {
                return false;
            }

            // Frequency filter
            if (this.selectedFrequency !== 'all' && habit.frequency !== this.selectedFrequency) {
                return false;
            }

            // Status filter
            if (this.selectedStatus === 'pending' && habit.completions.includes(todayStr)) {
                return false;
            }
            if (this.selectedStatus === 'completed' && !habit.completions.includes(todayStr)) {
                return false;
            }

            return true;
        }).sort((a, b) => {
            if (this.sortOrder === 'streak') return this.calculateStreak(b) - this.calculateStreak(a);
            if (this.sortOrder === 'name') return a.name.localeCompare(b.name);
            if (this.sortOrder === 'category') return (a.category || '').localeCompare(b.category || '');
            if (this.sortOrder === 'rate') return (b.completions?.length || 0) - (a.completions?.length || 0);
            if (this.sortOrder === 'newest') return b.id - a.id;
            return 0;
        });
    }

    renderHabitsGrid() {
        const grid = document.getElementById('habitsGrid');
        const countBadge = document.getElementById('habitCountBadge');
        if (!grid) return;

        const filtered = this.getFilteredHabits();
        if (countBadge) countBadge.textContent = filtered.length.toString();

        // Empty state handling
        if (filtered.length === 0) {
            if (this.searchQuery) {
                grid.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon-box">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </div>
                        <h3>No habits found matching "${this.escapeHtml(this.searchQuery)}"</h3>
                        <p>We couldn't find any habits matching your search query. Try another term or clear your search.</p>
                        <div class="empty-state-actions">
                            <button class="btn btn-secondary" onclick="tracker.clearSearch()">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                <span>Clear Search</span>
                            </button>
                            <button class="btn btn-primary" onclick="tracker.openHabitModalWithName('${this.escapeHtml(this.searchQuery)}')">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                <span>Create "${this.escapeHtml(this.searchQuery)}"</span>
                            </button>
                        </div>
                    </div>
                `;
            } else {
                grid.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon-box">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                        </div>
                        <h3>${this.habits.length === 0 ? 'Your habit board is clean and ready' : 'No habits match your filters'}</h3>
                        <p>${this.habits.length === 0 ? 'Start tracking your daily goals, build momentum, and master consistency. Add your first habit or pick a starter inspiration.' : 'Try switching category filters or frequency to view your habits.'}</p>
                        <div class="empty-state-actions">
                            <button class="btn btn-primary" onclick="tracker.openHabitModal()">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                <span>Create First Habit</span>
                            </button>
                        </div>
                    </div>
                `;
            }
            return;
        }

        const todayStr = this.getTodayStr();
        const rollingDays = this.getRolling7Days();

        grid.innerHTML = filtered.map(habit => {
            const isCompletedToday = habit.completions.includes(todayStr);
            const streak = this.calculateStreak(habit);
            const catObj = this.categories.find(c => c.name === habit.category) || { name: habit.category, icon: 'target', color: '#4f46e5' };
            const iconSvg = SVG_ICONS[catObj.icon] || SVG_ICONS['target'];
            const cardAccent = habit.color || catObj.color;

            // Highlight matches if search active
            const displayName = this.searchQuery ? this.highlightMatch(habit.name, this.searchQuery) : this.escapeHtml(habit.name);
            const displayDesc = habit.description ? (this.searchQuery ? this.highlightMatch(habit.description, this.searchQuery) : this.escapeHtml(habit.description)) : '';

            // Generate 7-day strip HTML
            const stripHtml = rollingDays.map(day => {
                const isChecked = habit.completions.includes(day.dateStr);
                return `
                    <button type="button" 
                            class="day-pill ${day.isToday ? 'today' : ''} ${isChecked ? 'completed' : ''}" 
                            title="${day.dateStr}${day.isToday ? ' (Today)' : ''}"
                            onclick="tracker.toggleDateCompletion(${habit.id}, '${day.dateStr}')">
                        <span class="day-name">${day.dayName}</span>
                        <div class="day-check-indicator">${isChecked ? '✓' : ''}</div>
                    </button>
                `;
            }).join('');

            return `
                <div class="habit-card ${isCompletedToday ? 'is-completed' : ''}" style="--card-accent: ${cardAccent};">
                    <div class="habit-header">
                        <div class="habit-title-group">
                            <h3 class="habit-name">${displayName}</h3>
                            ${displayDesc ? `<p class="habit-desc">${displayDesc}</p>` : ''}
                            <div class="habit-meta-row">
                                <span class="category-tag" style="--tag-bg: ${catObj.color}15; --tag-color: ${catObj.color};">
                                    ${iconSvg} ${this.escapeHtml(habit.category)}
                                </span>
                                <span class="freq-tag">${habit.frequency}</span>
                            </div>
                        </div>

                        <div class="habit-actions-menu">
                            <button class="card-menu-btn" title="Edit Habit" onclick="tracker.editHabit(${habit.id})">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                            <button class="card-menu-btn" title="Delete Habit" onclick="tracker.deleteHabit(${habit.id})">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- 7-Day Rolling Interactive Check Strip -->
                    <div class="strip-container">
                        <span class="strip-label">7-Day Consistency</span>
                        <div class="day-strip">
                            ${stripHtml}
                        </div>
                    </div>

                    <!-- Footer & Check In Button -->
                    <div class="habit-card-footer">
                        <div class="card-streak-info">
                            <span class="flame-icon-box">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2c1.5 3 4 5.5 4 9a6 6 0 1 1-12 0c0-3.5 2.5-6 4-9 0 2 1.5 3.5 4 0z"/>
                                </svg>
                            </span>
                            <div class="streak-text-group">
                                <span class="streak-count">${streak} ${streak === 1 ? 'day' : 'days'} streak</span>
                                <span class="streak-sub">${habit.completions.length} total check-ins</span>
                            </div>
                        </div>

                        <button class="check-in-btn ${isCompletedToday ? 'checked' : ''}" 
                                onclick="tracker.toggleToday(${habit.id})">
                            ${isCompletedToday ? '✓ Done' : '+ Check In'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    /* --------------------------------------------------------------------------
       HABIT ACTIONS & CRUD
       -------------------------------------------------------------------------- */
    toggleToday(habitId) {
        const todayStr = this.getTodayStr();
        this.toggleDateCompletion(habitId, todayStr);
    }

    toggleDateCompletion(habitId, dateStr) {
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return;

        const index = habit.completions.indexOf(dateStr);
        const wasCompleted = index > -1;

        if (wasCompleted) {
            habit.completions.splice(index, 1);
            this.showToast(`Unchecked "${habit.name}" for ${dateStr}`);
        } else {
            habit.completions.push(dateStr);
            this.showToast(`✓ Completed "${habit.name}"!`, 'success');
            this.triggerConfetti();
        }

        this.saveHabits();
        this.render();
    }

    openHabitModal(habitToEdit = null) {
        const modal = document.getElementById('habitModal');
        const title = document.getElementById('modalTitle');
        const form = document.getElementById('habitForm');
        if (!modal || !form) return;

        form.reset();

        if (habitToEdit) {
            if (title) title.textContent = 'Edit Habit';
            document.getElementById('editHabitId').value = habitToEdit.id;
            document.getElementById('habitName').value = habitToEdit.name;
            document.getElementById('habitDescription').value = habitToEdit.description || '';
            document.getElementById('habitCategorySelect').value = habitToEdit.category;
            document.getElementById('habitFrequency').value = habitToEdit.frequency || 'daily';
            document.getElementById('habitColor').value = habitToEdit.color || '#4f46e5';

            document.querySelectorAll('#colorPickerGroup .color-option').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.color === habitToEdit.color);
            });
        } else {
            if (title) title.textContent = 'Create New Habit';
            document.getElementById('editHabitId').value = '';
            document.getElementById('habitColor').value = '#4f46e5';
            document.querySelectorAll('#colorPickerGroup .color-option').forEach((btn, idx) => {
                btn.classList.toggle('active', idx === 0);
            });
        }

        modal.classList.add('show');
        document.getElementById('habitName')?.focus();
    }

    openHabitModalWithName(presetName) {
        this.openHabitModal();
        const nameInput = document.getElementById('habitName');
        if (nameInput) {
            nameInput.value = presetName;
            nameInput.focus();
        }
    }

    closeHabitModal() {
        document.getElementById('habitModal')?.classList.remove('show');
    }

    async handleHabitSubmit(e) {
        e.preventDefault();

        const editId = document.getElementById('editHabitId')?.value;
        const name = document.getElementById('habitName')?.value.trim();
        const description = document.getElementById('habitDescription')?.value.trim();
        const category = document.getElementById('habitCategorySelect')?.value;
        const frequency = document.getElementById('habitFrequency')?.value;
        const color = document.getElementById('habitColor')?.value;

        if (!name) return;

        try {
            // Get the current authenticated user session
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;
            if (!user) throw new Error("No active user session found.");

            // Check if category is a valid UUID, otherwise set to null
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            const validCategoryId = uuidRegex.test(category) ? category : null;

            if (editId) {
                // If editing an existing habit
                const { error } = await supabase
                    .from('habits')
                    .update({
                        name,
                        description: description || null,
                        category_id: validCategoryId,
                        frequency: frequency || 'daily',
                        color: color || '#4F46E5'
                    })
                    .eq('id', editId);

                if (error) throw error;
                this.showToast(`Updated habit "${name}"`, 'success');
            } else {
                // If creating a brand new habit
                const { error } = await supabase
                    .from('habits')
                    .insert([
                        {
                            user_id: user.id,
                            name,
                            description: description || null,
                            category_id: validCategoryId,
                            frequency: frequency || 'daily',
                            color: color || '#4F46E5'
                        }
                    ]);

                if (error) throw error;
                this.showToast(`Created habit "${name}"`, 'success');
            }

            // Close the modal, reset the form, and refresh habits from Supabase
            this.closeHabitModal();
            document.getElementById('habitForm')?.reset();
            fetchHabitsFromSupabase();

        } catch (err) {
            console.error("Error saving habit:", err.message);
            this.showToast(`Error: ${err.message}`, 'error');
        }
    }

    editHabit(id) {
        const habit = this.habits.find(h => h.id === id);
        if (habit) this.openHabitModal(habit);
    }

    async deleteHabit(id) {
        const habit = this.habits.find(h => h.id === id);
        if (!habit) return;

        const confirmed = await this.showConfirmDialog({
            title: `Delete "${habit.name}"?`,
            message: `Are you sure you want to delete this habit and all its logged history? This action cannot be undone.`,
            confirmText: 'Delete Habit',
            confirmClass: 'btn-danger',
            type: 'danger'
        });

        if (confirmed) {
            this.habits = this.habits.filter(h => h.id !== id);
            this.saveHabits();
            this.render();
            this.showToast(`Deleted habit "${habit.name}"`);
        }
    }

    async clearAllHabits() {
        const confirmed = await this.showConfirmDialog({
            title: 'Clear All Habits?',
            message: 'Are you sure you want to clear all habits? All your habits, streaks, and check-in history will be wiped. This action cannot be undone.',
            confirmText: 'Clear All Data',
            confirmClass: 'btn-danger',
            type: 'danger'
        });

        if (confirmed) {
            this.habits = [];
            this.saveHabits();
            this.render();
            this.showToast('Cleared all habits.');
        }
    }

    /* --------------------------------------------------------------------------
       DETAILED ANALYTICS MODAL
       -------------------------------------------------------------------------- */
    openAnalyticsModal() {
        const modal = document.getElementById('analyticsModal');
        if (!modal) return;

        this.renderHeatmap();
        this.renderHabitBreakdown();
        modal.classList.add('show');
    }

    closeAnalyticsModal() {
        document.getElementById('analyticsModal')?.classList.remove('show');
    }

    renderHeatmap() {
        const container = document.getElementById('activityHeatmapGrid');
        if (!container) return;

        const cells = [];
        const today = new Date();

        for (let i = 29; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            const count = this.habits.filter(h => h.completions.includes(dateStr)).length;
            let level = 'level-0';
            if (count >= 3) level = 'level-3';
            else if (count === 2) level = 'level-2';
            else if (count === 1) level = 'level-1';

            cells.push(`
                <div class="heatmap-cell ${level}" 
                     title="${dateStr}: ${count} habit${count === 1 ? '' : 's'} completed"></div>
            `);
        }

        container.innerHTML = cells.join('');
    }

    renderHabitBreakdown() {
        const container = document.getElementById('habitBreakdownList');
        if (!container) return;

        if (this.habits.length === 0) {
            container.innerHTML = `<p style="color: var(--text-light); text-align: center; padding: 20px;">No habit activity to display yet.</p>`;
            return;
        }

        container.innerHTML = this.habits.map(habit => {
            const streak = this.calculateStreak(habit);
            const bestStreak = this.calculateBestStreak(habit);
            const completionRate = Math.min(100, Math.round((habit.completions.length / 30) * 100));
            const catObj = this.categories.find(c => c.name === habit.category) || { color: '#4f46e5' };
            const barColor = habit.color || catObj.color;

            return `
                <div class="breakdown-item">
                    <div class="breakdown-top">
                        <span class="breakdown-title">${this.escapeHtml(habit.name)}</span>
                        <span class="breakdown-stats">Streak: ${streak}d | Best: ${bestStreak}d | ${habit.completions.length} check-ins</span>
                    </div>
                    <div class="breakdown-bar-track">
                        <div class="breakdown-bar-fill" style="width: ${completionRate}%; background-color: ${barColor};"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /* --------------------------------------------------------------------------
       CONFETTI ENGINE
       -------------------------------------------------------------------------- */
    setupConfetti() {
        if (!this.canvas) return;
        const resize = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();
    }

    triggerConfetti() {
        if (!this.ctx || !this.canvas) return;

        const colors = ['#4f46e5', '#059669', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6'];
        for (let i = 0; i < 60; i++) {
            this.confettiParticles.push({
                x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
                y: window.innerHeight * 0.4,
                vx: (Math.random() - 0.5) * 12,
                vy: -Math.random() * 10 - 4,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 8,
                opacity: 1
            });
        }

        if (!this.animationId) this.animateConfetti();
    }

    animateConfetti() {
        if (!this.ctx || !this.canvas) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
            const p = this.confettiParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.35;
            p.rotation += p.rotSpeed;
            p.opacity -= 0.015;

            if (p.opacity <= 0 || p.y > this.canvas.height) {
                this.confettiParticles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.globalAlpha = p.opacity;
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            this.ctx.restore();
        }

        if (this.confettiParticles.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animateConfetti());
        } else {
            this.animationId = null;
        }
    }

    /* --------------------------------------------------------------------------
       TOAST NOTIFICATIONS
       -------------------------------------------------------------------------- */
    showToast(message, type = 'normal') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;
        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2600);
    }
}

// Global Tracker Instance
const tracker = new HabitTrackerApp();
window.tracker = tracker;
async function fetchHabitsFromSupabase() {
    try {
        const { data, error } = await supabase.from('habits').select('*');
        if (error) throw error;

        console.log("Successfully fetched habits from Supabase:", data);
        
        tracker.habits = data;
        tracker.render();
        
    } catch (err) {
        console.error("Error fetching habits:", err.message);
    }
}



// Initialize Supabase Auth session anonymously if not already signed in
async function initSupabaseAuth() {
    try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (!session) {
            const { data, error: signInError } = await supabase.auth.signInAnonymously();
            if (signInError) throw signInError;
            console.log("Signed in anonymously:", data.user.id);
        } else {
            console.log("Active Supabase session found:", session.user.id);
        }
    } catch (err) {
        console.error("Auth initialization error:", err.message);
    }
}

// Run auth initialization, then fetch your habits
initSupabaseAuth().then(() => {
    fetchHabitsFromSupabase();
});