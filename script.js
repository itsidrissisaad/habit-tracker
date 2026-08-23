// Motivational quotes
const quotes = [
    "Stay disciplined, stay strong.",
    "Small steps lead to big changes.",
    "Progress, not perfection.",
    "You got this!",
    "Consistency is key.",
    "Believe in yourself.",
    "Make it a habit, not a chore.",
    "Your future self will thank you."
];

// Get random quote
function getRandomQuote() {
    return quotes[Math.floor(Math.random() * quotes.length)];
}

// Display random quote on page load
document.getElementById('quote').textContent = getRandomQuote();

// DOM Elements
const addHabitBtn = document.getElementById('addHabitBtn');
const habitForm = document.getElementById('habitForm');
const cancelBtn = document.getElementById('cancelBtn');
const habitNameInput = document.getElementById('habitName');
const habitDescriptionInput = document.getElementById('habitDescription');
const habitFrequencySelect = document.getElementById('habitFrequency');
const habitsList = document.getElementById('habitsList');
const analyticsBtn = document.getElementById('analyticsBtn');
const analyticsModal = document.getElementById('analyticsModal');
const closeAnalyticsBtn = document.getElementById('closeAnalyticsBtn');

// Local Storage: habits array
let habits = JSON.parse(localStorage.getItem('habits')) || [];

// Show/Hide form
addHabitBtn.addEventListener('click', () => {
    habitForm.classList.remove('hidden');
});

cancelBtn.addEventListener('click', () => {
    habitForm.classList.add('hidden');
    habitForm.reset();
});

// Add new habit
habitForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = habitNameInput.value.trim();
    const description = habitDescriptionInput.value.trim();
    const frequency = habitFrequencySelect.value;

    if (!name || !frequency) {
        alert('Please fill in all required fields');
        return;
    }

    const newHabit = {
        id: Date.now(),
        name,
        description,
        frequency,
        createdAt: new Date().toISOString(),
        completions: [] // Array of dates when habit was completed
    };

    habits.push(newHabit);
    saveHabits();
    renderHabits();

    habitForm.reset();
    habitForm.classList.add('hidden');
});

// Save habits to localStorage
function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

// Render all habits
function renderHabits() {
    habitsList.innerHTML = '';

    if (habits.length === 0) {
        habitsList.innerHTML = '<p class="empty-state">No habits yet. Click "+ Add New Habit" to get started!</p>';
        return;
    }

    habits.forEach(habit => {
        const today = new Date().toISOString().split('T')[0];
        const isCompletedToday = habit.completions.includes(today);
        const streak = calculateStreak(habit);

        const habitItem = document.createElement('div');
        habitItem.className = 'habit-item';
        habitItem.innerHTML = `
            <div class="habit-info">
                <h3>${habit.name}</h3>
                ${habit.description ? `<p>${habit.description}</p>` : ''}
                <p style="font-size: 0.85em; color: #999; margin-top: 5px;">Frequency: ${habit.frequency}</p>
            </div>
            <div class="habit-stats">
                <div class="streak">
                    <span>${streak}</span>
                    <div class="streak-label">day streak</div>
                </div>
            </div>
            <div class="habit-actions">
                <button class="btn-check ${isCompletedToday ? 'completed' : ''}" data-id="${habit.id}">
                    ${isCompletedToday ? '✅ Done' : '📝 Check In'}
                </button>
                <button class="btn-delete" data-id="${habit.id}">🗑️ Delete</button>
            </div>
        `;

        habitsList.appendChild(habitItem);
    });

    // Add event listeners for check and delete buttons
    document.querySelectorAll('.btn-check').forEach(btn => {
        btn.addEventListener('click', handleCheckHabit);
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', handleDeleteHabit);
    });
}

// Handle check-in
function handleCheckHabit(e) {
    const habitId = parseInt(e.target.dataset.id);
    const habit = habits.find(h => h.id === habitId);

    if (!habit) return;

    const today = new Date().toISOString().split('T')[0];

    if (habit.completions.includes(today)) {
        // Remove completion if already done today
        habit.completions = habit.completions.filter(date => date !== today);
    } else {
        // Add completion for today
        habit.completions.push(today);
    }

    saveHabits();
    renderHabits();
}

// Handle delete
function handleDeleteHabit(e) {
    const habitId = parseInt(e.target.dataset.id);

    if (confirm('Are you sure you want to delete this habit?')) {
        habits = habits.filter(h => h.id !== habitId);
        saveHabits();
        renderHabits();
    }
}

// Calculate current streak
function calculateStreak(habit) {
    if (habit.completions.length === 0) return 0;

    // Sort completions in descending order
    const sorted = [...habit.completions].sort().reverse();

    let streak = 0;
    let currentDate = new Date();

    for (let i = 0; i < sorted.length; i++) {
        const completionDate = new Date(sorted[i]);
        const expectedDate = new Date(currentDate);
        expectedDate.setDate(expectedDate.getDate() - i);

        const completionDateStr = completionDate.toISOString().split('T')[0];
        const expectedDateStr = expectedDate.toISOString().split('T')[0];

        if (completionDateStr === expectedDateStr) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}

// Analytics Modal
analyticsBtn.addEventListener('click', () => {
    displayAnalytics();
    analyticsModal.classList.remove('hidden');
});

closeAnalyticsBtn.addEventListener('click', () => {
    analyticsModal.classList.add('hidden');
});

// Close modal when clicking outside
analyticsModal.addEventListener('click', (e) => {
    if (e.target === analyticsModal) {
        analyticsModal.classList.add('hidden');
    }
});

// Display analytics
function displayAnalytics() {
    const analyticsDetails = document.getElementById('analyticsDetails');
    analyticsDetails.innerHTML = '';

    if (habits.length === 0) {
        analyticsDetails.innerHTML = '<p class="empty-state">No habits to analyze yet.</p>';
        return;
    }

    habits.forEach(habit => {
        const streak = calculateStreak(habit);
        const completionRate = calculateCompletionRate(habit);
        const weeklyData = getWeeklyData(habit);

        const habitAnalytics = document.createElement('div');
        habitAnalytics.style.marginBottom = '30px';
        habitAnalytics.innerHTML = `
            <h3>${habit.name}</h3>
            <div class="stat">
                <div class="stat-label">Current Streak</div>
                <div class="stat-value">${streak} days</div>
            </div>
            <div class="stat">
                <div class="stat-label">Total Completions</div>
                <div class="stat-value">${habit.completions.length}</div>
            </div>
            <div class="stat">
                <div class="stat-label">Completion Rate (This Month)</div>
                <div class="stat-value">${completionRate}%</div>
            </div>
            <div class="stat">
                <div class="stat-label">This Week</div>
                <div class="week-grid">
                    ${weeklyData.map(day => `
                        <div class="day">
                            <div class="day-label">${day.label}</div>
                            <div class="day-status">${day.completed ? '✅' : '❌'}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        analyticsDetails.appendChild(habitAnalytics);
    });
}

// Calculate completion rate for current month
function calculateCompletionRate(habit) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const completionsThisMonth = habit.completions.filter(date => {
        const d = new Date(date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    return Math.round((completionsThisMonth / daysInMonth) * 100);
}

// Get weekly data (last 7 days)
function getWeeklyData(habit) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayIndex = date.getDay();

        weekData.push({
            label: days[dayIndex],
            completed: habit.completions.includes(dateStr)
        });
    }

    return weekData;
}

// Initial render
renderHabits();