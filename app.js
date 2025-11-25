function initializeApp() {
    const currentPage = window.location.pathname.split('/').pop();
    
    
    setupNavigation();
    
    
    switch(currentPage) {
        case 'index.html':
        case '':
            initializeHomePage();
            break;
        case 'users.html':
            initializeUsersPage();
            break;
        case 'products.html':
            initializeProductsPage();
            break;
    }
}


function setupNavigation() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.style.color = '#3498db';
            link.style.fontWeight = 'bold';
        }
    });
}


function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
    }
}


function clearErrorMessages() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
}



function initializeHomePage() {
    console.log('Página inicial inicializada');
    
}



let users = [];

function initializeUsersPage() {
    const userForm = document.getElementById('userForm');
    
    if (userForm) {
        userForm.addEventListener('submit', handleUserFormSubmit);
    }
    

    loadUsersFromAPI();
}


function handleUserFormSubmit(e) {
    e.preventDefault();
    
    if (validateUserForm()) {
        addUser();
    }
}


function validateUserForm() {
    let isValid = true;
    
    
    const name = document.getElementById('name').value.trim();
    const surname = document.getElementById('surname').value.trim();
    const email = document.getElementById('email').value.trim();
    const age = parseInt(document.getElementById('age').value);
    const photo = document.getElementById('photo').value.trim();
    
    clearErrorMessages();
    
    
    if (name.length < 3 || name.length > 50) {
        showError('nameError', 'Nome deve ter entre 3 e 50 caracteres');
        isValid = false;
    }
    
    
    if (surname.length < 3 || surname.length > 50) {
        showError('surnameError', 'Sobrenome deve ter entre 3 e 50 caracteres');
        isValid = false;
    }
    

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
        showError('emailError', 'Email deve ser válido');
        isValid = false;
    }
    
    
    if (isNaN(age) || age <= 0 || age >= 120) {
        showError('ageError', 'Idade deve ser um número positivo menor que 120');
        isValid = false;
    }
    
    
    if (photo && !isValidURL(photo)) {
        showError('photoError', 'URL da foto deve ser válida');
        isValid = false;
    }
    
    return isValid;
}


function addUser() {
    
    const name = document.getElementById('name').value.trim();
    const surname = document.getElementById('surname').value.trim();
    const email = document.getElementById('email').value.trim();
    const age = parseInt(document.getElementById('age').value);
    const photo = document.getElementById('photo').value.trim();
    
    
    const user = {
        id: Date.now(), 
        name,
        surname,
        email,
        age,
        photo: photo || 'https://via.placeholder.com/150?text=Sem+Imagem'
    };
    
    users.push(user);
    
    renderUsers();
    

    document.getElementById('userForm').reset();
}

function removeUser(id) {
    users = users.filter(user => user.id !== id);
    renderUsers();
}

function renderUsers() {
    const usersList = document.getElementById('usersList');
    
    if (!usersList) return;
    
    usersList.innerHTML = '';
    
    if (users.length === 0) {
        usersList.innerHTML = '<p>Nenhum usuário cadastrado.</p>';
        return;
    }
    
    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'card';
        
        userCard.innerHTML = `
            <img src="${user.photo}" alt="${user.name} ${user.surname}" class="card-image">
            <div class="card-content">
                <h3 class="card-title">${user.name} ${user.surname}</h3>
                <p class="card-text"><strong>Email:</strong> ${user.email}</p>
                <p class="card-text"><strong>Idade:</strong> ${user.age}</p>
                <div class="card-actions">
                    <button class="btn-danger" onclick="removeUser(${user.id})">Remover</button>
                </div>
            </div>
        `;
        
        usersList.appendChild(userCard);
    });
}

async function loadUsersFromAPI() {
    try {
        const response = await fetch('https://dummyjson.com/users');
        const data = await response.json();
        
        const apiUsers = data.users.map(user => ({
            id: user.id,
            name: user.firstName,
            surname: user.lastName,
            email: user.email,
            age: user.age,
            photo: user.image || 'https://via.placeholder.com/150?text=Sem+Imagem'
        }));
        
        users = [...users, ...apiUsers];
        
        renderUsers();
    } catch (error) {
        console.error('Erro ao carregar usuários da API:', error);
    }
}


let products = [];

