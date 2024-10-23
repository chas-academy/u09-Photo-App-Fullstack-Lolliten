  // Capitalize the first letter of the first name and last name
  
  const capitalizeFirstLetters = (fullName) => {
    if (!fullName) return ""; // Handle empty input
    return fullName
        .split(" ")
        .map(name => name.charAt(0).toUpperCase() + name.slice(1))
        .join(" ");
};

export default capitalizeFirstLetters;
  
  // const capitalizeFirstLetter = (name) => {
  //   if (!name) return ""; // Handle empty input
  //   return name.charAt(0).toUpperCase() + name.slice(1);
  // };
  // export default capitalizeFirstLetter;