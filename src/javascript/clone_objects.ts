import React from "react";

export const cloneObject = function(object: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const targetDiv = object.currentTarget; // Access the clicked div element
    const clonedDiv = targetDiv.cloneNode(true) as HTMLDivElement; // Clone the div, including its children (SVG)

    // Set a custom class on the cloned div
    clonedDiv.classList.add('draggable'); // Replace 'custom-class' with the class you want to add

    // Find the image element inside the cloned div and apply new styles
    const clonedImage = clonedDiv.querySelector('svg'); // Assuming the image is an <img> element

    if (clonedImage) {
        clonedImage.style.width = '100px'; // Set image width to 50px
        clonedImage.style.height = '100px'; // Set image height to 50px
        clonedImage.style.padding = '0'; // Remove any padding
        clonedImage.style.margin = '0';  // Remove any margin if present
    }

    // Remove any extra padding/margins from the cloned div
    clonedDiv.style.padding = '0';
    clonedDiv.style.margin = '0';
    clonedDiv.style.width = '100px';
    clonedDiv.style.height = '100px';

    const listItem = document.createElement('li');
    listItem.style.width = '110px'
    listItem.appendChild(clonedDiv);

    const Footer = document.querySelector('[data-target="componentContainer"]');
    if (Footer) {
        Footer.appendChild(listItem);
    }
};