/**
 * List of helpers used accross the Backend
 */

export const buildError = (error: unknown) => {
  if (error instanceof Error) {
    return error;
  }
};
