// script.js

// Function to load JSON data from "output.json"
async function loadData() {
  try {
    const response = await fetch('output.json');
    const data = await response.json();
    
    // Sort by year
    data.sort((a, b) => b.year - a.year);
    
    // Get unique tags and sort them in ascending order
    const tags = [...new Set(data.flatMap(item => item.tags))].sort();
    
    // Get the elements where tags and titles will be displayed
    const tagList = document.getElementById('tagList');
    const titleList = document.getElementById('titleList');
    
    // Display tags
    tags.forEach(tag => {
        const tagElement = document.createElement('a');
        tagElement.className = 'badge text-bg-secondary mx-1 cursor-pointer';
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
        tagElements.forEach(el => el.classList.remove('text-bg-dark'));
    
        const activeTag = tagElements[Array.from(tagElements).findIndex(el => el.textContent === tag)];
        activeTag.classList.add('text-bg-dark');
    
        const filteredData = items.filter(item => item.tags.includes(tag));
        displayTitles(filteredData, titleList);
    }
    
      // Function to display titles
      function displayTitles(items, listElement) {
        listElement.innerHTML = '';
        items.forEach(item => {
            // Create card structure
            const cardDiv = document.createElement('div');
            cardDiv.className = 'col-12 col-md-4';

            cardDiv.innerHTML = `
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="flex-fill ms-4">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <div>
                                    <span class="d-block h5 mb-0">${item.title}</span>
                                </div>
                            </div>
                            <p class="text-sm text-muted my-2 pe-lg-5 text-start">
                                ${item.tags.join(' - ')}
                            </p>
                            <div class="d-flex align-items-center">
                                <a href="https://github.com/MahdiMajidzadeh/iranian-businesses-data-reports/blob/main/reports/${item.url}?raw=true" class="btn btn-sm btn-neutral">
                                    <i class="bi bi-cloud-arrow-down"></i> get
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            listElement.appendChild(cardDiv);
          });
      }
  } catch (error) {
      console.error('Error loading the JSON data', error);
  }
}

// Load data on page load
window.onload = loadData;
