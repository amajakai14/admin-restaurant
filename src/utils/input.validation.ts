export const isValidEmail = (text: string) => {
  const regex =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
  return regex.test(text.toLowerCase());
};

export const isValidPassword = (text: string) => {
  const regex = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?\d).{8,})\S$/;
  return regex.test(text);
};

export const isValidPrice = (value: number) => {
  return !Number.isNaN(value) && value >= 0 && value <= 20000;
};

export const isValidTableName = (text: string) => {
  const regex = /^[a-zA-Z0-9-_]+$/;
  return regex.test(text);
};
