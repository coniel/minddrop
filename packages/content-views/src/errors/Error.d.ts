interface ErrorConstructor {
  captureStackTrace(error: Error, errorConstructor: (message: string) => void);
}
