export const downloadLocalStorage = () => {
  const keys = [
    "rewards",
    "players",
    "shops",
    "shop_categories",
    "services",
    "hex_coordinates",
  ];

  // Retrieve the data for the specified keys from localStorage
  const localStorageData: { [key: string]: string } = {};
  keys.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value !== null) {
      localStorageData[key] = JSON.parse(value);
    }
  });

  // Convert the data to a JSON string
  const jsonString = JSON.stringify(localStorageData, null, 2);

  // Create a Blob object from the JSON string
  const blob = new Blob([jsonString], { type: "application/json" });

  // Get the current date and time
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  // Format the date and time into a string
  const dateTimeString = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;

  // Create the filename with the date and time
  const filename = `localStorageData_${dateTimeString}.json`;

  // Create a link element
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;

  // Append the link to the body (this is necessary for Firefox)
  document.body.appendChild(link);

  // Trigger the download by simulating a click on the link
  link.click();

  // Clean up by removing the link element
  document.body.removeChild(link);
};
