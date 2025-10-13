export const linkValidation = (link: string): boolean => {
    try {
        new URL(link.trim());
        return true;
    } catch {
        return false;
    }
};