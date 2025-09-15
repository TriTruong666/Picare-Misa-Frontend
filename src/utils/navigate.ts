export const handleGoToRoute = (url: string) => {
    if (typeof window !== "undefined") {
      window.location.href = url;
    }
  };
  