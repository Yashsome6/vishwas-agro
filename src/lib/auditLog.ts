// Audit logging system for tracking all user actions

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'export' | 'import';
  entity: string;
  entityId: string;
  entityName: string;
  changes?: {
    before?: any;
    after?: any;
  };
  metadata?: Record<string, any>;
}

class AuditLogger {
  private readonly storageKey = 'audit_logs';
  private readonly maxEntries = 1000;

  log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const logEntry: AuditLogEntry = {
      ...entry,
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    try {
      const logs = this.getLogs();
      logs.unshift(logEntry);
      
      // Keep only the most recent entries
      const trimmedLogs = logs.slice(0, this.maxEntries);
      
      localStorage.setItem(this.storageKey, JSON.stringify(trimmedLogs));
    } catch (error) {
      console.error('Failed to log audit entry:', error);
    }
  }

  getLogs(filter?: {
    userId?: string;
    action?: string;
    entity?: string;
    startDate?: Date;
    endDate?: Date;
  }): AuditLogEntry[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      let logs: AuditLogEntry[] = stored ? JSON.parse(stored) : [];

      if (filter) {
        logs = logs.filter(log => {
          if (filter.userId && log.userId !== filter.userId) return false;
          if (filter.action && log.action !== filter.action) return false;
          if (filter.entity && log.entity !== filter.entity) return false;
          if (filter.startDate && new Date(log.timestamp) < filter.startDate) return false;
          if (filter.endDate && new Date(log.timestamp) > filter.endDate) return false;
          return true;
        });
      }

      return logs;
    } catch (error) {
      console.error('Failed to retrieve audit logs:', error);
      return [];
    }
  }

  clear(): void {
    localStorage.removeItem(this.storageKey);
  }

  export(): string {
    return JSON.stringify(this.getLogs(), null, 2);
  }
}

export const auditLogger = new AuditLogger();
