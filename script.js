// // Base URL for API
// const BASE_URL = 'http://localhost:3000';

// // Axios instance with base configuration
// const api = axios.create({
//     baseURL: BASE_URL,
//     headers: {
//         'Content-Type': 'application/json'
//     }
// });

// Add token to requests if it exists
// api.interceptors.request.use(config => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// UI Functions
function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('coursesContainer').style.display = 'none';
}

function showSignup() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
    document.getElementById('coursesContainer').style.display = 'none';
}

function showCourses() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('coursesContainer').style.display = 'block';
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('signupBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'block';
}

// Authentication Functions
async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await axios.post('http://localhost:3000/user/login', { email, password });
        localStorage.setItem('token', response.data.token);
        showCourses();
        fetchCourses();
    } catch (error) {
        alert('Login failed. Please check your credentials.');
        console.error('Login error:', error);
    }
}

async function signup() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        await axios.post('http://localhost:3000/user/signup', {
            firstName,
            lastName,
            email,
            password
        });
        alert('Signup successful! Please login.');
        showLogin();
    } catch (error) {
        alert('Signup failed. Please try again.');
        console.error('Signup error:', error);
    }
}

function logout() {
    localStorage.removeItem('token');
    document.getElementById('loginBtn').style.display = 'block';
    document.getElementById('signupBtn').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'none';
    showLogin();
}

// Course Functions
async function fetchCourses() {
    try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        if (!token) {
            alert('Please login first.');
            showLogin();
            return;
        }
        const response = await axios.get('http://localhost:3000/course/preview', {headers: { Authorization: `Bearer ${token}`}});
        displayCourses(response.data.msg);
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

function displayCourses(courses) {
    const coursesList = document.getElementById('coursesList');
    coursesList.innerHTML = '';

    courses.forEach(course => {
        const courseCard = `
            <div class="course-card">
                <img src="${course.imageUrl || 'https://via.placeholder.com/300x200'}" 
                     alt="${course.title}" 
                     class="course-image">
                <div class="course-info">
                    <h3 class="course-title">${course.title}</h3>
                    <p class="course-description">${course.description}</p>
                    <p class="course-price">$${course.price}</p>
                    <button class="purchase-btn" onclick="purchaseCourse('${course._id}')">
                        Purchase Course
                    </button>
                </div>
            </div>
        `;
        coursesList.innerHTML += courseCard;
    });
}

async function purchaseCourse(courseId) {
    if (!localStorage.getItem('token')) {
        alert('Please login to purchase courses');
        showLogin();
        return;
    }

    try {
        const response = await axios.post('http://localhost:3000/course/purchase', { courseId },{ headers: { Authorization: `Bearer ${token}` }});
        alert('Course purchased successfully!');
    } catch (error) {
        alert('Failed to purchase course. Please try again.');
        console.error('Purchase error:', error);
    }
}

// Initial load
window.onload = () => {
    if (localStorage.getItem('token')) {
        showCourses();
        fetchCourses();
    } else {
        showLogin();
    }
};