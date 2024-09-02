// script.js

// Function to load JSON data from "output.json"
async function loadData() {
  try {
      const response = await fetch('output.json');
      const data = await response.json();

      // Sort by year
      data.sort((a, b) => b.year - a.year);

      // Get unique tags
      const tags = [...new Set(data.flatMap(item => item.tags))];

      const tagList = document.getElementById('tagList');
      const titleList = document.getElementById('titleList');

      // Display tags
      tags.forEach(tag => {
          const tagElement = document.createElement('span');
          tagElement.textContent = tag;
          tagElement.classList.add('tag');
          tagElement.addEventListener('click', () => filterByTag(tag, data));
          tagList.appendChild(tagElement);
      });

      // Display titles
      displayTitles(data, titleList);

      // Filter by tag
      function filterByTag(tag, items) {
          const tagElements = document.querySelectorAll('.tag');
          tagElements.forEach(el => el.classList.remove('active'));

          const activeTag = tagElements[Array.from(tagElements).findIndex(el => el.textContent === tag)];
          activeTag.classList.add('active');

          const filteredData = items.filter(item => item.tags.includes(tag));
          displayTitles(filteredData, titleList);
      }

      // Function to display titles
      function displayTitles(items, listElement) {
          listElement.innerHTML = '';
          items.forEach(item => {
              const li = document.createElement('li');
              const a = document.createElement('a');
              a.href = item.url;
              a.textContent = `${item.title} (${item.year})`;
              li.appendChild(a);
              listElement.appendChild(li);
          });
      }
  } catch (error) {
      console.error('Error loading the JSON data', error);
  }
}

// Load data on page load
window.onload = loadData;
