export const getErrorText = (error: unknown): string => {
  return error instanceof Error
    ? error.message
    : (error as any)?.errorText
      ? (error as any).errorText
      : String(error);
};
