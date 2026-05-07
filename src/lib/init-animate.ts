export const tapVariants = {
  tap: { scale: 1.5, transition: { duration: 0.2 } },
};

export const getInitAnimate = (
  selectOrSearchMode: boolean | number | undefined,
) => {
  return {
    initial: false,
    animate: {
      filter: selectOrSearchMode
        ? [
            "hue-rotate(280deg) brightness(1.5)",
            "hue-rotate(0deg) brightness(1)",
          ]
        : ["hue-rotate(0deg) brightness(1)"],
    },
    transition: { duration: 0.7 },
  };
};
