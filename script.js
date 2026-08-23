/**
 * Orbit Habit Tracker
 * Professional Vanilla JS / TypeScript Application
 */

// Category Definitions with color themes and icons
const CATEGORIES = {
    'Health': { icon: '🏃', color: '#059669', bg: '#ecfdf5' },
    'Productivity': { icon: '💼', color: '#4f46e5', bg: '#eef2ff' },
    'Learning': { icon: '📚', color: '#0284c7', bg: '#f0f9ff' },
    'Mindfulness': { icon: '🧘', color: '#7c3aed', bg: '#f5f3ff' },
    'Finance': { icon: '💰', color: '#d97706', bg: '#fffbeb' },
    'Lifestyle': { icon: '✨', color: '#e11d48', bg: '#fff1f2' }
};

// Inspirational Quotes
const MOTIVATIONAL_QUOTES = [
    '"We are what we repeatedly do. Excellence, then, is not an act, but a habit."',
    '"Small disciplines repeated with consistency every day lead to great achievements."',
    '"Success is the sum of small efforts repeated day in and day out."',
    '"Motivation gets you going, but discipline keeps you growing."',
    '"Focus on the process, and the results will naturally follow."'
];

// Curated Demo Data for instant presentation
function generateDemoHabits() {
    const today = new Date();
    const getDateStr = (offsetDays) => {
        const d = new Date(today);
        d.setDate(d.getDate() - offsetDays);
        return d.toISOString().split('T')[0];
    };

    return [
        {
            id: 101,
            name: "Morning 5km Run",
            description: "Zone 2 aerobic cardio before 8:00 AM",
            category: "Health",
            frequency: "daily",
            color: "#059669",
            createdAt: getDateStr(30),
            completions: [
                getDateStr(0), getDateStr(1), getDateStr(2), getDateStr(3),
                getDateStr(4), getDateStr(5), getDateStr(7), getDateStr(8),
                getDateStr(10), getDateStr(11), getDateStr(12), getDateStr(14),
                getDateStr(15), getDateStr(16), getDateStr(18), getDateStr(19)
            ]
        },
        {
            id: 102,
            name: "Read 25 Pages",
            description: "Software design patterns & tech articles",
            category: "Learning",
            frequency: "daily",
            color: "#0284c7",
            createdAt: getDateStr(25),
            completions: [
                getDateStr(0), getDateStr(1), getDateStr(2), getDateStr(3),
                getDateStr(4), getDateStr(5), getDateStr(6), getDateStr(7),
                getDateStr(8), getDateStr(9), getDateStr(10), getDateStr(11),
                getDateStr(12), getDateStr(13), getDateStr(14)
            ]
        },
        {
            id: 103,
            name: "Deep Work Block (90 min)",
            description: "Uninterrupted engineering flow state",
            category: "Productivity",
            frequency: "daily",
            color: "#4f46e5",
            createdAt: getDateStr(20),
            completions: [
                getDateStr(0), getDateStr(1), getDateStr(2), getDateStr(3),
                getDateStr(5), getDateStr(6), getDateStr(7), getDateStr(9),
                getDateStr(10), getDateStr(12)
            ]
        },
        {
            id: 104,
            name: "Daily Mindfulness & Meditation",
            description: "10 minutes box breathing & mental reset",
            category: "Mindfulness",
            frequency: "daily",
            color: "#7c3aed",
            createdAt: getDateStr(18),
            completions: [
                getDateStr(1), getDateStr(2), getDateStr(3), getDateStr(4),
                getDateStr(5), getDateStr(6), getDateStr(7), getDateStr(8)
            ]
        }
    ];
}

