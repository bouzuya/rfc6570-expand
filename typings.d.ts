declare module "eater/runner" {
  const test: (
    message: string,
    test: (
      resolve: () => void,
      reject: (reason?: any) => void
    ) => void
  ) => void;
  export { test };
}
