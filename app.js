// Function to fetch data from data.json
function fetchData() {
    return fetch('data.json')
      .then(response => response.json())
      .catch(error => console.error(error));
  }
  
  // Function to display list of tags
  function displayTags(data) {
    const tagList = document.getElementById('tags');
    const allTag = document.createElement('li');
    allTag.textContent = 'All';
    allTag.addEventListener('click', () => displayArticles(data)); // Show all links on click
    tagList.appendChild(allTag);
  
    const uniqueTags = new Set();
  
    // Extract unique tags from all articles (excluding 'All')
    data.forEach(article => article.tags.forEach(tag => {
      if (tag !== 'All') {
        uniqueTags.add(tag);
      }
    }));
  
    // Create list elements for each tag
    const tagElements = [...uniqueTags].map(tag => {
      const li = document.createElement('li');
      li.textContent = tag;
      li.addEventListener('click', () => filterArticles(tag));
      return li;
    });
  
    // Add tag elements to the list
    const ul = document.createElement('ul');
    ul.append(...tagElements);
    tagList.appendChild(ul);
  }
  
  // Function to display list of articles
  function displayArticles(data) {
    const articleList = document.getElementById('articles');
    articleList.innerHTML = ''; // Clear existing articles
  
    // Create list elements for each article
    const articleElements = data.map(article => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = article.url;
      a.textContent = article.title;
      li.appendChild(a);
      return li;
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
  