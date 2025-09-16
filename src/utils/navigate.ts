export const handleGoToRoute = (url: string) => {
  if (typeof window !== "undefined") {
    window.location.href = url;
  }
};

export const handleReload = () => {
  if (typeof window !== "undefined") {
    window.location.reload();
  }
}