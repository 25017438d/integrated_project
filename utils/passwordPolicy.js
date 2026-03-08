export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_POLICY_MESSAGE = `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;

export const validatePassword = (password) => {
  if (typeof password !== "string") {
    return { valid: false, message: PASSWORD_POLICY_MESSAGE };
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return { valid: false, message: PASSWORD_POLICY_MESSAGE };
  }

  return { valid: true, message: "" };
};
