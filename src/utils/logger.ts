// Configuración de logging para desarrollo/producción
const __DEV__ = process.env.NODE_ENV === 'development';

// Puedes cambiar esto a false para deshabilitar todos los logs
const ENABLE_LOGS = false; // Cambiar a false para desactivar logs en desarrollo

class Logger {
  private enabled: boolean;

  constructor() {
    this.enabled = __DEV__ && ENABLE_LOGS;
  }

  log(...args: any[]) {
    if (this.enabled) {
      console.log(...args);
    }
  }

  error(...args: any[]) {
    if (this.enabled) {
      console.error(...args);
    }
  }

  warn(...args: any[]) {
    if (this.enabled) {
      console.warn(...args);
    }
  }

  info(...args: any[]) {
    if (this.enabled) {
      console.info(...args);
    }
  }

  // Siempre muestra errores críticos (no se puede desactivar)
  criticalError(...args: any[]) {
    console.error(...args);
  }
}

export default new Logger();

