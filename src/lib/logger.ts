type LogLevel = "debug" | "info" | "warn" | "error";

const logOrder: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function getConfiguredLevel(): LogLevel {
  const configured = process.env.LOG_LEVEL;
  if (
    configured === "debug" ||
    configured === "info" ||
    configured === "warn" ||
    configured === "error"
  ) {
    return configured;
  }

  return "info";
}

function write(
  level: LogLevel,
  message: string,
  metadata?: Record<string, unknown>,
) {
  if (logOrder[level] < logOrder[getConfiguredLevel()]) {
    return;
  }

  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(metadata ? { metadata } : {}),
  };

  if (level === "error") {
    console.error(JSON.stringify(payload));
    return;
  }

  console.log(JSON.stringify(payload));
}

export const logger = {
  debug: (message: string, metadata?: Record<string, unknown>) =>
    write("debug", message, metadata),
  info: (message: string, metadata?: Record<string, unknown>) =>
    write("info", message, metadata),
  warn: (message: string, metadata?: Record<string, unknown>) =>
    write("warn", message, metadata),
  error: (message: string, metadata?: Record<string, unknown>) =>
    write("error", message, metadata),
};
