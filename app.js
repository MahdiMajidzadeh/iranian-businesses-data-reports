// Load JSON data and display with Flux.dev components
async function loadData() {
  try {
    // Show loading state
    const titleList = document.getElementById('titleList');
    titleList.innerHTML = '<div class="loading"></div>';
    
    const response = await fetch('output.json');
    const data = await response.json();
    
    // Sort by year (newest first)
    data.sort((a, b) => b.year - a.year);
    
    // Get unique tags and sort them (excluding year values)
    const allTags = data.flatMap(item => item.tags);
    const yearPattern = /^\d{4}$/; // Matches 4-digit years
    const tags = [...new Set(allTags.filter(tag => !yearPattern.test(tag)))].sort();
    
    // Get the elements where tags and titles will be displayed
    const tagList = document.getElementById('tagList');
    
    // Add "Show All" button
    const showAllButton = document.createElement('span');
    showAllButton.classList.add('tag-badge', 'tag-badge-primary');
    showAllButton.textContent = 'Show All';
    showAllButton.addEventListener('click', () => showAll(data));
    tagList.appendChild(showAllButton);
    
    // Display tags as badges
    tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.classList.add('tag-badge', 'tag-badge-secondary');
        tagElement.textContent = tag;
        tagElement.addEventListener('click', () => filterByTag(tag, data));
        tagList.appendChild(tagElement);
    });
    
    // Display titles
    displayTitles(data, titleList);
    updateResultCount(data.length);
    
    // Add search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredData = data.filter(item => 
            item.title.toLowerCase().includes(searchTerm) ||
            item.year.includes(searchTerm) ||
            item.tags.filter(tag => !/^\d{4}$/.test(tag)).some(tag => tag.toLowerCase().includes(searchTerm))
        );
        displayTitles(filteredData, titleList);
        updateResultCount(filteredData.length);
    });
    
    // Show all function
    function showAll(items) {
        const tagElements = document.querySelectorAll('.tag-badge');
        tagElements.forEach(el => {
            if (el.textContent === 'Show All') {
                el.className = 'tag-badge tag-badge-primary';
            } else {
                el.className = 'tag-badge tag-badge-secondary';
            }
        });
        searchInput.value = '';
        displayTitles(items, titleList);
        updateResultCount(items.length);
    }
    
    // Filter by tag function
    function filterByTag(tag, items) {
        const tagElements = document.querySelectorAll('.tag-badge');
        tagElements.forEach(el => {
            if (el.textContent === 'Show All') {
                el.className = 'tag-badge tag-badge-secondary';
            } else {
                el.className = 'tag-badge tag-badge-secondary';
            }
        });
    
        const activeTag = Array.from(tagElements).find(el => el.textContent === tag);
        if (activeTag) {
            activeTag.className = 'tag-badge tag-badge-primary';
        }
    
        const filteredData = items.filter(item => item.tags.includes(tag));
        searchInput.value = '';
        displayTitles(filteredData, titleList);
        updateResultCount(filteredData.length);
    }
    
    // Update result count
    function updateResultCount(count) {
        const resultCount = document.getElementById('resultCount');
        resultCount.textContent = `${count} report${count !== 1 ? 's' : ''} found`;
    }
    
    // Function to display titles using regular HTML
    function displayTitles(items, listElement) {
        listElement.innerHTML = '';
        
        items.forEach(item => {
            // Create card container
            const cardContainer = document.createElement('div');
            cardContainer.className = 'report-card';
            
            // Create card content
            cardContainer.innerHTML = `
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">${item.title}</h3>
                        <span class="card-year">Year: ${item.year}</span>
                    </div>
                    <div class="card-body">
                        <p class="card-tags">Categories: ${item.tags.filter(tag => !/^\d{4}$/.test(tag)).join(', ')}</p>
                    </div>
                    <div class="card-footer">
                        <a href="https://github.com/MahdiMajidzadeh/iranian-businesses-data-reports/blob/main/reports/${item.url}?raw=true"
                           target="_blank"
                           class="btn btn-primary btn-sm">
                            Download Report
                        </a>
                        <span class="file-type">PDF</span>
                    </div>
                </div>
            `;
            
            listElement.appendChild(cardContainer);
        });
    }
  } catch (error) {
      console.error('Error loading the JSON data', error);
  }
}

// Load data when DOM is ready
document.addEventListener('DOMContentLoaded', loadData);
