export default function formatDate(string) {
  const date = new Date(string);

  // add leading zeros to day and month
  const lastTwoChars = -2;

  const day = (`0${date.getDate()}`).slice(lastTwoChars);
  const month = (`0${date.getMonth() + 1}`).slice(lastTwoChars);
  const fullYear = date.getFullYear();

  return `${day}/${month}/${fullYear}`;
}
