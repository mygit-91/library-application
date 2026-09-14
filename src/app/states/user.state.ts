import { Injectable, signal, computed } from '@angular/core';
import { UserSession } from '../models/user.model';

@Injectable({
  providedIn: 'root', // Set to root for [Global Stage] can use every page
})
export class UserState {
  private readonly STORAGE_KEY = 'admin_session';

  // Get default from localStorage, If Refresh page
  private sessionState = signal<UserSession | null>(this.loadSession());

  private loadSession(): UserSession | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data) as UserSession;
    } catch {
      return null;
    }
  }

  // Read-only parameter for get user
  readonly currentUser = this.sessionState.asReadonly();
  readonly isLoggedIn = computed(() => this.sessionState() !== null);

  // Add state
  saveSession(userData: UserSession) {
    this.sessionState.set(userData);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userData));
  }

  // Remove state when logout or Token expired
  clearSession() {
    this.sessionState.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
