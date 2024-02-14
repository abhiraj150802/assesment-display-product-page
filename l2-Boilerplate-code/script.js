console.log('====================================');
console.log("Connected");
console.log('====================================');







const productContainer = document.getElementById('productContainer');

async function fetchProducts(category) {
  try {
    const response = await fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json');
    const data = await response.json();
    const categoryData = data.categories.find(cat => cat.category_name.toLowerCase() === category.toLowerCase());
    return categoryData ? categoryData.category_products : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return []; // Return an empty array in case of error
  }
}


function renderProductCard(product) {
  const discount = Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100);
  const productCard = document.createElement('div');
  productCard.classList.add('product-card');
  
  const productImage = document.createElement('img');
  productImage.src = product.image;
  productImage.alt = 'Product Image';
  productImage.classList.add('product-image');
  productCard.appendChild(productImage);
  
  if (product.badge_text) {
    const productBadge = document.createElement('div');
    productBadge.classList.add('product-badge');
    productBadge.textContent = product.badge_text;
    productCard.appendChild(productBadge);
  }

  // Create a div to contain product title and vendor
  const titleVendorContainer = document.createElement('div');
  titleVendorContainer.classList.add('title-vendor-container');
  
  // Display only the first two words of the product title
  const titleWords = product.title.split(' ').slice(0, 2).join(' ');
  const productTitle = createProductInfoElement('div', 'product-title', titleWords);
  
  // Display vendor information
  const vendor = createProductInfoElement('div', 'vendor', `${product.vendor}`);

  // Append product title and vendor to the container
  titleVendorContainer.append(productTitle, vendor);

  // Display price information
  const priceInfo = document.createElement('div');
  priceInfo.classList.add('price-info');
  const price = createProductInfoElement('div', 'price', `Rs ${product.price}`);
  const compareAtPrice = createProductInfoElement('div', 'compare-at-price', ` ${product.compare_at_price}`);
  const discountElement = createProductInfoElement('div', 'discount', ` ${discount}% off`);
  priceInfo.append(price, compareAtPrice, discountElement);

  // Add-to-cart button
  const addToCartButton = createProductInfoElement('button', 'add-to-cart', 'Add to Cart');

  // Append elements to product card
  productCard.append(titleVendorContainer, priceInfo, addToCartButton);

  return productCard;
}














function createProductInfoElement(tagName, className, textContent) {
  const element = document.createElement(tagName);
  element.classList.add(className);
  element.textContent = textContent;
  return element;
}

function showProducts(category) {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.classList.toggle('active', tab.textContent.toLowerCase() === category.toLowerCase());
  });

  fetchProducts(category)
    .then(products => {
      productContainer.innerHTML = '';
      products.forEach(product => {
        const productCard = renderProductCard(product);
        productContainer.appendChild(productCard);
      });
    });
}

// Initially show products for the 'Men' category
showProducts('Men');
