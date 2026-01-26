declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OTP_SALT_ROUNDS: string;
      ACCESS_TOKEN: string;
      // add other variables here
    }
  }
}
export {};