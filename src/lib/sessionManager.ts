// Session management with timeout and activity tracking
// ⚠️ CLIENT-SIDE ONLY - For demonstration purposes

interface SessionData {
  userId: string;
  email: string;
  name: string;
  role: string;
  loginTime: number;
  lastActivity: number;
  token: string;
}

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const SESSION_KEY = 'erp_session';
const ACTIVITY_CHECK_INTERVAL = 60 * 1000; // 1 minute

class SessionManager {
  private activityCheckInterval: NodeJS.Timeout | null = null;
  private sessionListeners: Array<(isActive: boolean) => void> = [];

  initialize() {
    this.startActivityCheck();
    this.setupActivityListeners();
  }

  private setupActivityListeners() {
    // Track user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, () => this.updateActivity(), { passive: true });
    });
  }

  private startActivityCheck() {
    this.activityCheckInterval = setInterval(() => {
      this.checkSessionValidity();
    }, ACTIVITY_CHECK_INTERVAL);
  }

  private stopActivityCheck() {
    if (this.activityCheckInterval) {
      clearInterval(this.activityCheckInterval);
      this.activityCheckInterval = null;
    }
  }

  createSession(userData: Omit<SessionData, 'loginTime' | 'lastActivity' | 'token'>): string {
    const token = this.generateToken();
    const session: SessionData = {
      ...userData,
      loginTime: Date.now(),
      lastActivity: Date.now(),
      token
    };

    this.saveSession(session);
    this.notifyListeners(true);
    return token;
  }

  getSession(): SessionData | null {
    try {
      const sessionStr = localStorage.getItem(SESSION_KEY);
      if (!sessionStr) return null;

      const session = JSON.parse(sessionStr) as SessionData;
      
      // Check if session is expired
      if (this.isSessionExpired(session)) {
        this.clearSession();
        return null;
      }

      return session;
    } catch {
      return null;
    }
  }

  updateActivity(): void {
    const session = this.getSession();
    if (session) {
      session.lastActivity = Date.now();
      this.saveSession(session);
    }
  }

  isSessionExpired(session: SessionData): boolean {
    const now = Date.now();
    return now - session.lastActivity > SESSION_TIMEOUT;
  }

  checkSessionValidity(): void {
    const session = this.getSession();
    if (session && this.isSessionExpired(session)) {
      this.clearSession();
      this.notifyListeners(false);
    }
  }

  getRemainingTime(): number {
    const session = this.getSession();
    if (!session) return 0;

    const elapsed = Date.now() - session.lastActivity;
    return Math.max(0, SESSION_TIMEOUT - elapsed);
  }

  clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
    this.stopActivityCheck();
    this.notifyListeners(false);
  }

  onSessionChange(callback: (isActive: boolean) => void): () => void {
    this.sessionListeners.push(callback);
    return () => {
      this.sessionListeners = this.sessionListeners.filter(cb => cb !== callback);
    };
  }

  private notifyListeners(isActive: boolean): void {
    this.sessionListeners.forEach(callback => callback(isActive));
  }

  private saveSession(session: SessionData): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  private generateToken(): string {
    // Simple token generation (not cryptographically secure)
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  extendSession(): void {
    const session = this.getSession();
    if (session) {
      session.lastActivity = Date.now();
      this.saveSession(session);
    }
  }

  getSessionInfo(): {
    isActive: boolean;
    remainingMinutes: number;
    user: { name: string; email: string; role: string } | null;
  } {
    const session = this.getSession();
    if (!session) {
      return { isActive: false, remainingMinutes: 0, user: null };
    }

    return {
      isActive: true,
      remainingMinutes: Math.floor(this.getRemainingTime() / 60000),
      user: {
        name: session.name,
        email: session.email,
        role: session.role
      }
    };
  }
}

export const sessionManager = new SessionManager();
