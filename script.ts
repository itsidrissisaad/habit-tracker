/**
 * Habit Tracker - TypeScript Architecture & Engine
 */

export type HabitFrequency = 'daily' | 'weekly' | 'monthly';
export type SortOrder = 'streak' | 'name' | 'category' | 'rate' | 'newest';

export interface UserProfile {
    name: string;
    email: string;
    avatarColor: string;
    isGuest: boolean;
}

export interface CustomCategory {
    id: string;
    name: string;
    icon: string;
    color: string;
}

export interface Habit {
    id: number;
    name: string;
    description?: string;
    category: string;
    frequency: HabitFrequency;
    color: string;
    createdAt: string;
    completions: string[]; // ISO date strings 'YYYY-MM-DD'
}

export interface DayPillData {
    dateStr: string;
    dayName: string;
    isToday: boolean;
}

export interface ConfettiParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    rotation: number;
    rotSpeed: number;
    opacity: number;
}

export const SVG_ICONS: Record<string, string> = {
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

export const DEFAULT_CATEGORIES: CustomCategory[] = [
    { id: 'cat_health', name: 'Health & Fitness', icon: 'activity', color: '#059669' },
    { id: 'cat_productivity', name: 'Productivity', icon: 'briefcase', color: '#4f46e5' },
    { id: 'cat_learning', name: 'Learning', icon: 'book', color: '#0284c7' },
    { id: 'cat_wellness', name: 'Mindfulness', icon: 'feather', color: '#7c3aed' },
    { id: 'cat_finance', name: 'Finance', icon: 'wallet', color: '#d97706' }
];

export const MOTIVATIONAL_QUOTES: string[] = [
    '"We are what we repeatedly do. Excellence, then, is not an act, but a habit."',
    '"Small disciplines repeated with consistency every day lead to great achievements."',
    '"Success is the sum of small efforts repeated day in and day out."',
    '"Motivation gets you going, but discipline keeps you growing."',
    '"Focus on the process, and the results will naturally follow."'
];

export class HabitTrackerApp {
    private habits: Habit[] = [];
    private categories: CustomCategory[] = [];
    private currentUser: UserProfile | null = null;
    private selectedCategory: string = 'all';
    private selectedFrequency: string = 'all';
    private selectedStatus: string = 'all';
    private searchQuery: string = '';
    private sortOrder: SortOrder = 'streak';

    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private confettiParticles: ConfettiParticle[] = [];
    private animationId: number | null = null;

    constructor() {
        this.canvas = document.getElementById('confettiCanvas') as HTMLCanvasElement | null;
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.init();
    }

    private init(): void {
        this.loadUser();
        this.loadCategories();
        this.loadHabits();
        this.setupIconPicker();
        this.setupStarterInspirations();
        this.setupEventListeners();
        this.setupConfetti();
        this.updateUserGreeting();
        this.render();
    }

    private loadUser(): void {
        const raw = localStorage.getItem('habit_tracker_user');
        if (raw) {
            try {
                this.currentUser = JSON.parse(raw);
            } catch (e) {
                this.currentUser = { name: 'Alex Rivera', email: 'alex@example.com', avatarColor: '#4f46e5', isGuest: false };
            }
        } else {
            this.currentUser = { name: 'Guest User', email: 'guest@habittracker.app', avatarColor: '#4f46e5', isGuest: true };
            this.saveUser();
        }
        this.updateUserUI();
    }

    private saveUser(): void {
        localStorage.setItem('habit_tracker_user', JSON.stringify(this.currentUser));
    }

    private updateUserUI(): void {
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

    private updateUserGreeting(): void {
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

    private loadCategories(): void {
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

    private saveCategories(): void {
        localStorage.setItem('habit_tracker_categories', JSON.stringify(this.categories));
    }

    private loadHabits(): void {
        try {
            const raw = localStorage.getItem('habit_tracker_habits');
            this.habits = raw ? JSON.parse(raw) : [];
        } catch (e) {
            this.habits = [];
        }
    }

    private saveHabits(): void {
        localStorage.setItem('habit_tracker_habits', JSON.stringify(this.habits));
    }

    private setupEventListeners(): void {
        const userBtn = document.getElementById('userProfileBtn');
        const userMenu = document.getElementById('userDropdownMenu');
        if (userBtn && userMenu) {
            userBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userMenu.classList.toggle('show');
            });
            document.addEventListener('click', () => userMenu.classList.remove('show'));
        }

        document.getElementById('dropdownAuthBtn')?.addEventListener('click', () => this.openAuthModal());
        document.getElementById('closeAuthModalBtn')?.addEventListener('click', () => this.closeAuthModal());

        const tabLoginBtn = document.getElementById('tabLoginBtn');
        const tabSignUpBtn = document.getElementById('tabSignUpBtn');
        const loginForm = document.getElementById('loginForm');
        const signUpForm = document.getElementById('signUpForm');

        tabLoginBtn?.addEventListener('click', () => {
            tabLoginBtn.classList.add('active');
            tabSignUpBtn?.classList.remove('active');
            if (loginForm) loginForm.style.display = 'flex';
            if (signUpForm) signUpForm.style.display = 'none';
        });

        tabSignUpBtn?.addEventListener('click', () => {
            tabSignUpBtn.classList.add('active');
            tabLoginBtn?.classList.remove('active');
            if (signUpForm) signUpForm.style.display = 'flex';
            if (loginForm) loginForm.style.display = 'none';
        });

        loginForm?.addEventListener('submit', (e) => this.handleLogin(e));
        signUpForm?.addEventListener('submit', (e) => this.handleSignUp(e));
        document.getElementById('guestLoginBtn')?.addEventListener('click', () => this.handleGuestLogin());

        const userColorPicker = document.getElementById('userAvatarColorPicker');
        if (userColorPicker) {
            userColorPicker.addEventListener('click', (e) => {
                const btn = (e.target as HTMLElement).closest('.color-option') as HTMLElement | null;
                if (!btn) return;
                userColorPicker.querySelectorAll('.color-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const avatarColorInput = document.getElementById('signUpAvatarColor') as HTMLInputElement | null;
                if (avatarColorInput) avatarColorInput.value = btn.dataset.color || '#4f46e5';
            });
        }

        const searchInput = document.getElementById('searchInput') as HTMLInputElement | null;
        const clearSearchBtn = document.getElementById('clearSearchBtn');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = (e.target as HTMLInputElement).value.toLowerCase().trim();
                if (clearSearchBtn) clearSearchBtn.style.display = this.searchQuery ? 'block' : 'none';
                this.renderHabitsGrid();
            });
        }
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                this.searchQuery = '';
                clearSearchBtn.style.display = 'none';
                this.renderHabitsGrid();
            });
        }

        const freqContainer = document.getElementById('frequencyFilters');
        if (freqContainer) {
            freqContainer.addEventListener('click', (e) => {
                const btn = (e.target as HTMLElement).closest('.filter-pill') as HTMLElement | null;
                if (!btn) return;
                freqContainer.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedFrequency = btn.dataset.freq || 'all';
                this.renderHabitsGrid();
            });
        }

        const statusControl = document.getElementById('statusFilterControl');
        if (statusControl) {
            statusControl.addEventListener('click', (e) => {
                const btn = (e.target as HTMLElement).closest('.segment-btn') as HTMLElement | null;
                if (!btn) return;
                statusControl.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedStatus = btn.dataset.status || 'all';
                this.renderHabitsGrid();
            });
        }

        document.getElementById('sortSelect')?.addEventListener('change', (e) => {
            this.sortOrder = (e.target as HTMLSelectElement).value as SortOrder;
            this.renderHabitsGrid();
        });

        document.getElementById('openAddModalBtn')?.addEventListener('click', () => this.openHabitModal());
        document.getElementById('closeHabitModalBtn')?.addEventListener('click', () => this.closeHabitModal());
        document.getElementById('cancelHabitModalBtn')?.addEventListener('click', () => this.closeHabitModal());
        document.getElementById('habitForm')?.addEventListener('submit', (e) => this.handleHabitSubmit(e));

        document.getElementById('openAddCategoryBtn')?.addEventListener('click', () => this.openCategoryModal());
        document.getElementById('dropdownManageCategoriesBtn')?.addEventListener('click', () => this.openCategoryModal());
        document.getElementById('closeCategoryModalBtn')?.addEventListener('click', () => this.closeCategoryModal());
        document.getElementById('cancelCategoryModalBtn')?.addEventListener('click', () => this.closeCategoryModal());
        document.getElementById('categoryForm')?.addEventListener('submit', (e) => this.handleCategorySubmit(e));

        const categoryColorPicker = document.getElementById('categoryColorPickerGroup');
        if (categoryColorPicker) {
            categoryColorPicker.addEventListener('click', (e) => {
                const btn = (e.target as HTMLElement).closest('.color-option') as HTMLElement | null;
                if (!btn) return;
                categoryColorPicker.querySelectorAll('.color-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const catColorInput = document.getElementById('categoryColorInput') as HTMLInputElement | null;
                if (catColorInput) catColorInput.value = btn.dataset.color || '#4f46e5';
            });
        }

        const habitColorPicker = document.getElementById('colorPickerGroup');
        if (habitColorPicker) {
            habitColorPicker.addEventListener('click', (e) => {
                const btn = (e.target as HTMLElement).closest('.color-option') as HTMLElement | null;
                if (!btn) return;
                habitColorPicker.querySelectorAll('.color-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const habitColorInput = document.getElementById('habitColor') as HTMLInputElement | null;
                if (habitColorInput) habitColorInput.value = btn.dataset.color || '#4f46e5';
            });
        }

        document.getElementById('analyticsBtn')?.addEventListener('click', () => this.openAnalyticsModal());
        document.getElementById('closeAnalyticsModalBtn')?.addEventListener('click', () => this.closeAnalyticsModal());

        document.getElementById('dataMenuBtn')?.addEventListener('click', () => this.openDataModal());
        document.getElementById('closeDataModalBtn')?.addEventListener('click', () => this.closeDataModal());

        ['authModal', 'categoryModal', 'habitModal', 'analyticsModal', 'dataModal'].forEach(id => {
            const modal = document.getElementById(id);
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) modal.classList.remove('show');
                });
            }
        });

        document.getElementById('exportDataBtn')?.addEventListener('click', () => this.exportData());
        document.getElementById('loadDemoDataBtn')?.addEventListener('click', () => this.loadSampleData());
        document.getElementById('clearAllDataBtn')?.addEventListener('click', () => this.clearAllHabits());
        document.getElementById('importFileInput')?.addEventListener('change', (e) => this.importData(e as Event));
    }

    public openAuthModal(): void {
        document.getElementById('authModal')?.classList.add('show');
    }

    public closeAuthModal(): void {
        document.getElementById('authModal')?.classList.remove('show');
    }

    private handleLogin(e: Event): void {
        e.preventDefault();
        const email = (document.getElementById('loginEmail') as HTMLInputElement).value.trim();
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

    private handleSignUp(e: Event): void {
        e.preventDefault();
        const name = (document.getElementById('signUpName') as HTMLInputElement).value.trim();
        const email = (document.getElementById('signUpEmail') as HTMLInputElement).value.trim();
        const color = (document.getElementById('signUpAvatarColor') as HTMLInputElement).value;

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

    private handleGuestLogin(): void {
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

    private setupIconPicker(): void {
        const grid = document.getElementById('iconPickerGrid');
        if (!grid) return;

        const iconKeys = Object.keys(SVG_ICONS);
        grid.innerHTML = iconKeys.map((key, index) => `
            <button type="button" class="icon-picker-btn ${index === 0 ? 'active' : ''}" data-icon="${key}" title="${key}">
                ${SVG_ICONS[key]}
            </button>
        `).join('');

        grid.addEventListener('click', (e) => {
            const btn = (e.target as HTMLElement).closest('.icon-picker-btn') as HTMLElement | null;
            if (!btn || !btn.dataset.icon) return;
            grid.querySelectorAll('.icon-picker-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const iconKeyInput = document.getElementById('categoryIconKey') as HTMLInputElement | null;
            if (iconKeyInput) iconKeyInput.value = btn.dataset.icon;
        });
    }

    public openCategoryModal(categoryToEdit: CustomCategory | null = null): void {
        const modal = document.getElementById('categoryModal');
        const title = document.getElementById('categoryModalTitle');
        const form = document.getElementById('categoryForm') as HTMLFormElement | null;
        if (!modal || !form) return;

        form.reset();

        if (categoryToEdit) {
            if (title) title.textContent = 'Edit Category';
            (document.getElementById('editCategoryId') as HTMLInputElement).value = categoryToEdit.id;
            (document.getElementById('categoryNameInput') as HTMLInputElement).value = categoryToEdit.name;
            (document.getElementById('categoryIconKey') as HTMLInputElement).value = categoryToEdit.icon || 'target';
            (document.getElementById('categoryColorInput') as HTMLInputElement).value = categoryToEdit.color || '#4f46e5';

            document.querySelectorAll('#iconPickerGrid .icon-picker-btn').forEach(btn => {
                btn.classList.toggle('active', (btn as HTMLElement).dataset.icon === categoryToEdit.icon);
            });
            document.querySelectorAll('#categoryColorPickerGroup .color-option').forEach(btn => {
                btn.classList.toggle('active', (btn as HTMLElement).dataset.color === categoryToEdit.color);
            });
        } else {
            if (title) title.textContent = 'Create New Category';
            (document.getElementById('editCategoryId') as HTMLInputElement).value = '';
            (document.getElementById('categoryIconKey') as HTMLInputElement).value = 'target';
            (document.getElementById('categoryColorInput') as HTMLInputElement).value = '#4f46e5';
            document.querySelectorAll('#iconPickerGrid .icon-picker-btn').forEach((btn, idx) => {
                btn.classList.toggle('active', idx === 0);
            });
        }

        modal.classList.add('show');
        document.getElementById('categoryNameInput')?.focus();
    }

    public closeCategoryModal(): void {
        document.getElementById('categoryModal')?.classList.remove('show');
    }

    private handleCategorySubmit(e: Event): void {
        e.preventDefault();
        const editId = (document.getElementById('editCategoryId') as HTMLInputElement).value;
        const name = (document.getElementById('categoryNameInput') as HTMLInputElement).value.trim();
        const iconKey = (document.getElementById('categoryIconKey') as HTMLInputElement).value || 'target';
        const color = (document.getElementById('categoryColorInput') as HTMLInputElement).value || '#4f46e5';

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
            const newCat: CustomCategory = {
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

    public deleteCategory(id: string): void {
        const cat = this.categories.find(c => c.id === id);
        if (!cat) return;

        if (confirm(`Delete category "${cat.name}"? Habits in this category will move to "General".`)) {
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

    private setupStarterInspirations(): void {
        const list = document.getElementById('templateList');
        if (!list) return;

        list.innerHTML = [
            { name: 'Hydration 2L', category: 'Health & Fitness', desc: 'Drink 2+ litres of fresh water daily', icon: 'droplet', color: '#0284c7', freq: 'daily' as HabitFrequency },
            { name: 'Read 20 Mins', category: 'Learning', desc: 'Read tech articles or books', icon: 'book', color: '#4f46e5', freq: 'daily' as HabitFrequency },
            { name: 'Morning Workout', category: 'Health & Fitness', desc: 'Zone 2 cardio or strength session', icon: 'dumbbell', color: '#059669', freq: 'daily' as HabitFrequency },
            { name: 'Mindful Breathing', category: 'Mindfulness', desc: '10 min mindfulness or meditation', icon: 'feather', color: '#7c3aed', freq: 'daily' as HabitFrequency }
        ].map(item => `
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

    public addStarterInspiration(name: string): void {
        const templates: Record<string, { category: string; desc: string; icon: string; color: string; freq: HabitFrequency }> = {
            'Hydration 2L': { category: 'Health & Fitness', desc: 'Drink 2+ litres of fresh water daily', icon: 'droplet', color: '#0284c7', freq: 'daily' },
            'Read 20 Mins': { category: 'Learning', desc: 'Read tech articles or books', icon: 'book', color: '#4f46e5', freq: 'daily' },
            'Morning Workout': { category: 'Health & Fitness', desc: 'Zone 2 cardio or strength session', icon: 'dumbbell', color: '#059669', freq: 'daily' },
            'Mindful Breathing': { category: 'Mindfulness', desc: '10 min mindfulness or meditation', icon: 'feather', color: '#7c3aed', freq: 'daily' }
        };

        const template = templates[name];
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

        const newHabit: Habit = {
            id: Date.now(),
            name,
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

    public getTodayStr(): string {
        return new Date().toISOString().split('T')[0];
    }

    public getRolling7Days(): DayPillData[] {
        const days: DayPillData[] = [];
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

    public calculateStreak(habit: Habit): number {
        if (!habit.completions || habit.completions.length === 0) return 0;

        const uniqueDates = Array.from(new Set(habit.completions)).sort().reverse();
        const todayStr = this.getTodayStr();
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

        if (!uniqueDates.includes(todayStr) && !uniqueDates.includes(yesterdayStr)) return 0;

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

    public calculateBestStreak(habit: Habit): number {
        if (!habit.completions || habit.completions.length === 0) return 0;
        const sorted = Array.from(new Set(habit.completions)).sort();
        if (sorted.length === 0) return 0;

        let maxStreak = 1;
        let currentRun = 1;

        for (let i = 1; i < sorted.length; i++) {
            const prev = new Date(sorted[i - 1]);
            const curr = new Date(sorted[i]);
            const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                currentRun++;
                if (currentRun > maxStreak) maxStreak = currentRun;
            } else if (diffDays > 1) {
                currentRun = 1;
            }
        }
        return maxStreak;
    }

    public calculateConsistencyScore(): number {
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

    public render(): void {
        this.renderCategorySidebar();
        this.renderHabitCategorySelect();
        this.renderMetrics();
        this.renderHabitsGrid();
    }

    private renderCategorySidebar(): void {
        const container = document.getElementById('categoryFilters');
        if (!container) return;

        const counts: Record<string, number> = { all: this.habits.length };
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

    public setCategoryFilter(catName: string): void {
        this.selectedCategory = catName;
        this.renderCategorySidebar();
        this.renderHabitsGrid();
    }

    public editCategoryById(id: string): void {
        const cat = this.categories.find(c => c.id === id);
        if (cat) this.openCategoryModal(cat);
    }

    private renderHabitCategorySelect(): void {
        const select = document.getElementById('habitCategorySelect') as HTMLSelectElement | null;
        if (!select) return;

        select.innerHTML = this.categories.map(cat => `
            <option value="${cat.name}">${cat.name}</option>
        `).join('');
    }

    private renderMetrics(): void {
        const todayStr = this.getTodayStr();
        const total = this.habits.length;
        const completedToday = this.habits.filter(h => h.completions.includes(todayStr)).length;
        const progressPercent = total > 0 ? Math.round((completedToday / total) * 100) : 0;

        const todayProgressText = document.getElementById('todayProgressText');
        const todayCompletedText = document.getElementById('todayCompletedText');
        if (todayProgressText) todayProgressText.textContent = `${progressPercent}%`;
        if (todayCompletedText) todayCompletedText.textContent = `${completedToday} of ${total} completed`;

        const progressRing = document.getElementById('progressRingFill') as SVGCircleElement | null;
        if (progressRing) {
            const circumference = 163.36;
            const offset = circumference - (progressPercent / 100) * circumference;
            progressRing.style.strokeDashoffset = `${offset}`;
        }

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

        const totalLogs = this.habits.reduce((acc, h) => acc + (h.completions ? h.completions.length : 0), 0);
        const totalLogsEl = document.getElementById('totalCompletionsValue');
        if (totalLogsEl) totalLogsEl.textContent = totalLogs.toString();

        const consistency = this.calculateConsistencyScore();
        const weeklyScoreEl = document.getElementById('weeklyAdherenceValue');
        const weeklyScoreBar = document.getElementById('weeklyAdherenceBar') as HTMLElement | null;
        if (weeklyScoreEl) weeklyScoreEl.textContent = `${consistency}%`;
        if (weeklyScoreBar) weeklyScoreBar.style.width = `${consistency}%`;
    }

    public getFilteredHabits(): Habit[] {
        const todayStr = this.getTodayStr();

        return this.habits.filter(habit => {
            if (this.selectedCategory !== 'all' && habit.category !== this.selectedCategory) return false;
            if (this.selectedFrequency !== 'all' && habit.frequency !== this.selectedFrequency) return false;
            if (this.selectedStatus === 'pending' && habit.completions.includes(todayStr)) return false;
            if (this.selectedStatus === 'completed' && !habit.completions.includes(todayStr)) return false;
            if (this.searchQuery) {
                const nameMatch = habit.name.toLowerCase().includes(this.searchQuery);
                const descMatch = (habit.description || '').toLowerCase().includes(this.searchQuery);
                if (!nameMatch && !descMatch) return false;
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

    public renderHabitsGrid(): void {
        const grid = document.getElementById('habitsGrid');
        const countBadge = document.getElementById('habitCountBadge');
        if (!grid) return;

        const filtered = this.getFilteredHabits();
        if (countBadge) countBadge.textContent = filtered.length.toString();

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon-box">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                    </div>
                    <h3>${this.habits.length === 0 ? 'Your habit board is clean and ready' : 'No habits match your filters'}</h3>
                    <p>${this.habits.length === 0 ? 'Start tracking your daily goals, build momentum, and master consistency. Add your first habit or pick a starter idea.' : 'Try clearing your search or switching category filters to see your habits.'}</p>
                    <div class="empty-state-actions">
                        <button class="btn btn-primary" onclick="tracker.openHabitModal()">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            <span>Create First Habit</span>
                        </button>
                        ${this.habits.length === 0 ? `
                        <button class="btn btn-secondary" onclick="tracker.loadSampleData()">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            <span>Load Sample Habits</span>
                        </button>` : ''}
                    </div>
                </div>
            `;
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
                            <h3 class="habit-name">${habit.name}</h3>
                            ${habit.description ? `<p class="habit-desc">${habit.description}</p>` : ''}
                            <div class="habit-meta-row">
                                <span class="category-tag" style="--tag-bg: ${catObj.color}15; --tag-color: ${catObj.color};">
                                    ${iconSvg} ${habit.category}
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

                    <div class="strip-container">
                        <span class="strip-label">7-Day Consistency</span>
                        <div class="day-strip">
                            ${stripHtml}
                        </div>
                    </div>

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

    public toggleToday(habitId: number): void {
        const todayStr = this.getTodayStr();
        this.toggleDateCompletion(habitId, todayStr);
    }

    public toggleDateCompletion(habitId: number, dateStr: string): void {
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

    public openHabitModal(habitToEdit: Habit | null = null): void {
        const modal = document.getElementById('habitModal');
        const title = document.getElementById('modalTitle');
        const form = document.getElementById('habitForm') as HTMLFormElement | null;
        if (!modal || !form) return;

        form.reset();

        if (habitToEdit) {
            if (title) title.textContent = 'Edit Habit';
            (document.getElementById('editHabitId') as HTMLInputElement).value = habitToEdit.id.toString();
            (document.getElementById('habitName') as HTMLInputElement).value = habitToEdit.name;
            (document.getElementById('habitDescription') as HTMLInputElement).value = habitToEdit.description || '';
            (document.getElementById('habitCategorySelect') as HTMLSelectElement).value = habitToEdit.category;
            (document.getElementById('habitFrequency') as HTMLSelectElement).value = habitToEdit.frequency || 'daily';
            (document.getElementById('habitColor') as HTMLInputElement).value = habitToEdit.color || '#4f46e5';

            document.querySelectorAll('#colorPickerGroup .color-option').forEach(btn => {
                btn.classList.toggle('active', (btn as HTMLElement).dataset.color === habitToEdit.color);
            });
        } else {
            if (title) title.textContent = 'Create New Habit';
            (document.getElementById('editHabitId') as HTMLInputElement).value = '';
            (document.getElementById('habitColor') as HTMLInputElement).value = '#4f46e5';
            document.querySelectorAll('#colorPickerGroup .color-option').forEach((btn, idx) => {
                btn.classList.toggle('active', idx === 0);
            });
        }

        modal.classList.add('show');
        document.getElementById('habitName')?.focus();
    }

    public closeHabitModal(): void {
        document.getElementById('habitModal')?.classList.remove('show');
    }

    private handleHabitSubmit(e: Event): void {
        e.preventDefault();

        const editId = (document.getElementById('editHabitId') as HTMLInputElement).value;
        const name = (document.getElementById('habitName') as HTMLInputElement).value.trim();
        const description = (document.getElementById('habitDescription') as HTMLInputElement).value.trim();
        const category = (document.getElementById('habitCategorySelect') as HTMLSelectElement).value;
        const frequency = (document.getElementById('habitFrequency') as HTMLSelectElement).value as HabitFrequency;
        const color = (document.getElementById('habitColor') as HTMLInputElement).value;

        if (!name) return;

        if (editId) {
            const habit = this.habits.find(h => h.id === Number(editId));
            if (habit) {
                habit.name = name;
                habit.description = description;
                habit.category = category;
                habit.frequency = frequency;
                habit.color = color;
                this.showToast(`Updated habit "${name}"`, 'success');
            }
        } else {
            const newHabit: Habit = {
                id: Date.now(),
                name,
                description,
                category,
                frequency,
                color,
                createdAt: this.getTodayStr(),
                completions: []
            };
            this.habits.unshift(newHabit);
            this.showToast(`Created habit "${name}"!`, 'success');
            this.triggerConfetti();
        }

        this.saveHabits();
        this.closeHabitModal();
        this.render();
    }

    public editHabit(id: number): void {
        const habit = this.habits.find(h => h.id === id);
        if (habit) this.openHabitModal(habit);
    }

    public deleteHabit(id: number): void {
        const habit = this.habits.find(h => h.id === id);
        if (!habit) return;

        if (confirm(`Delete habit "${habit.name}"?`)) {
            this.habits = this.habits.filter(h => h.id !== id);
            this.saveHabits();
            this.render();
            this.showToast(`Deleted habit "${habit.name}"`);
        }
    }

    public loadSampleData(): void {
        const today = new Date();
        const getDateStr = (offset: number) => {
            const d = new Date(today);
            d.setDate(d.getDate() - offset);
            return d.toISOString().split('T')[0];
        };

        this.categories = [...DEFAULT_CATEGORIES];
        this.habits = [
            {
                id: 101,
                name: "Morning 5km Jog",
                description: "Zone 2 aerobic cardio before 8:00 AM",
                category: "Health & Fitness",
                frequency: "daily",
                color: "#059669",
                createdAt: getDateStr(30),
                completions: [
                    getDateStr(0), getDateStr(1), getDateStr(2), getDateStr(3),
                    getDateStr(4), getDateStr(5), getDateStr(7), getDateStr(8),
                    getDateStr(10), getDateStr(11), getDateStr(12), getDateStr(14)
                ]
            },
            {
                id: 102,
                name: "Read 25 Pages",
                description: "Software engineering & product design books",
                category: "Learning",
                frequency: "daily",
                color: "#0284c7",
                createdAt: getDateStr(25),
                completions: [
                    getDateStr(0), getDateStr(1), getDateStr(2), getDateStr(3),
                    getDateStr(4), getDateStr(5), getDateStr(6), getDateStr(7),
                    getDateStr(8), getDateStr(9), getDateStr(10), getDateStr(11)
                ]
            },
            {
                id: 103,
                name: "Deep Work Sprint (90m)",
                description: "Uninterrupted engineering flow state",
                category: "Productivity",
                frequency: "daily",
                color: "#4f46e5",
                createdAt: getDateStr(20),
                completions: [
                    getDateStr(0), getDateStr(1), getDateStr(2), getDateStr(3),
                    getDateStr(5), getDateStr(6), getDateStr(7), getDateStr(9)
                ]
            },
            {
                id: 104,
                name: "Mindful Meditation",
                description: "10 minutes box breathing & mental reset",
                category: "Mindfulness",
                frequency: "daily",
                color: "#7c3aed",
                createdAt: getDateStr(18),
                completions: [
                    getDateStr(1), getDateStr(2), getDateStr(3), getDateStr(4),
                    getDateStr(5), getDateStr(6), getDateStr(7)
                ]
            }
        ];

        this.saveCategories();
        this.saveHabits();
        this.render();
        this.closeDataModal();
        this.showToast('Loaded sample habit data!', 'success');
        this.triggerConfetti();
    }

    public clearAllHabits(): void {
        if (confirm('Are you sure you want to clear all habits? This action cannot be undone.')) {
            this.habits = [];
            this.saveHabits();
            this.render();
            this.closeDataModal();
            this.showToast('Cleared all habits.');
        }
    }

    public openDataModal(): void {
        document.getElementById('dataModal')?.classList.add('show');
    }

    public closeDataModal(): void {
        document.getElementById('dataModal')?.classList.remove('show');
    }

    public exportData(): void {
        const payload = {
            user: this.currentUser,
            categories: this.categories,
            habits: this.habits,
            exportedAt: new Date().toISOString()
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `habit-tracker-backup-${this.getTodayStr()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        this.showToast('Data exported successfully!', 'success');
    }

    public importData(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsed = JSON.parse(e.target?.result as string);
                if (parsed.habits && Array.isArray(parsed.habits)) {
                    this.habits = parsed.habits;
                    if (parsed.categories && Array.isArray(parsed.categories)) {
                        this.categories = parsed.categories;
                    }
                    this.saveCategories();
                    this.saveHabits();
                    this.render();
                    this.closeDataModal();
                    this.showToast('Backup restored successfully!', 'success');
                } else if (Array.isArray(parsed)) {
                    this.habits = parsed;
                    this.saveHabits();
                    this.render();
                    this.closeDataModal();
                    this.showToast('Habits imported!', 'success');
                }
            } catch (err) {
                alert('Invalid JSON file format.');
            }
        };
        reader.readAsText(file);
    }

    public openAnalyticsModal(): void {
        const modal = document.getElementById('analyticsModal');
        if (!modal) return;
        this.renderHeatmap();
        this.renderHabitBreakdown();
        modal.classList.add('show');
    }

    public closeAnalyticsModal(): void {
        document.getElementById('analyticsModal')?.classList.remove('show');
    }

    private renderHeatmap(): void {
        const container = document.getElementById('activityHeatmapGrid');
        if (!container) return;

        const cells: string[] = [];
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

    private renderHabitBreakdown(): void {
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
                        <span class="breakdown-title">${habit.name}</span>
                        <span class="breakdown-stats">Streak: ${streak}d | Best: ${bestStreak}d | ${habit.completions.length} check-ins</span>
                    </div>
                    <div class="breakdown-bar-track">
                        <div class="breakdown-bar-fill" style="width: ${completionRate}%; background-color: ${barColor};"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    private setupConfetti(): void {
        if (!this.canvas) return;
        const resize = () => {
            if (this.canvas) {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
            }
        };
        window.addEventListener('resize', resize);
        resize();
    }

    public triggerConfetti(): void {
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

    private animateConfetti(): void {
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

    public showToast(message: string, type: 'normal' | 'success' = 'normal'): void {
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

declare global {
    interface Window {
        tracker: HabitTrackerApp;
    }
}

const tracker = new HabitTrackerApp();
if (typeof window !== 'undefined') {
    window.tracker = tracker;
}