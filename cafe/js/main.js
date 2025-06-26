
const siteTitle = "Café Bonjour";
const description = "Your cozy corner in the city";
const copyRight = "&copy; 2024 Café Bonjour. All rights reserved.";

console.log(siteTitle);
// alert(siteTitle);

document.title = siteTitle;
const titleElement = document.getElementById('title');
titleElement.innerHTML = siteTitle;

const descriptionElement = document.getElementById('description');
descriptionElement.innerHTML = description;

const copyRightElement = document.getElementById('copy-right');
copyRightElement.innerHTML = copyRight;