function initializeProductsPage() {
    const productForm = document.getElementById('productForm');
    
    if (productForm) {
        productForm.addEventListener('submit', handleProductFormSubmit);
    }
    
    loadProductsFromAPI();
}

function handleProductFormSubmit(e) {
    e.preventDefault();
    
    if (validateProductForm()) {
        addProduct();
    }
}

function validateProductForm() {
    let isValid = true;
    
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const price = parseFloat(document.getElementById('price').value);
    const brand = document.getElementById('brand').value.trim();
    const category = document.getElementById('category').value.trim();
    const photos = document.getElementById('photos').value.trim();
    
    clearErrorMessages();
    
    if (title.length < 3 || title.length > 50) {
        showError('titleError', 'Título deve ter entre 3 e 50 caracteres');
        isValid = false;
    }
    
    
    if (description.length < 3 || description.length > 50) {
        showError('descriptionError', 'Descrição deve ter entre 3 e 50 caracteres');
        isValid = false;
    }
    
    if (isNaN(price) || price <= 0 || price >= 120) {
        showError('priceError', 'Preço deve ser um número positivo menor que 120');
        isValid = false;
    }
    
    if (brand.length < 3 || brand.length > 50) {
        showError('brandError', 'Marca deve ter entre 3 e 50 caracteres');
        isValid = false;
    }
    
    if (category.length < 3 || category.length > 50) {
        showError('categoryError', 'Categoria deve ter entre 3 e 50 caracteres');
        isValid = false;
    }
    
    if (photos) {
        const photoURLs = photos.split(',').map(url => url.trim());
        for (let url of photoURLs) {
            if (url && !isValidURL(url)) {
                showError('photosError', 'Todas as URLs das fotos devem ser válidas');
                isValid = false;
                break;
            }
        }
    }
    
    return isValid;
}

function addProduct() {
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const price = parseFloat(document.getElementById('price').value);
    const brand = document.getElementById('brand').value.trim();
    const category = document.getElementById('category').value.trim();
    const photos = document.getElementById('photos').value.trim();
    
    let photoURLs = [];
    if (photos) {
        photoURLs = photos.split(',').map(url => url.trim()).filter(url => url);
    }
    
    if (photoURLs.length === 0) {
        photoURLs = ['https://via.placeholder.com/300?text=Sem+Imagem'];
    }
    
    const product = {
        id: Date.now(), 
        title,
        description,
        price,
        brand,
        category,
        photos: photoURLs
    };
    
    products.push(product);
    
    renderProducts();
    
    
    document.getElementById('productForm').reset();
}


function removeProduct(id) {
    products = products.filter(product => product.id !== id);
    renderProducts();
}


function renderProducts() {
    const productsList = document.getElementById('productsList');
    
    if (!productsList) return;
    
    productsList.innerHTML = '';
    
    if (products.length === 0) {
        productsList.innerHTML = '<p>Nenhum produto cadastrado.</p>';
        return;
    }
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'card';
        
        productCard.innerHTML = `
            <img src="${product.photos[0]}" alt="${product.title}" class="card-image">
            <div class="card-content">
                <h3 class="card-title">${product.title}</h3>
                <p class="card-text">${product.description}</p>
                <p class="card-text"><strong>Preço:</strong> R$ ${product.price.toFixed(2)}</p>
                <p class="card-text"><strong>Marca:</strong> ${product.brand}</p>
                <p class="card-text"><strong>Categoria:</strong> ${product.category}</p>
                <div class="card-actions">
                    <button class="btn-danger" onclick="removeProduct(${product.id})">Remover</button>
                </div>
            </div>
        `;
        
        productsList.appendChild(productCard);
    });
}


async function loadProductsFromAPI() {
    try {
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json();
        
        
        const apiProducts = data.products.map(product => ({
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
            brand: product.brand,
            category: product.category,
            photos: [product.thumbnail] || ['https://via.placeholder.com/300?text=Sem+Imagem']
        }));
        
        
        products = [...products, ...apiProducts];
        
        
        renderProducts();
    } catch (error) {
        console.error('Erro ao carregar produtos da API:', error);
    }
}


document.addEventListener('DOMContentLoaded', initializeApp);


window.removeUser = removeUser;
window.removeProduct = removeProduct;
