/**
 * Habit Tracker - Core Application Engine & Cloud Sync
 * Enterprise TypeScript Architecture with Supabase Backend & Local Fallback
 */
import type { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabaseClient.ts';

const LOCAL_USER_KEY = 'habit_tracker_user';
const LOCAL_HABITS_KEY = 'habit_tracker_habits';
const LOCAL_CATEGORIES_KEY = 'habit_tracker_categories';

export type HabitFrequency = 'daily' | 'weekly' | 'monthly';
export type SortOrder = 'streak' | 'name' | 'category' | 'rate' | 'newest';
export type DialogType = 'danger' | 'warning' | 'info';

export interface UserProfile {
    id?: string;
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
    id: string;
    name: string;
    description?: string;
    category: string;
    categoryId?: string | null;
    frequency: HabitFrequency;
    color: string;
    createdAt: string;
    completions: string[];
}

function createId(): string {
    return crypto.randomUUID ? crypto.randomUUID() : `id_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeHexColor(color: string | undefined, fallback = '#4F46E5'): string {
    const match = String(color || '').trim().match(/^#([0-9A-Fa-f]{6})$/);
    return match ? `#${match[1].toUpperCase()}` : fallback;
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

export interface ConfirmDialogOptions {
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    confirmClass?: string;
    type?: DialogType;
}

export interface AlertDialogOptions {
    title?: string;
    message?: string;
    buttonText?: string;
    type?: DialogType;
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
    private authUser: User | null = null;
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

    public usesCloud(): boolean {
        return Boolean(isSupabaseConfigured && this.authUser && !this.authUser.is_anonymous);
    }

    private async init(): Promise<void> {
        if (isSupabaseConfigured) {
            supabase.auth.onAuthStateChange(async (_event, session) => {
                const prevUser = this.authUser;
                this.authUser = session?.user ?? null;
                if ((prevUser?.id || '') !== (this.authUser?.id || '')) {
                    await this.hydrateUser();
                    await this.loadCategories();
                    await this.loadHabits();
                    this.render();
                }
            });

            try {
                const { data: { session } } = await supabase.auth.getSession();
                this.authUser = session?.user ?? null;
            } catch (err) {
                console.warn('[Habit Tracker] Failed to retrieve Supabase session:', err);
                this.authUser = null;
            }
        }

        await this.hydrateUser();
        await this.loadCategories();
        await this.loadHabits();
        this.setupIconPicker();
        this.setupStarterInspirations();
        this.setupEventListeners();
        this.setupConfetti();
        this.updateUserGreeting();
        this.render();
    }

    private guestProfile(): UserProfile {
        return {
            name: 'Guest User',
            email: 'guest@habittracker.app',
            avatarColor: '#4F46E5',
            isGuest: true
        };
    }

    private async hydrateUser(): Promise<void> {
        if (this.authUser) {
            await this.applyAuthUser(this.authUser);
            return;
        }

        const raw = localStorage.getItem(LOCAL_USER_KEY);
        if (raw) {
            try {
                this.currentUser = JSON.parse(raw) as UserProfile;
                this.currentUser.isGuest = true;
                this.currentUser.id = undefined;
            } catch {
                this.currentUser = this.guestProfile();
            }
        } else {
            this.currentUser = this.guestProfile();
            this.saveUser();
        }
        this.updateUserUI();
    }

    private async applyAuthUser(user: User): Promise<void> {
        const metadata = user.user_metadata || {};
        let name = typeof metadata.name === 'string' ? metadata.name : '';
        let avatarColor = normalizeHexColor(metadata.avatar_color as string | undefined);
        let email = user.email || '';

        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('name, email, avatar_color, is_guest')
                .eq('id', user.id)
                .maybeSingle();

            if (!error && profile) {
                name = profile.name || name;
                email = profile.email || email;
                avatarColor = normalizeHexColor(profile.avatar_color, avatarColor);
            } else if (!profile) {
                // Upsert profile row if trigger didn't catch it
                await supabase.from('profiles').upsert({
                    id: user.id,
                    name: name || email.split('@')[0] || 'User',
                    email,
                    avatar_color: avatarColor,
                    is_guest: false
                });
            }
        } catch (err) {
            console.warn('[Habit Tracker] Error fetching profile:', err);
        }

        this.currentUser = {
            id: user.id,
            name: name || email.split('@')[0] || 'User',
            email,
            avatarColor,
            isGuest: false
        };
        this.saveUser();
        this.updateUserUI();
    }

    private saveUser(): void {
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(this.currentUser));
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
        if (authText) {
            authText.textContent = this.currentUser.isGuest ? 'Sign In / Sign Up' : 'Log Out / Switch Account';
        }
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

    private loadLocalCategories(): void {
        try {
            const raw = localStorage.getItem(LOCAL_CATEGORIES_KEY);
            this.categories = raw ? JSON.parse(raw) : [...DEFAULT_CATEGORIES];
            if (!raw) this.persistLocalCategories();
        } catch {
            this.categories = [...DEFAULT_CATEGORIES];
        }
    }

    private persistLocalCategories(): void {
        localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(this.categories));
    }

    private persistLocalHabits(): void {
        localStorage.setItem(LOCAL_HABITS_KEY, JSON.stringify(this.habits));
    }

    private async loadCategories(): Promise<void> {
        if (!this.usesCloud()) {
            this.loadLocalCategories();
            return;
        }

        const { data, error } = await supabase
            .from('categories')
            .select('id, name, icon_key, color')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('[Habit Tracker] Error loading categories from Supabase:', error);
            this.loadLocalCategories();
            return;
        }

        if (!data || data.length === 0) {
            await this.seedDefaultCategories();
            return;
        }

        this.categories = data.map((row) => ({
            id: row.id,
            name: row.name,
            icon: row.icon_key,
            color: normalizeHexColor(row.color)
        }));
    }

    private async seedDefaultCategories(): Promise<void> {
        if (!this.authUser) return;
        const rows = DEFAULT_CATEGORIES.map((cat) => ({
            user_id: this.authUser!.id,
            name: cat.name,
            icon_key: cat.icon,
            color: normalizeHexColor(cat.color)
        }));
        const { data, error } = await supabase.from('categories').insert(rows).select('id, name, icon_key, color');
        if (error || !data) {
            this.categories = [...DEFAULT_CATEGORIES];
            return;
        }
        this.categories = data.map((row) => ({
            id: row.id,
            name: row.name,
            icon: row.icon_key,
            color: normalizeHexColor(row.color)
        }));
    }

    private loadLocalHabits(): void {
        try {
            const raw = localStorage.getItem(LOCAL_HABITS_KEY);
            this.habits = raw ? JSON.parse(raw) : [];
        } catch {
            this.habits = [];
        }
    }

    private async loadHabits(): Promise<void> {
        if (!this.usesCloud()) {
            this.loadLocalHabits();
            return;
        }

        const { data, error } = await supabase
            .from('habits')
            .select(`
                id,
                name,
                description,
                frequency,
                color,
                created_at,
                category_id,
                categories ( id, name ),
                habit_completions ( completed_on )
            `)
            .eq('is_archived', false)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[Habit Tracker] Error loading habits from Supabase:', error);
            this.habits = [];
            return;
        }

        type HabitRow = {
            id: string;
            name: string;
            description: string | null;
            frequency: HabitFrequency;
            color: string;
            created_at: string;
            category_id: string | null;
            categories: { id: string; name: string } | { id: string; name: string }[] | null;
            habit_completions: { completed_on: string }[] | null;
        };

        this.habits = ((data || []) as HabitRow[]).map((row) => {
            const categoryRel = Array.isArray(row.categories) ? row.categories[0] : row.categories;
            const categoryName = categoryRel?.name || this.categories.find(c => c.id === row.category_id)?.name || 'General';
            return {
                id: row.id,
                name: row.name,
                description: row.description || '',
                category: categoryName,
                categoryId: row.category_id,
                frequency: row.frequency,
                color: normalizeHexColor(row.color),
                createdAt: (row.created_at || '').slice(0, 10) || this.getTodayStr(),
                completions: (row.habit_completions || []).map((c) => c.completed_on)
            };
        });
    }

    public showConfirmDialog(options: ConfirmDialogOptions = {}): Promise<boolean> {
        const {
            title = 'Are you sure?',
            message = 'This action cannot be undone.',
            confirmText = 'Confirm',
            cancelText = 'Cancel',
            confirmClass = 'btn-danger',
            type = 'danger'
        } = options;

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

            if (iconBox) iconBox.className = `confirm-icon-box ${type}`;
            if (iconSvg) {
                if (type === 'info') {
                    iconSvg.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
                } else if (type === 'warning') {
                    iconSvg.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
                } else {
                    iconSvg.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
                }
            }

            const cleanup = (result: boolean) => {
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

    public showAlertDialog(options: AlertDialogOptions = {}): Promise<void> {
        const {
            title = 'Notice',
            message = '',
            buttonText = 'OK',
            type = 'info'
        } = options;

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

    public escapeHtml(str: string): string {
        if (!str) return '';
        return String(str).replace(/[&<>"']/g, function(m) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[m] || m;
        });
    }

    public highlightMatch(text: string, query: string): string {
        if (!text || !query) return this.escapeHtml(text);
        const safeText = this.escapeHtml(text);
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return safeText.replace(regex, '<mark class="search-highlight">$1</mark>');
    }

    private generateStrongPassword(): string {
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        let password = '';
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += symbols[Math.floor(Math.random() * symbols.length)];
        
        const allChars = uppercase + lowercase + numbers + symbols;
        const length = 14;
        for (let i = password.length; i < length; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }
        
        return password.split('').sort(() => 0.5 - Math.random()).join('');
    }

    private validatePasswordStrength(password: string): { isValid: boolean; message: string } {
        if (password.length < 8) {
            return { isValid: false, message: 'Password must be at least 8 characters long.' };
        }
        if (!/[A-Z]/.test(password)) {
            return { isValid: false, message: 'Password must contain at least one uppercase letter.' };
        }
        if (!/[a-z]/.test(password)) {
            return { isValid: false, message: 'Password must contain at least one lowercase letter.' };
        }
        if (!/[0-9]/.test(password)) {
            return { isValid: false, message: 'Password must contain at least one number.' };
        }
        if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
            return { isValid: false, message: 'Password must contain at least one special character.' };
        }
        return { isValid: true, message: 'Strong password' };
    }


    public clearSearch(): void {
        const searchInput = document.getElementById('searchInput') as HTMLInputElement | null;
        const clearSearchBtn = document.getElementById('clearSearchBtn') as HTMLElement | null;
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

        document.getElementById('dropdownAuthBtn')?.addEventListener('click', () => {
            if (this.currentUser && !this.currentUser.isGuest) {
                this.handleLogout();
            } else {
                this.openAuthModal();
            }
        });
        document.getElementById('closeAuthModalBtn')?.addEventListener('click', () => this.closeAuthModal());
        document.getElementById('dropdownClearAllBtn')?.addEventListener('click', () => this.clearAllHabits());

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

        // Password visibility toggles, generation, and validation setup
        const setupPasswordToggle = (inputEl: HTMLInputElement | null, btnEl: HTMLElement | null) => {
            if (!inputEl || !btnEl) return;
            btnEl.addEventListener('click', () => {
                const type = inputEl.type === 'password' ? 'text' : 'password';
                inputEl.type = type;
                btnEl.title = type === 'password' ? 'Show password' : 'Hide password';
                if (type === 'text') {
                    btnEl.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
                } else {
                    btnEl.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
                }
            });
        };

        const loginPassInput = document.getElementById('loginPassword') as HTMLInputElement | null;
        const toggleLoginPassBtn = document.getElementById('toggleLoginPasswordBtn');
        setupPasswordToggle(loginPassInput, toggleLoginPassBtn);

        const signUpPassInput = document.getElementById('signUpPassword') as HTMLInputElement | null;
        const toggleSignUpPassBtn = document.getElementById('toggleSignUpPasswordBtn');
        setupPasswordToggle(signUpPassInput, toggleSignUpPassBtn);

        const generateBtn = document.getElementById('generatePasswordBtn');
        if (generateBtn && signUpPassInput) {
            generateBtn.addEventListener('click', () => {
                const newPass = this.generateStrongPassword();
                signUpPassInput.value = newPass;
                signUpPassInput.type = 'text';
                if (toggleSignUpPassBtn) {
                    toggleSignUpPassBtn.title = 'Hide password';
                    toggleSignUpPassBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
                }
                
                const hint = document.getElementById('passwordStrengthHint');
                if (hint) {
                    hint.textContent = 'Strong password generated!';
                    hint.className = 'password-strength-hint success';
                    hint.style.display = 'block';
                }
                
                this.showToast('Strong password generated and filled!', 'success');
            });
        }

        if (signUpPassInput) {
            const handlePassInput = () => {
                const val = signUpPassInput.value;
                const hint = document.getElementById('passwordStrengthHint');
                if (!hint) return;
                
                if (!val) {
                    hint.style.display = 'none';
                    return;
                }
                
                const strength = this.validatePasswordStrength(val);
                hint.textContent = strength.message;
                if (strength.isValid) {
                    hint.className = 'password-strength-hint success';
                } else {
                    hint.className = 'password-strength-hint error';
                }
                hint.style.display = 'block';
            };
            
            signUpPassInput.addEventListener('input', handlePassInput);
        }


        // Mobile Menu Drawer Handling
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebarNav = document.getElementById('sidebarNav');
        const sidebarOverlay = document.getElementById('sidebarOverlay');

        if (mobileMenuBtn && sidebarNav && sidebarOverlay) {
            const toggleSidebar = () => {
                sidebarNav.classList.toggle('show');
                sidebarOverlay.classList.toggle('show');
            };
            
            mobileMenuBtn.addEventListener('click', toggleSidebar);
            sidebarOverlay.addEventListener('click', toggleSidebar);
        }

        // Live Search Handling
        const searchInput = document.getElementById('searchInput') as HTMLInputElement | null;
        const clearSearchBtn = document.getElementById('clearSearchBtn') as HTMLElement | null;

        if (searchInput) {
            const handleSearch = (e: Event) => {
                this.searchQuery = ((e.target as HTMLInputElement).value || '').toLowerCase().trim();
                if (clearSearchBtn) {
                    clearSearchBtn.style.display = this.searchQuery ? 'inline-flex' : 'none';
                }
                this.renderHabitsGrid();
            };

            searchInput.addEventListener('input', handleSearch);
            searchInput.addEventListener('keyup', (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    this.clearSearch();
                    searchInput.blur();
                } else {
                    handleSearch(e);
                }
            });
            searchInput.addEventListener('search', handleSearch);
            searchInput.addEventListener('paste', () => {
                setTimeout(() => handleSearch({ target: searchInput } as unknown as Event), 10);
            });
        }

        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                this.clearSearch();
            });
        }

        // Global Shortcut: Press '/' or 'Ctrl+K' / 'Cmd+K' to focus search
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            const tag = (document.activeElement?.tagName || '').toUpperCase();
            if ((e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') ||
                ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
                e.preventDefault();
                const searchEl = document.getElementById('searchInput') as HTMLInputElement | null;
                if (searchEl) {
                    searchEl.focus();
                    searchEl.select();
                }
            }
        });

        const freqContainer = document.getElementById('frequencyFilters');
        if (freqContainer) {
            freqContainer.addEventListener('click', (e) => {
                const btn = (e.target as HTMLElement).closest('.filter-pill') as HTMLElement | null;
                if (!btn) return;
                freqContainer.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedFrequency = btn.dataset.freq || 'all';
                this.renderHabitsGrid();
                this.closeMobileMenu();
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

        ['authModal', 'categoryModal', 'habitModal', 'analyticsModal'].forEach(id => {
            const modal = document.getElementById(id);
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) modal.classList.remove('show');
                });
            }
        });
    }

    public openAuthModal(): void {
        document.getElementById('authModal')?.classList.add('show');
    }

    public closeAuthModal(): void {
        document.getElementById('authModal')?.classList.remove('show');
    }

    private async handleLogin(e: Event): Promise<void> {
        e.preventDefault();
        const emailInput = document.getElementById('loginEmail') as HTMLInputElement | null;
        const passwordInput = document.getElementById('loginPassword') as HTMLInputElement | null;
        const submitBtn = (e.target as HTMLFormElement).querySelector('button[type="submit"]') as HTMLButtonElement | null;

        const email = emailInput?.value.trim() || '';
        const password = passwordInput?.value || '';

        if (!email || !password) return;

        if (isSupabaseConfigured) {
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Signing In...';
            }

            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) {
                    this.showToast(error.message, 'error');
                    return;
                }

                if (data.user) {
                    this.authUser = data.user;
                    await this.hydrateUser();
                    await this.loadCategories();
                    await this.loadHabits();
                    this.render();
                    this.closeAuthModal();
                    this.showToast(`Signed in successfully as ${this.currentUser?.name || email}`, 'success');
                }
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Login failed';
                this.showToast(message, 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Sign In to Account';
                }
            }
        } else {
            // Local mode fallback
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
            this.showToast(`Signed in locally as ${this.currentUser.name}`, 'success');
        }
    }

    private async handleSignUp(e: Event): Promise<void> {
        e.preventDefault();
        const nameInput = document.getElementById('signUpName') as HTMLInputElement | null;
        const emailInput = document.getElementById('signUpEmail') as HTMLInputElement | null;
        const passwordInput = document.getElementById('signUpPassword') as HTMLInputElement | null;
        const colorInput = document.getElementById('signUpAvatarColor') as HTMLInputElement | null;
        const submitBtn = (e.target as HTMLFormElement).querySelector('button[type="submit"]') as HTMLButtonElement | null;

        const name = nameInput?.value.trim() || '';
        const email = emailInput?.value.trim() || '';
        const password = passwordInput?.value || '';
        const color = colorInput?.value || '#4f46e5';

        if (!name || !email || !password) return;

        const passwordStrength = this.validatePasswordStrength(password);
        if (!passwordStrength.isValid) {
            this.showToast(passwordStrength.message, 'error');
            const hint = document.getElementById('passwordStrengthHint');
            if (hint) {
                hint.textContent = passwordStrength.message;
                hint.className = 'password-strength-hint error';
                hint.style.display = 'block';
            }
            passwordInput?.focus();
            return;
        }

        if (isSupabaseConfigured) {
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Creating Account...';
            }

            try {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            name,
                            avatar_color: color,
                            is_guest: false
                        }
                    }
                });

                if (error) {
                    this.showToast(error.message, 'error');
                    return;
                }

                if (data.session && data.user) {
                    this.authUser = data.user;
                    await this.hydrateUser();
                    await this.loadCategories();
                    await this.loadHabits();
                    this.render();
                    this.closeAuthModal();
                    this.showToast(`Welcome, ${name}!`, 'success');
                    this.triggerConfetti();
                } else if (data.user) {
                    this.closeAuthModal();
                    await this.showAlertDialog({
                        title: 'Account Created',
                        message: 'Your account has been created! A verification email has been sent via Resend. Please check your inbox (and spam folder) to confirm your email, then sign in.',
                        type: 'info'
                    });
                }
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Sign up failed';
                this.showToast(message, 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Create Account';
                }
            }
        } else {
            // Local mode fallback
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
    }

    public async handleLogout(): Promise<void> {
        const confirmed = await this.showConfirmDialog({
            title: 'Sign Out?',
            message: 'Are you sure you want to sign out? Your cloud data will remain safely stored on Supabase.',
            confirmText: 'Sign Out',
            confirmClass: 'btn-danger',
            type: 'info'
        });

        if (!confirmed) return;

        if (isSupabaseConfigured) {
            try {
                await supabase.auth.signOut();
            } catch (err) {
                console.error('[Habit Tracker] Sign out error:', err);
            }
        }

        this.authUser = null;
        this.currentUser = this.guestProfile();
        this.saveUser();
        this.loadLocalCategories();
        this.loadLocalHabits();
        this.updateUserUI();
        this.updateUserGreeting();
        this.render();
        this.showToast('Signed out. Continuing as Guest.');
    }

    private handleGuestLogin(): void {
        this.currentUser = this.guestProfile();
        this.saveUser();
        this.loadLocalCategories();
        this.loadLocalHabits();
        this.updateUserUI();
        this.updateUserGreeting();
        this.closeAuthModal();
        this.render();
        this.showToast('Continuing as Guest Explorer', 'success');
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

    private async handleCategorySubmit(e: Event): Promise<void> {
        e.preventDefault();
        const editId = (document.getElementById('editCategoryId') as HTMLInputElement).value;
        const name = (document.getElementById('categoryNameInput') as HTMLInputElement).value.trim();
        const iconKey = (document.getElementById('categoryIconKey') as HTMLInputElement).value || 'target';
        const color = (document.getElementById('categoryColorInput') as HTMLInputElement).value || '#4f46e5';

        if (!name) return;

        if (this.usesCloud()) {
            if (editId) {
                const { error } = await supabase
                    .from('categories')
                    .update({ name, icon_key: iconKey, color: normalizeHexColor(color) })
                    .eq('id', editId);

                if (error) {
                    this.showToast(error.message, 'error');
                    return;
                }

                const cat = this.categories.find(c => c.id === editId);
                if (cat) {
                    const oldName = cat.name;
                    cat.name = name;
                    cat.icon = iconKey;
                    cat.color = color;
                    this.habits.forEach(h => {
                        if (h.category === oldName) h.category = name;
                    });
                }
                this.showToast(`Updated category "${name}"`, 'success');
            } else {
                const { data, error } = await supabase
                    .from('categories')
                    .insert({
                        user_id: this.authUser!.id,
                        name,
                        icon_key: iconKey,
                        color: normalizeHexColor(color)
                    })
                    .select('id')
                    .single();

                if (error || !data) {
                    this.showToast(error?.message || 'Could not create category', 'error');
                    return;
                }

                this.categories.push({
                    id: data.id,
                    name,
                    icon: iconKey,
                    color
                });
                this.showToast(`Created category "${name}"!`, 'success');
            }
        } else {
            // Local mode
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
                    this.persistLocalHabits();
                    this.showToast(`Updated category "${name}"`, 'success');
                }
            } else {
                const newCat: CustomCategory = {
                    id: createId(),
                    name,
                    icon: iconKey,
                    color
                };
                this.categories.push(newCat);
                this.showToast(`Created category "${name}"!`, 'success');
            }
            this.persistLocalCategories();
        }

        this.closeCategoryModal();
        this.render();
    }

    public async deleteCategory(id: string): Promise<void> {
        const cat = this.categories.find(c => c.id === id);
        if (!cat) return;

        const confirmed = await this.showConfirmDialog({
            title: `Delete "${cat.name}" Category?`,
            message: `Habits assigned to "${cat.name}" will be safely moved to "General". This action cannot be undone.`,
            confirmText: 'Delete Category',
            confirmClass: 'btn-danger',
            type: 'danger'
        });

        if (!confirmed) return;

        if (this.usesCloud()) {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) {
                this.showToast(error.message, 'error');
                return;
            }
        }

        this.categories = this.categories.filter(c => c.id !== id);
        this.habits.forEach(h => {
            if (h.categoryId === id || h.category === cat.name) {
                h.category = 'General';
                h.categoryId = null;
            }
        });

        if (!this.usesCloud()) {
            this.persistLocalCategories();
            this.persistLocalHabits();
        }

        this.render();
        this.showToast(`Deleted category "${cat.name}"`);
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
            <button type="button" class="template-card" onclick="tracker.addStarterInspiration('${this.escapeHtml(item.name)}')">
                <div class="template-card-left">
                    <div class="template-icon-badge" style="color: ${item.color};">
                        ${SVG_ICONS[item.icon] || SVG_ICONS['target']}
                    </div>
                    <div class="template-info">
                        <span class="template-title">${this.escapeHtml(item.name)}</span>
                        <span class="template-sub">${this.escapeHtml(item.category)} • ${item.freq}</span>
                    </div>
                </div>
                <span class="template-add-pill">+ Add</span>
            </button>
        `).join('');
    }

    public async addStarterInspiration(name: string): Promise<void> {
        const templates: Record<string, { category: string; desc: string; icon: string; color: string; freq: HabitFrequency }> = {
            'Hydration 2L': { category: 'Health & Fitness', desc: 'Drink 2+ litres of fresh water daily', icon: 'droplet', color: '#0284c7', freq: 'daily' },
            'Read 20 Mins': { category: 'Learning', desc: 'Read tech articles or books', icon: 'book', color: '#4f46e5', freq: 'daily' },
            'Morning Workout': { category: 'Health & Fitness', desc: 'Zone 2 cardio or strength session', icon: 'dumbbell', color: '#059669', freq: 'daily' },
            'Mindful Breathing': { category: 'Mindfulness', desc: '10 min mindfulness or meditation', icon: 'feather', color: '#7c3aed', freq: 'daily' }
        };

        const template = templates[name];
        if (!template) return;

        let categoryId: string | null = null;
        let matchedCat = this.categories.find(c => c.name.toLowerCase() === template.category.toLowerCase());

        if (!matchedCat) {
            if (this.usesCloud()) {
                const { data: catData } = await supabase.from('categories').insert({
                    user_id: this.authUser!.id,
                    name: template.category,
                    icon_key: template.icon,
                    color: normalizeHexColor(template.color)
                }).select('id').single();

                if (catData) {
                    matchedCat = { id: catData.id, name: template.category, icon: template.icon, color: template.color };
                    this.categories.push(matchedCat);
                    categoryId = catData.id;
                }
            } else {
                matchedCat = { id: createId(), name: template.category, icon: template.icon, color: template.color };
                this.categories.push(matchedCat);
                categoryId = matchedCat.id;
                this.persistLocalCategories();
            }
        } else {
            categoryId = matchedCat.id;
        }

        const todayStr = this.getTodayStr();

        if (this.usesCloud()) {
            const { data: habitData, error } = await supabase.from('habits').insert({
                user_id: this.authUser!.id,
                category_id: categoryId,
                name: template.name,
                description: template.desc,
                frequency: template.freq,
                color: normalizeHexColor(template.color)
            }).select('id, created_at').single();

            if (error || !habitData) {
                this.showToast(error?.message || 'Failed to add habit', 'error');
                return;
            }

            // Log completion for today
            await supabase.from('habit_completions').insert({
                habit_id: habitData.id,
                user_id: this.authUser!.id,
                completed_on: todayStr
            });

            const newHabit: Habit = {
                id: habitData.id,
                name: template.name,
                description: template.desc,
                category: template.category,
                categoryId: categoryId,
                frequency: template.freq,
                color: template.color,
                createdAt: (habitData.created_at || '').slice(0, 10) || todayStr,
                completions: [todayStr]
            };

            this.habits.unshift(newHabit);
        } else {
            const newHabit: Habit = {
                id: createId(),
                name: template.name,
                description: template.desc,
                category: template.category,
                categoryId: categoryId,
                frequency: template.freq,
                color: template.color,
                createdAt: todayStr,
                completions: [todayStr]
            };

            this.habits.unshift(newHabit);
            this.persistLocalHabits();
        }

        this.render();
        this.showToast(`Added habit: "${template.name}"!`, 'success');
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
        const uniqueDates = habit.completions || [];
        if (!habit.completions || habit.completions.length === 0) return 0;
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
                    <button class="category-btn" onclick="tracker.setCategoryFilter('${this.escapeHtml(cat.name)}')">
                        <div class="category-btn-left">
                            <span class="cat-icon-svg" style="color: ${cat.color};">${iconSvg}</span>
                            <span>${this.escapeHtml(cat.name)}</span>
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
        this.closeMobileMenu();
    }

    private closeMobileMenu(): void {
        const sidebarNav = document.getElementById('sidebarNav');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        if (sidebarNav) sidebarNav.classList.remove('show');
        if (sidebarOverlay) sidebarOverlay.classList.remove('show');
    }

    public editCategoryById(id: string): void {
        const cat = this.categories.find(c => c.id === id);
        if (cat) this.openCategoryModal(cat);
    }

    private renderHabitCategorySelect(): void {
        const select = document.getElementById('habitCategorySelect') as HTMLSelectElement | null;
        if (!select) return;

        select.innerHTML = this.categories.map(cat => `
            <option value="${this.escapeHtml(cat.name)}">${this.escapeHtml(cat.name)}</option>
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
        const query = this.searchQuery;

        return this.habits.filter(habit => {
            if (query) {
                const nameMatch = (habit.name || '').toLowerCase().includes(query);
                const descMatch = (habit.description || '').toLowerCase().includes(query);
                const catMatch = (habit.category || '').toLowerCase().includes(query);
                const freqMatch = (habit.frequency || '').toLowerCase().includes(query);

                if (!nameMatch && !descMatch && !catMatch && !freqMatch) {
                    return false;
                }
            }

            if (this.selectedCategory !== 'all' && habit.category !== this.selectedCategory) return false;
            if (this.selectedFrequency !== 'all' && habit.frequency !== this.selectedFrequency) return false;
            if (this.selectedStatus === 'pending' && habit.completions.includes(todayStr)) return false;
            if (this.selectedStatus === 'completed' && !habit.completions.includes(todayStr)) return false;

            return true;
        }).sort((a, b) => {
            if (this.sortOrder === 'streak') return this.calculateStreak(b) - this.calculateStreak(a);
            if (this.sortOrder === 'name') return a.name.localeCompare(b.name);
            if (this.sortOrder === 'category') return (a.category || '').localeCompare(b.category || '');
            if (this.sortOrder === 'rate') return (b.completions?.length || 0) - (a.completions?.length || 0);
            if (this.sortOrder === 'newest') return (b.createdAt || '').localeCompare(a.createdAt || '');
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
            const catObj = this.categories.find(c => c.name === habit.category || c.id === habit.categoryId) || { name: habit.category, icon: 'target', color: '#4f46e5' };
            const iconSvg = SVG_ICONS[catObj.icon] || SVG_ICONS['target'];
            const cardAccent = habit.color || catObj.color;

            const displayName = this.searchQuery ? this.highlightMatch(habit.name, this.searchQuery) : this.escapeHtml(habit.name);
            const displayDesc = habit.description ? (this.searchQuery ? this.highlightMatch(habit.description, this.searchQuery) : this.escapeHtml(habit.description)) : '';

            const stripHtml = rollingDays.map(day => {
                const isChecked = habit.completions.includes(day.dateStr);
                return `
                    <button type="button" 
                            class="day-pill ${day.isToday ? 'today' : ''} ${isChecked ? 'completed' : ''}" 
                            title="${day.dateStr}${day.isToday ? ' (Today)' : ''}"
                            onclick="tracker.toggleDateCompletion('${habit.id}', '${day.dateStr}')">
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
                            <button class="card-menu-btn" title="Edit Habit" onclick="tracker.editHabit('${habit.id}')">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                            <button class="card-menu-btn" title="Delete Habit" onclick="tracker.deleteHabit('${habit.id}')">
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
                                onclick="tracker.toggleToday('${habit.id}')">
                            ${isCompletedToday ? '✓ Done' : '+ Check In'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    public toggleToday(habitId: string): void {
        const todayStr = this.getTodayStr();
        this.toggleDateCompletion(habitId, todayStr);
    }

    public async toggleDateCompletion(habitId: string, dateStr: string): Promise<void> {
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return;

        const index = habit.completions.indexOf(dateStr);
        const wasCompleted = index > -1;

        if (this.usesCloud()) {
            if (wasCompleted) {
                const { error } = await supabase
                    .from('habit_completions')
                    .delete()
                    .eq('habit_id', habitId)
                    .eq('completed_on', dateStr)
                    .eq('user_id', this.authUser!.id);

                if (error) {
                    this.showToast(error.message, 'error');
                    return;
                }

                habit.completions.splice(index, 1);
                this.showToast(`Unchecked "${habit.name}" for ${dateStr}`);
            } else {
                const { error } = await supabase
                    .from('habit_completions')
                    .insert({
                        habit_id: habitId,
                        user_id: this.authUser!.id,
                        completed_on: dateStr
                    });

                if (error) {
                    this.showToast(error.message, 'error');
                    return;
                }

                habit.completions.push(dateStr);
                this.showToast(`✓ Completed "${habit.name}"!`, 'success');
                if (dateStr === this.getTodayStr()) this.triggerConfetti();
            }
        } else {
            // Local mode
            if (wasCompleted) {
                habit.completions.splice(index, 1);
                this.showToast(`Unchecked "${habit.name}" for ${dateStr}`);
            } else {
                habit.completions.push(dateStr);
                this.showToast(`✓ Completed "${habit.name}"!`, 'success');
                if (dateStr === this.getTodayStr()) this.triggerConfetti();
            }
            this.persistLocalHabits();
        }

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
            (document.getElementById('editHabitId') as HTMLInputElement).value = habitToEdit.id;
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

    public openHabitModalWithName(presetName: string): void {
        this.openHabitModal();
        const nameInput = document.getElementById('habitName') as HTMLInputElement | null;
        if (nameInput) {
            nameInput.value = presetName;
            nameInput.focus();
        }
    }

    public closeHabitModal(): void {
        document.getElementById('habitModal')?.classList.remove('show');
    }

    private async handleHabitSubmit(e: Event): Promise<void> {
        e.preventDefault();

        const editId = (document.getElementById('editHabitId') as HTMLInputElement).value;
        const name = (document.getElementById('habitName') as HTMLInputElement).value.trim();
        const description = (document.getElementById('habitDescription') as HTMLInputElement).value.trim();
        const categoryName = (document.getElementById('habitCategorySelect') as HTMLSelectElement).value;
        const frequency = (document.getElementById('habitFrequency') as HTMLSelectElement).value as HabitFrequency;
        const color = (document.getElementById('habitColor') as HTMLInputElement).value;

        if (!name) return;

        const catObj = this.categories.find(c => c.name === categoryName);
        const categoryId = catObj ? catObj.id : null;

        if (this.usesCloud()) {
            if (editId) {
                const { error } = await supabase
                    .from('habits')
                    .update({
                        name,
                        description: description || null,
                        category_id: categoryId,
                        frequency,
                        color: normalizeHexColor(color),
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', editId);

                if (error) {
                    this.showToast(error.message, 'error');
                    return;
                }

                const habit = this.habits.find(h => h.id === editId);
                if (habit) {
                    habit.name = name;
                    habit.description = description;
                    habit.category = categoryName;
                    habit.categoryId = categoryId;
                    habit.frequency = frequency;
                    habit.color = color;
                }
                this.showToast(`Updated habit "${name}"`, 'success');
            } else {
                const { data, error } = await supabase
                    .from('habits')
                    .insert({
                        user_id: this.authUser!.id,
                        category_id: categoryId,
                        name,
                        description: description || null,
                        frequency,
                        color: normalizeHexColor(color)
                    })
                    .select('id, created_at')
                    .single();

                if (error || !data) {
                    this.showToast(error?.message || 'Failed to create habit', 'error');
                    return;
                }

                const newHabit: Habit = {
                    id: data.id,
                    name,
                    description,
                    category: categoryName,
                    categoryId,
                    frequency,
                    color,
                    createdAt: (data.created_at || '').slice(0, 10) || this.getTodayStr(),
                    completions: []
                };
                this.habits.unshift(newHabit);
                this.showToast(`Created habit "${name}"!`, 'success');
                this.triggerConfetti();
            }
        } else {
            // Local mode
            if (editId) {
                const habit = this.habits.find(h => h.id === editId);
                if (habit) {
                    habit.name = name;
                    habit.description = description;
                    habit.category = categoryName;
                    habit.categoryId = categoryId;
                    habit.frequency = frequency;
                    habit.color = color;
                    this.showToast(`Updated habit "${name}"`, 'success');
                }
            } else {
                const newHabit: Habit = {
                    id: createId(),
                    name,
                    description,
                    category: categoryName,
                    categoryId,
                    frequency,
                    color,
                    createdAt: this.getTodayStr(),
                    completions: []
                };
                this.habits.unshift(newHabit);
                this.showToast(`Created habit "${name}"!`, 'success');
                this.triggerConfetti();
            }
            this.persistLocalHabits();
        }

        this.closeHabitModal();
        this.render();
    }

    public editHabit(id: string): void {
        const habit = this.habits.find(h => h.id === id);
        if (habit) this.openHabitModal(habit);
    }

    public async deleteHabit(id: string): Promise<void> {
        const habit = this.habits.find(h => h.id === id);
        if (!habit) return;

        const confirmed = await this.showConfirmDialog({
            title: `Delete "${habit.name}"?`,
            message: `Are you sure you want to delete this habit and all its logged history? This action cannot be undone.`,
            confirmText: 'Delete Habit',
            confirmClass: 'btn-danger',
            type: 'danger'
        });

        if (!confirmed) return;

        if (this.usesCloud()) {
            const { error } = await supabase.from('habits').delete().eq('id', id);
            if (error) {
                this.showToast(error.message, 'error');
                return;
            }
        }

        this.habits = this.habits.filter(h => h.id !== id);
        if (!this.usesCloud()) this.persistLocalHabits();
        this.render();
        this.showToast(`Deleted habit "${habit.name}"`);
    }

    public async clearAllHabits(): Promise<void> {
        const confirmed = await this.showConfirmDialog({
            title: 'Clear All Habits?',
            message: 'Are you sure you want to clear all habits? All your habits, streaks, and check-in history will be wiped. This action cannot be undone.',
            confirmText: 'Clear All Data',
            confirmClass: 'btn-danger',
            type: 'danger'
        });

        if (!confirmed) return;

        if (this.usesCloud()) {
            const { error } = await supabase.from('habits').delete().eq('user_id', this.authUser!.id);
            if (error) {
                this.showToast(error.message, 'error');
                return;
            }
        }

        this.habits = [];
        if (!this.usesCloud()) this.persistLocalHabits();
        this.render();
        this.showToast('Cleared all habits.');
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
            const catObj = this.categories.find(c => c.name === habit.category || c.id === habit.categoryId) || { color: '#4f46e5' };
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

    public showToast(message: string, type: 'normal' | 'success' | 'error' = 'normal'): void {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        const typeClass = type === 'success' ? 'toast-success' : (type === 'error' ? 'toast-error' : '');
        toast.className = `toast ${typeClass}`.trim();
        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
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