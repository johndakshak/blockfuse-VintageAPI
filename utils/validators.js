const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email) {
    return emailRegex.test(email.trim());
}

export function isValidPassword(password) {
    if (typeof password !== "string") return false;

    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\/;']/.test(password);
    const isLongEnough = password.length >= 8;

    return hasLowercase && hasUppercase && hasNumber && hasSymbol && isLongEnough;
}