export const extractRoles = (rolesArray) => {
    const marketingArray=['Marketing Executive','Marketing Leader'];
    if(!rolesArray.length){
        return []
    }
    if(rolesArray.every(value=>marketingArray.includes(value))){
        return ['Marketing Executive']
    }
    // Regular expression to match the role part without numbers
    const roleRegex = /([a-zA-Z\s]+)/;

    // Use map to extract roles from each string in the array
    const extractedRoles = rolesArray.map(roleString => {
        const match = roleString.match(roleRegex);
        return match ? match[1] : null;
    });

    // Filter out null values (strings without matches)
    const filteredRoles = extractedRoles
    .filter(role => role !== null)
    .map(role => role.trim());    
    return filteredRoles;
}

export const isDevelopment =!import.meta.env.MODE || import.meta.env.MODE === 'development'
//this function convert date from 2023-12-02T14:08:41.182Z to 02/12/2023
export const convertDate=(inputDate) =>{
  const date = new Date(inputDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export const convertCamelCaseToTitleCase=(text)=> {
  if(!text){
    return ''
  }
  // Split the text by uppercase letters
  const words = text.split(/(?=[A-Z])/);

  // Convert the first letter of each word to uppercase and the rest to lowercase
  const titleCaseWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

  // Join the words with a space
  const titleCaseText = titleCaseWords.join(' ');

  return titleCaseText;
}

export const redirectRoute=(role)=>{
  let dashboardRoute;
  switch(role){
    case 'HR':
      dashboardRoute='/hrmgmt/dashboard';
      break;
    case 'HR Executive':
      dashboardRoute='/hrmgmt/dashboard';
      break;
    case 'HR Manager':
      dashboardRoute='/hrmgmt/dashboard';
      break;
    case 'CEO':
      dashboardRoute='/ceo/dashboard';
      break;
    default:
      dashboardRoute='/dashboard';
      break;
  }
  return dashboardRoute;
}
