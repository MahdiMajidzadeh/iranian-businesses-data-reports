// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

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
    
    // Get unique years and sort them (newest first)
    const years = [...new Set(data.map(item => item.year))].sort((a, b) => b - a);
    
    // Get the elements where tags and titles will be displayed
    const tagList = document.getElementById('tagList');
    const yearSelect = document.getElementById('yearSelect');
    
    // Populate year selector
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });
    
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
        tagElement.textContent = capitalizeFirstLetter(tag);
        tagElement.setAttribute('data-tag', tag);
        tagElement.addEventListener('click', () => filterByTag(tag, data));
        tagList.appendChild(tagElement);
    });

    // Mobile collapse for tags
    setupMobileTagCollapse(tagList);
    
    // Display titles
    displayTitles(data, titleList);
    updateResultCount(data.length);
    
    // Add search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => applyFilters());
    
    // Add year filter functionality
    yearSelect.addEventListener('change', () => applyFilters());
    
    // Combined filter function
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedYear = yearSelect.value;
        
        let filteredData = data.filter(item => {
            // Search filter
            const matchesSearch = searchTerm === '' || 
                item.title.toLowerCase().includes(searchTerm) ||
                item.year.includes(searchTerm) ||
                item.tags.filter(tag => !/^\d{4}$/.test(tag)).some(tag => tag.toLowerCase().includes(searchTerm));
            
            // Year filter
            const matchesYear = selectedYear === '' || item.year === selectedYear;
            
            return matchesSearch && matchesYear;
        });
        
        displayTitles(filteredData, titleList);
        updateResultCount(filteredData.length);
    }
    
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
        yearSelect.value = '';
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
    
        const activeTag = Array.from(tagElements).find(el => el.getAttribute('data-tag') === tag);
        if (activeTag) {
            activeTag.className = 'tag-badge tag-badge-primary';
        }
    
        // Apply tag filter along with existing search and year filters
        const searchTerm = searchInput.value.toLowerCase();
        const selectedYear = yearSelect.value;
        
        const filteredData = items.filter(item => {
            const matchesTag = item.tags.includes(tag);
            const matchesSearch = searchTerm === '' || 
                item.title.toLowerCase().includes(searchTerm) ||
                item.year.includes(searchTerm) ||
                item.tags.filter(tag => !/^\d{4}$/.test(tag)).some(tag => tag.toLowerCase().includes(searchTerm));
            const matchesYear = selectedYear === '' || item.year === selectedYear;
            
            return matchesTag && matchesSearch && matchesYear;
        });
        
        displayTitles(filteredData, titleList);
        updateResultCount(filteredData.length);
    }
    
    // Setup collapsible tag list on mobile
    function setupMobileTagCollapse(container) {
        let toggleBtn = null;
        
        function ensureSetup() {
            container.classList.add('tags-collapsed');
            if (!toggleBtn) {
                toggleBtn = document.createElement('button');
                toggleBtn.className = 'tag-toggle-btn';
                toggleBtn.type = 'button';
                toggleBtn.textContent = 'Show more';
                toggleBtn.setAttribute('aria-expanded', 'false');
                container.parentElement.appendChild(toggleBtn);
                toggleBtn.addEventListener('click', () => {
                    const isCollapsed = container.classList.contains('tags-collapsed');
                    if (isCollapsed) {
                        container.classList.remove('tags-collapsed');
                        toggleBtn.textContent = 'Show less';
                        toggleBtn.setAttribute('aria-expanded', 'true');
                    } else {
                        container.classList.add('tags-collapsed');
                        toggleBtn.textContent = 'Show more';
                        toggleBtn.setAttribute('aria-expanded', 'false');
                    }
                });
            }
        }

        ensureSetup();
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
                        <p class="card-tags">Categories: ${item.tags.filter(tag => !/^\d{4}$/.test(tag)).map(tag => capitalizeFirstLetter(tag)).join(', ')}</p>
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
