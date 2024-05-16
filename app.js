// Function to fetch data from data.json
function fetchData() {
    return fetch('data.json')
      .then(response => response.json())
      .catch(error => console.error(error));
  }
  
  // Function to display list of tags
// Function to display list of tags
function displayTags(data) {
    const tagList = document.getElementById('tags');
    const ul = document.createElement('ul');
  
    const allTag = document.createElement('li');
    const allTagSpan = document.createElement('span');
    allTagSpan.classList.add('btn', 'btn-secondary', 'rounded-pill', 'btn-sm');
    allTagSpan.textContent = 'All';
    allTag.appendChild(allTagSpan);
    allTag.addEventListener('click', () => displayArticles(data)); // Show all links on click
    allTag.style.display = 'flex';
    allTag.style.alignItems = 'center';
    allTag.style.marginRight = '10px'; // Optional spacing
  
    ul.appendChild(allTag); // Now append 'All' tag to the ul
  
    // Extract all tags from articles
    const allTags = data.flatMap(article => article.tags);
  
    // Convert to a Set to remove duplicates (excluding 'All')
    const uniqueTags = new Set(allTags.filter(tag => tag !== 'All'));
  
    // Sort tags alphabetically (case-insensitive)
    const sortedTags = [...uniqueTags].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  
    // Create list elements for each tag
    const tagElements = sortedTags.map(tag => {
      const li = document.createElement('li');
      const tagSpan = document.createElement('span');
      tagSpan.classList.add('btn', 'btn-secondary', 'rounded-pill', 'btn-sm');
      tagSpan.textContent = tag;
      li.appendChild(tagSpan);
      li.addEventListener('click', () => filterArticles(tag));
      li.style.display = 'flex';
      li.style.alignItems = 'center';
      return li;
    });
  
    // Add regular tag elements to the list
    ul.append(...tagElements);
  
    // Finally, append the entire ul to the #tags element
    tagList.appendChild(ul);
  }
  
  
  
  // Function to display list of articles
  function displayArticles(data) {
    const articleList = document.getElementById('articles');
    articleList.innerHTML = ''; // Clear existing articles
  
    const articleElements = data.map(article => {
      const listGroup = document.createElement('div');
      listGroup.classList.add('list-group', 'list-group-flush');
  
      const listItem = document.createElement('div');
      listItem.classList.add('list-group-item', 'd-flex', 'align-items-center', 'px-0');
  
      const contentDiv = document.createElement('div');
      contentDiv.classList.add('flex-fill');
  
      const articleTitle = document.createElement('a');
      articleTitle.href = '#'; // Replace with actual URL from article data (optional)
      articleTitle.classList.add('d-block', 'h6', 'font-bold', 'mb-1');
      articleTitle.textContent = article.title;
      contentDiv.appendChild(articleTitle);
  
      const articleTags = document.createElement('span');
      articleTags.classList.add('d-block', 'text-sm', 'mb-2', 'text-muted');
      articleTags.textContent = article.tags.join(' - '); // Combine tags with separator
      contentDiv.appendChild(articleTags);
  
      const badgesDiv = document.createElement('div');
      badgesDiv.classList.add('d-flex', 'mx-n1'); // You can add badges here if needed
  
      contentDiv.appendChild(badgesDiv);
      listItem.appendChild(contentDiv);
  
      const buttonDiv = document.createElement('div');
      buttonDiv.classList.add('ms-auto', 'text-end');
  
      const openLinkButton = document.createElement('a');
      openLinkButton.href = "https://github.com/MahdiMajidzadeh/iranian-businesses-data-reports/blob/main/reports/" + article.url + "?raw=true"; // Use actual URL from article data
      openLinkButton.classList.add('btn', 'btn-sm', 'btn-neutral');
      openLinkButton.target = '_blank';
      openLinkButton.textContent = 'Get Report';
      buttonDiv.appendChild(openLinkButton);
  
      listItem.appendChild(buttonDiv);
      listGroup.appendChild(listItem);
  
      return listGroup; // Return the entire listGroup element
    });
  
    // Add article elements to the list
    articleList.append(...articleElements);
  }
  
  
  // Function to filter articles based on tag
  function filterArticles(selectedTag) {
    const articles = JSON.parse(localStorage.getItem('articles')); // Get all articles from storage
    let filteredArticles;
    if (selectedTag === 'All') {
      filteredArticles = articles;
    } else {
      filteredArticles = articles.filter(article => article.tags.includes(selectedTag));
    }
    displayArticles(filteredArticles);
  }
  
  // Fetch data and display on page load
  fetchData()
    .then(data => {
      localStorage.setItem('articles', JSON.stringify(data)); // Store data in local storage
      displayTags(data);
      displayArticles(data);
    });
  