class OrbitHabitTracker {
    constructor() {
        this.habits = [];
        this.selectedCategory = 'all';
        this.selectedFrequency = 'all';
        this.selectedStatus = 'all';
        this.searchQuery = '';
        this.sortOrder = 'streak';
        this.storageKey = 'orbit_habits_v2';
        this.canvas = document.getElementById('confettiCanvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.confettiParticles = [];
        this.animationId = null;

        this.init();
    }

    init() {
        this.loadHabits();
        this.setupGreeting();
        this.setupEventListeners();
        this.setupConfetti();
        this.render();
    }

    /* --------------------------------------------------------------------------
       STORAGE & DATA MANAGEMENT
       -------------------------------------------------------------------------- */
    loadHabits() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (raw) {
                this.habits = JSON.parse(raw);
            } else {
                this.habits = generateDemoHabits();
                this.saveHabits();
            }
        } catch (e) {
            console.error("Failed to parse habits from storage", e);
            this.habits = generateDemoHabits();
        }
    }

    saveHabits() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.habits));
        } catch (e) {
            console.error("Failed to save habits to storage", e);
        }
    }

    /* --------------------------------------------------------------------------
       UI INITIALIZATION & GREETINGS
       -------------------------------------------------------------------------- */
    setupGreeting() {
        const hour = new Date().getHours();
        let greeting = "Good morning";
        if (hour >= 12 && hour < 17) greeting = "Good afternoon";
        else if (hour >= 17) greeting = "Good evening";

        const greetingEl = document.getElementById('greetingTime');
        if (greetingEl) greetingEl.textContent = `${greeting}, Ready to build habits?`;

        const quoteEl = document.getElementById('headerQuote');
        if (quoteEl) {
            quoteEl.textContent = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
        }
    }

    setupEventListeners() {
        // Search Input
        const searchInput = document.getElementById('searchInput');
        const clearSearchBtn = document.getElementById('clearSearchBtn');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                if (clearSearchBtn) {
                    clearSearchBtn.style.display = this.searchQuery ? 'block' : 'none';
                }
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

        // Frequency Filter Buttons
        const freqContainer = document.getElementById('frequencyFilters');
        if (freqContainer) {
            freqContainer.addEventListener('click', (e) => {
                const target = e.target.closest('.filter-pill');
                if (!target) return;
                freqContainer.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
                target.classList.add('active');
                this.selectedFrequency = target.dataset.freq || 'all';
                this.renderHabitsGrid();
            });
        }

        // Status Segmented Control
        const statusControl = document.getElementById('statusFilterControl');
        if (statusControl) {
            statusControl.addEventListener('click', (e) => {
                const target = e.target.closest('.segment-btn');
                if (!target) return;
                statusControl.querySelectorAll('.segment-btn').forEach(btn => btn.classList.remove('active'));
                target.classList.add('active');
                this.selectedStatus = target.dataset.status || 'all';
                this.renderHabitsGrid();
            });
        }

        // Sort Select Dropdown
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortOrder = e.target.value;
                this.renderHabitsGrid();
            });
        }

        // Quick Template Cards
        const templateList = document.getElementById('templateList');
        if (templateList) {
            templateList.addEventListener('click', (e) => {
                const card = e.target.closest('.template-card');
                if (!card) return;
                this.handleTemplateAdd(card.dataset.template);
            });
        }

        // Modals & Triggers
        document.getElementById('openAddModalBtn')?.addEventListener('click', () => this.openHabitModal());
        document.getElementById('closeHabitModalBtn')?.addEventListener('click', () => this.closeHabitModal());
        document.getElementById('cancelHabitModalBtn')?.addEventListener('click', () => this.closeHabitModal());

        document.getElementById('analyticsBtn')?.addEventListener('click', () => this.openAnalyticsModal());
        document.getElementById('closeAnalyticsModalBtn')?.addEventListener('click', () => this.closeAnalyticsModal());

        document.getElementById('dataMenuBtn')?.addEventListener('click', () => this.openDataModal());
        document.getElementById('closeDataModalBtn')?.addEventListener('click', () => this.closeDataModal());

        // Close on background click
        ['habitModal', 'analyticsModal', 'dataModal'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('click', (e) => {
                    if (e.target === el) {
                        el.classList.remove('show');
                    }
                });
            }
        });

        // Add / Edit Habit Form
        const form = document.getElementById('habitForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleHabitSubmit(e));
        }

        // Color Picker Options
        const colorPickerGroup = document.getElementById('colorPickerGroup');
        if (colorPickerGroup) {
            colorPickerGroup.addEventListener('click', (e) => {
                const btn = e.target.closest('.color-option');
                if (!btn) return;
                colorPickerGroup.querySelectorAll('.color-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const colorInput = document.getElementById('habitColor');
                if (colorInput) colorInput.value = btn.dataset.color || '#4f46e5';
            });
        }

        // Data actions
        document.getElementById('exportDataBtn')?.addEventListener('click', () => this.exportData());
        document.getElementById('loadDemoDataBtn')?.addEventListener('click', () => this.resetDemoData());
        document.getElementById('importFileInput')?.addEventListener('change', (e) => this.importData(e));
    }

    /* --------------------------------------------------------------------------
       CALCULATION HELPERS & METRICS
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

        // If not completed today or yesterday, streak is 0
        if (!uniqueDates.includes(todayStr) && !uniqueDates.includes(yesterdayStr)) {
            return 0;
        }

        let streak = 0;
        let checkDate = new Date();
        if (!uniqueDates.includes(todayStr)) {
            checkDate = yesterdayDate;
        }

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
        let totalPossible = this.habits.length * 7;
        let totalCompleted = 0;

        this.habits.forEach(habit => {
            rollingDays.forEach(day => {
                if (habit.completions.includes(day.dateStr)) {
                    totalCompleted++;
                }
            });
        });

        return Math.round((totalCompleted / totalPossible) * 100);
    }

    /* --------------------------------------------------------------------------
       RENDER METHODS
       -------------------------------------------------------------------------- */
    render() {
        this.renderCategoryFilters();
        this.renderMetrics();
        this.renderHabitsGrid();
    }

    renderCategoryFilters() {
        const container = document.getElementById('categoryFilters');
        if (!container) return;

        // Calculate counts
        const counts = { all: this.habits.length };
        Object.keys(CATEGORIES).forEach(cat => {
            counts[cat] = this.habits.filter(h => h.category === cat).length;
        });

        const categoriesList = [
            { key: 'all', label: 'All Habits', icon: '🌟' },
            ...Object.keys(CATEGORIES).map(k => ({
                key: k,
                label: k,
                icon: CATEGORIES[k].icon
            }))
        ];

        container.innerHTML = categoriesList.map(cat => `
            <button class="category-btn ${this.selectedCategory === cat.key ? 'active' : ''}" data-category="${cat.key}">
                <div class="category-btn-left">
                    <span>${cat.icon}</span>
                    <span>${cat.label}</span>
                </div>
                <span class="category-pill-count">${counts[cat.key] || 0}</span>
            </button>
        `).join('');

        container.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectedCategory = btn.dataset.category || 'all';
                this.renderCategoryFilters();
                this.renderHabitsGrid();
            });
        });
    }

    renderMetrics() {
        const todayStr = this.getTodayStr();
        const total = this.habits.length;
        const completedToday = this.habits.filter(h => h.completions.includes(todayStr)).length;
        const progressPercent = total > 0 ? Math.round((completedToday / total) * 100) : 0;

        // Today's Progress Card
        const todayProgressText = document.getElementById('todayProgressText');
        const todayCompletedText = document.getElementById('todayCompletedText');
        if (todayProgressText) todayProgressText.textContent = `${progressPercent}%`;
        if (todayCompletedText) todayCompletedText.textContent = `${completedToday} of ${total} habits`;

        // SVG Radial Ring calculation: stroke-dasharray is 163.36 (2 * PI * 26)
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
        if (bestStreakNameEl) bestStreakNameEl.textContent = bestStreak > 0 ? `Leading: ${bestStreakHabitName}` : 'Complete a habit to start!';

        // Total All-Time Completions
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

        return this.habits.filter(habit => {
            // Category match
            if (this.selectedCategory !== 'all' && habit.category !== this.selectedCategory) {
                return false;
            }
            // Frequency match
            if (this.selectedFrequency !== 'all' && habit.frequency !== this.selectedFrequency) {
                return false;
            }
            // Status match
            if (this.selectedStatus === 'pending' && habit.completions.includes(todayStr)) {
                return false;
            }
            if (this.selectedStatus === 'completed' && !habit.completions.includes(todayStr)) {
                return false;
            }
            // Search Query
            if (this.searchQuery) {
                const nameMatch = habit.name.toLowerCase().includes(this.searchQuery);
                const descMatch = (habit.description || '').toLowerCase().includes(this.searchQuery);
                if (!nameMatch && !descMatch) return false;
            }
            return true;
        }).sort((a, b) => {
            if (this.sortOrder === 'streak') {
                return this.calculateStreak(b) - this.calculateStreak(a);
            }
            if (this.sortOrder === 'name') {
                return a.name.localeCompare(b.name);
            }
            if (this.sortOrder === 'category') {
                return (a.category || '').localeCompare(b.category || '');
            }
            if (this.sortOrder === 'rate') {
                return (b.completions?.length || 0) - (a.completions?.length || 0);
            }
            if (this.sortOrder === 'newest') {
                return b.id - a.id;
            }
            return 0;
        });
    }

    renderHabitsGrid() {
        const grid = document.getElementById('habitsGrid');
        const countBadge = document.getElementById('habitCountBadge');
        if (!grid) return;

        const filtered = this.getFilteredHabits();
        if (countBadge) countBadge.textContent = filtered.length.toString();

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">✨</div>
                    <h3>No matching habits found</h3>
                    <p>Try adjusting your search query, selecting another category, or add a fresh habit to track!</p>
                    <button class="btn btn-primary" onclick="tracker.openHabitModal()">+ Create New Habit</button>
                </div>
            `;
            return;
        }

        const todayStr = this.getTodayStr();
        const rollingDays = this.getRolling7Days();

        grid.innerHTML = filtered.map(habit => {
            const isCompletedToday = habit.completions.includes(todayStr);
            const streak = this.calculateStreak(habit);
            const catInfo = CATEGORIES[habit.category] || { icon: '✨', color: '#4f46e5', bg: '#eef2ff' };
            const cardAccent = habit.color || catInfo.color;

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
                            <h3 class="habit-name">${habit.name}</h3>
                            ${habit.description ? `<p class="habit-desc">${habit.description}</p>` : ''}
                            <div class="habit-meta-row">
                                <span class="category-tag" style="--tag-bg: ${catInfo.bg}; --tag-color: ${catInfo.color};">
                                    ${catInfo.icon} ${habit.category}
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
                            <span class="flame-icon-box">🔥</span>
                            <div class="streak-text-group">
                                <span class="streak-count">${streak} ${streak === 1 ? 'day' : 'days'}</span>
                                <span class="streak-sub">${habit.completions.length} total logs</span>
                            </div>
                        </div>

                        <button class="check-in-btn ${isCompletedToday ? 'checked' : ''}" 
                                onclick="tracker.toggleToday(${habit.id}, event)">
                            ${isCompletedToday ? '✓ Done' : '+ Check In'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    /* --------------------------------------------------------------------------
       HABIT ACTIONS & INTERACTIONS
       -------------------------------------------------------------------------- */
    toggleToday(habitId, event) {
        const todayStr = this.getTodayStr();
        this.toggleDateCompletion(habitId, todayStr, event);
    }

    toggleDateCompletion(habitId, dateStr, event) {
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return;

        const index = habit.completions.indexOf(dateStr);
        const wasCompleted = index > -1;

        if (wasCompleted) {
            habit.completions.splice(index, 1);
            this.showToast(`Unchecked "${habit.name}" for ${dateStr}`);
        } else {
            habit.completions.push(dateStr);
            this.showToast(`✓ Marked "${habit.name}" complete!`, 'success');
            // Trigger confetti effect
            this.triggerConfetti();
        }

        this.saveHabits();
        this.render();
    }

    handleTemplateAdd(templateKey) {
        const templates = {
            'water': { name: 'Hydration 2L', category: 'Health', desc: 'Drink at least 2 litres of fresh water', color: '#0284c7' },
            'read': { name: 'Read 20 Pages', category: 'Learning', desc: 'Non-fiction books or engineering articles', color: '#4f46e5' },
            'workout': { name: 'Morning Workout', category: 'Health', desc: 'Strength training or cardio session', color: '#059669' },
            'meditate': { name: 'Mindful Meditation', category: 'Mindfulness', desc: '10 min mindful breathing & calm focus', color: '#7c3aed' }
        };

        const template = templates[templateKey];
        if (!template) return;

        const newHabit = {
            id: Date.now(),
            name: template.name,
            description: template.desc,
            category: template.category,
            frequency: 'daily',
            color: template.color,
            createdAt: this.getTodayStr(),
            completions: [this.getTodayStr()]
        };

        this.habits.unshift(newHabit);
        this.saveHabits();
        this.render();
        this.showToast(`Added template: "${newHabit.name}"`, 'success');
        this.triggerConfetti();
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
            document.getElementById('habitCategory').value = habitToEdit.category || 'Health';
            document.getElementById('habitFrequency').value = habitToEdit.frequency || 'daily';
            document.getElementById('habitColor').value = habitToEdit.color || '#4f46e5';

            // Select color button
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

    closeHabitModal() {
        const modal = document.getElementById('habitModal');
        if (modal) modal.classList.remove('show');
    }

    handleHabitSubmit(e) {
        e.preventDefault();

        const editId = document.getElementById('editHabitId').value;
        const name = document.getElementById('habitName').value.trim();
        const description = document.getElementById('habitDescription').value.trim();
        const category = document.getElementById('habitCategory').value;
        const frequency = document.getElementById('habitFrequency').value;
        const color = document.getElementById('habitColor').value;

        if (!name) return;

        if (editId) {
            // Update
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
            // Create
            const newHabit = {
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
            this.showToast(`Created new habit "${name}"!`, 'success');
            this.triggerConfetti();
        }

        this.saveHabits();
        this.closeHabitModal();
        this.render();
    }

    editHabit(id) {
        const habit = this.habits.find(h => h.id === id);
        if (habit) {
            this.openHabitModal(habit);
        }
    }

    deleteHabit(id) {
        const habit = this.habits.find(h => h.id === id);
        if (!habit) return;

        if (confirm(`Are you sure you want to delete "${habit.name}"?`)) {
            this.habits = this.habits.filter(h => h.id !== id);
            this.saveHabits();
            this.render();
            this.showToast(`Deleted habit "${habit.name}"`);
        }
    }

    /* --------------------------------------------------------------------------
       DETAILED ANALYTICS & HEATMAP MODAL
       -------------------------------------------------------------------------- */
    openAnalyticsModal() {
        const modal = document.getElementById('analyticsModal');
        if (!modal) return;

        this.renderHeatmap();
        this.renderHabitBreakdown();
        modal.classList.add('show');
    }

    closeAnalyticsModal() {
        const modal = document.getElementById('analyticsModal');
        if (modal) modal.classList.remove('show');
    }

    renderHeatmap() {
        const container = document.getElementById('activityHeatmapGrid');
        if (!container) return;

        const cells = [];
        const today = new Date();

        // 30 Days back
        for (let i = 29; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            // Count how many habits were completed on this date
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
            container.innerHTML = `<p style="color: var(--text-light); text-align: center; padding: 20px;">No habit data available</p>`;
            return;
        }

        container.innerHTML = this.habits.map(habit => {
            const streak = this.calculateStreak(habit);
            const bestStreak = this.calculateBestStreak(habit);
            const completionRate = Math.min(100, Math.round((habit.completions.length / 30) * 100));
            const catInfo = CATEGORIES[habit.category] || { color: '#4f46e5' };
            const barColor = habit.color || catInfo.color;

            return `
                <div class="breakdown-item">
                    <div class="breakdown-top">
                        <span class="breakdown-title">${habit.name}</span>
                        <span class="breakdown-stats">Streak: ${streak}d | Best: ${bestStreak}d | ${habit.completions.length} logs</span>
                    </div>
                    <div class="breakdown-bar-track">
                        <div class="breakdown-bar-fill" style="width: ${completionRate}%; background-color: ${barColor};"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /* --------------------------------------------------------------------------
       DATA BACKUP & RESTORE
       -------------------------------------------------------------------------- */
    openDataModal() {
        const modal = document.getElementById('dataModal');
        if (modal) modal.classList.add('show');
    }

    closeDataModal() {
        const modal = document.getElementById('dataModal');
        if (modal) modal.classList.remove('show');
    }

    exportData() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.habits, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `orbit-habits-backup-${this.getTodayStr()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        this.showToast('Data exported successfully!', 'success');
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsed = JSON.parse(e.target.result);
                if (Array.isArray(parsed)) {
                    this.habits = parsed;
                    this.saveHabits();
                    this.render();
                    this.closeDataModal();
                    this.showToast('Data imported successfully!', 'success');
                } else {
                    alert('Invalid file format. JSON array expected.');
                }
            } catch (err) {
                alert('Failed to parse JSON backup file.');
            }
        };
        reader.readAsText(file);
    }

    resetDemoData() {
        if (confirm('Reset your habit list with fresh sample data?')) {
            this.habits = generateDemoHabits();
            this.saveHabits();
            this.render();
            this.closeDataModal();
            this.showToast('Reset to demo habits!', 'success');
            this.triggerConfetti();
        }
    }

    /* --------------------------------------------------------------------------
       CONFETTI CANVAS ANIMATION
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
        const numParticles = 60;

        for (let i = 0; i < numParticles; i++) {
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

        if (!this.animationId) {
            this.animateConfetti();
        }
    }

    animateConfetti() {
        if (!this.ctx || !this.canvas) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
            const p = this.confettiParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.35; // Gravity
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

// Instantiate global tracker
const tracker = new OrbitHabitTracker();
