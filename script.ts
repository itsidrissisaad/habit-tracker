interface Habit {
    id: number;
    name: string;
    description: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    createdAt: string;
    completions: string[];
}

class HabitTracker {
    private habits: Habit[] = [];
    private readonly storageKey = 'habits';
    private readonly quotes = [
        'Stay consistent',
        'Small steps, big changes',
        'Progress over perfection',
        'You got this!',
        'Consistency is key'
    ];

    constructor() {
        this.init();
    }

    private init(): void {
        this.loadHabits();
        this.setupEventListeners();
        this.displayQuote();
        this.render();
    }

    private setupEventListeners(): void {
        const form = document.getElementById('habitForm') as HTMLFormElement;
        const detailedBtn = document.getElementById('detailedAnalyticsBtn') as HTMLButtonElement;
        const closeBtn = document.getElementById('closeModalBtn') as HTMLButtonElement;
        const modal = document.getElementById('analyticsModal') as HTMLDivElement;

        form.addEventListener('submit', (e) => this.addHabit(e));
        detailedBtn.addEventListener('click', () => this.showDetailedAnalytics());
        closeBtn.addEventListener('click', () => this.closeModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });
    }

    private displayQuote(): void {
        const quote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
        const navQuote = document.getElementById('navQuote') as HTMLDivElement;
        navQuote.textContent = quote;
    }

    private addHabit(e: Event): void {
        e.preventDefault();

        const nameInput = document.getElementById('habitName') as HTMLInputElement;
        const descInput = document.getElementById('habitDescription') as HTMLInputElement;
        const freqSelect = document.getElementById('habitFrequency') as HTMLSelectElement;

        const name = nameInput.value.trim();
        const description = descInput.value.trim();
        const frequency = freqSelect.value as 'daily' | 'weekly' | 'monthly';

        if (!name || !frequency) {
            alert('Please fill in required fields');
            return;
        }

        const habit: Habit = {
            id: Date.now(),
            name,
            description,
            frequency,
            createdAt: new Date().toISOString(),
            completions: []
        };

        this.habits.push(habit);
        this.saveHabits();
        this.render();

        (e.target as HTMLFormElement).reset();
    }

    private deleteHabit(id: number): void {
        if (confirm('Delete this habit?')) {
            this.habits = this.habits.filter(h => h.id !== id);
            this.saveHabits();
            this.render();
        }
    }

    private toggleCompletion(id: number): void {
        const habit = this.habits.find(h => h.id === id);
        if (!habit) return;

        const today = new Date().toISOString().split('T')[0];
        const index = habit.completions.indexOf(today);

        if (index > -1) {
            habit.completions.splice(index, 1);
        } else {
            habit.completions.push(today);
        }

        this.saveHabits();
        this.render();
    }

    private calculateStreak(habit: Habit): number {
        if (habit.completions.length === 0) return 0;

        const sorted = [...habit.completions].sort().reverse();
        let streak = 0;
        let currentDate = new Date();

        for (let i = 0; i < sorted.length; i++) {
            const completionDate = new Date(sorted[i]);
            const expectedDate = new Date(currentDate);
            expectedDate.setDate(expectedDate.getDate() - i);

            const completionStr = completionDate.toISOString().split('T')[0];
            const expectedStr = expectedDate.toISOString().split('T')[0];

            if (completionStr === expectedStr) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    private getWeeklyData(habit: Habit): Array<{ label: string; completed: boolean }> {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weekData: Array<{ label: string; completed: boolean }> = [];

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

    private render(): void {
        this.renderHabitsGrid();
        this.updateStats();
    }

    private renderHabitsGrid(): void {
        const grid = document.getElementById('habitsGrid') as HTMLDivElement;

        if (this.habits.length === 0) {
            grid.innerHTML = '<div class="empty-state"><p>No habits yet. Add one to get started!</p></div>';
            return;
        }

        grid.innerHTML = this.habits.map(habit => {
            const today = new Date().toISOString().split('T')[0];
            const isCompletedToday = habit.completions.includes(today);
            const streak = this.calculateStreak(habit);

            return `
                <div class="habit-card">
                    <div class="habit-card-header">
                        <div>
                            <div class="habit-card-title">${habit.name}</div>
                            ${habit.description ? `<div class="habit-card-desc">${habit.description}</div>` : ''}
                        </div>
                        <span class="habit-card-freq">${habit.frequency}</span>
                    </div>

                    <div class="habit-card-stats">
                        <div class="stat-mini">
                            <div class="stat-mini-label">Streak</div>
                            <div class="stat-mini-value">${streak}</div>
                        </div>
                        <div class="stat-mini">
                            <div class="stat-mini-label">Total</div>
                            <div class="stat-mini-value">${habit.completions.length}</div>
                        </div>
                    </div>

                    <div class="habit-card-actions">
                        <button class="btn btn-${isCompletedToday ? 'secondary' : 'success'}" 
                                onclick="tracker.toggleCompletion(${habit.id})">
                            ${isCompletedToday ? '✓ Done' : '+ Check'}
                        </button>
                        <button class="btn btn-danger" onclick="tracker.deleteHabit(${habit.id})">
                            Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    private updateStats(): void {
        const today = new Date().toISOString().split('T')[0];
        const completedToday = this.habits.filter(h => h.completions.includes(today)).length;
        const avgStreak = this.habits.length > 0 
            ? Math.round(this.habits.reduce((sum, h) => sum + this.calculateStreak(h), 0) / this.habits.length)
            : 0;

        document.getElementById('totalHabits')!.textContent = this.habits.length.toString();
        document.getElementById('completedToday')!.textContent = completedToday.toString();
        document.getElementById('avgStreak')!.textContent = avgStreak.toString();
    }

    private showDetailedAnalytics(): void {
        const modal = document.getElementById('analyticsModal') as HTMLDivElement;
        const analyticsDiv = document.getElementById('detailedAnalytics') as HTMLDivElement;

        if (this.habits.length === 0) {
            analyticsDiv.innerHTML = '<p style="color: var(--text-secondary);">No data to display</p>';
        } else {
            analyticsDiv.innerHTML = this.habits.map(habit => {
                const streak = this.calculateStreak(habit);
                const weekData = this.getWeeklyData(habit);
                const completionRate = Math.round((habit.completions.length / 30) * 100);

                return `
                    <div class="habit-analytics">
                        <h3>${habit.name}</h3>
                        <div class="analytics-stat">
                            <span class="analytics-stat-label">Current Streak</span>
                            <span class="analytics-stat-value">${streak} days</span>
                        </div>
                        <div class="analytics-stat">
                            <span class="analytics-stat-label">Total Completions</span>
                            <span class="analytics-stat-value">${habit.completions.length}</span>
                        </div>
                        <div class="analytics-stat">
                            <span class="analytics-stat-label">Completion Rate</span>
                            <span class="analytics-stat-value">${completionRate}%</span>
                        </div>
                        <div class="week-grid">
                            ${weekData.map(day => `
                                <div class="week-day">
                                    <div class="week-day-label">${day.label}</div>
                                    <div class="week-day-status">${day.completed ? '✓' : '○'}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('');
        }

        modal.classList.add('show');
    }

    private closeModal(): void {
        const modal = document.getElementById('analyticsModal') as HTMLDivElement;
        modal.classList.remove('show');
    }

    private saveHabits(): void {
        localStorage.setItem(this.storageKey, JSON.stringify(this.habits));
    }

    private loadHabits(): void {
        const data = localStorage.getItem(this.storageKey);
        this.habits = data ? JSON.parse(data) : [];
    }
}

// Global instance
const tracker = new HabitTracker();