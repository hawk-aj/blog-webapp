# Aarya Jha - Portfolio Website

A modern, responsive portfolio website built with Flask (backend) and React (frontend), showcasing data science expertise, projects, blog posts, and personal insights.

## Features

- **Modern Design**: Dark theme with gradient accents and smooth animations
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Interactive Sections**:
  - Home: Hero section with animated elements and recent blog highlights
  - About: Personal journey, skills, education, and contact information
  - Work: Professional experience with detailed project descriptions
  - Blogs: Technical articles about data science and AI/ML
  - Ramblings: Personal thoughts from coffee shops, sunsets, and coding sessions
  - Contact: Contact form with FAQ section

## Video Walkthrough

[Video Walkthrough](https://youtu.be/_T89J8Fggcc)

This video walkthrough demonstrates the key features of the portfolio website, including:
- Navigation through different sections
- Responsive design across various screen sizes
- Interactive elements and animations
- Content organization and presentation

*Note: Replace `YOUTUBE_VIDEO_ID` with the actual YouTube video ID once the walkthrough is recorded and uploaded.*

## Tech Stack

### Backend (Flask)
- Flask 2.3.3
- Flask-CORS for cross-origin requests
- RESTful API endpoints
- JSON data storage (easily replaceable with database)

### Frontend (React)
- React 18.2.0
- React Router for navigation
- Framer Motion for animations
- Lucide React for icons
- Axios for API calls
- Modern CSS with CSS variables

## Project Structure

```
portfolio-webapp/
├── backend/
│   ├── app.py              # Flask application
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js  # Navigation component
│   │   │   └── Navbar.css
│   │   ├── pages/
│   │   │   ├── Home.js    # Landing page
│   │   │   ├── About.js   # About page
│   │   │   ├── Work.js    # Experience page
│   │   │   ├── Blogs.js   # Blog listing
│   │   │   ├── BlogPost.js # Individual blog post
│   │   │   ├── Ramblings.js # Personal thoughts
│   │   │   └── Contact.js # Contact form
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Component styles
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   └── package.json       # Node.js dependencies
└── README.md
```

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd portfolio-webapp/backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Run the Flask server:
```bash
python app.py
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd portfolio-webapp/frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

- `GET /api/profile` - Get profile information
- `GET /api/experience` - Get work experience data
- `GET /api/blogs` - Get all blog posts
- `GET /api/blogs/<id>` - Get specific blog post
- `GET /api/ramblings` - Get all ramblings
- `POST /api/contact` - Submit contact form

## Customization

### Adding New Content

1. **Blog Posts**: Edit the `BLOG_POSTS` array in `backend/app.py`
2. **Experience**: Modify the `EXPERIENCE_DATA` array in `backend/app.py`
3. **Ramblings**: Update the `RAMBLINGS` array in `backend/app.py`
4. **Profile Info**: Change the `PROFILE_DATA` object in `backend/app.py`

### Styling

- Global styles: `frontend/src/index.css`
- Component styles: `frontend/src/App.css`
- Navigation styles: `frontend/src/components/Navbar.css`

### Colors & Theme

The color scheme is defined in CSS variables in `frontend/src/index.css`:

```css
:root {
  --primary-color: #0066cc;
  --secondary-color: #00a8ff;
  --accent-color: #ff6b6b;
  --dark-bg: #0a0a0a;
  --light-bg: #1a1a1a;
  /* ... more variables */
}
```

## Deployment

### Backend Deployment
- Can be deployed to platforms like Heroku, Railway, or DigitalOcean
- For production, consider using a proper database instead of in-memory data
- Add environment variables for configuration

### Frontend Deployment
- Build the React app: `npm run build`
- Deploy to platforms like Netlify, Vercel, or GitHub Pages
- Update API endpoints to point to your deployed backend

## Features Highlights

### Design Elements
- **Catchy Title**: "Aarya.ai" with brain and code icons
- **Data Science Theme**: AI/ML focused content and terminology
- **Smooth Animations**: Framer Motion for engaging user experience
- **Responsive Design**: Mobile-first approach

### Content Sections
- **Professional Experience**: Detailed work history with Atomberg Technologies, Simbo.ai, and CME
- **Technical Blog Posts**: In-depth articles about recommendation systems, speaker diarization, and AWS
- **Personal Ramblings**: Unique content about coffee culture in Pune, WW2 history connections, and sunset observations
- **Skills Showcase**: Programming languages, tools, frameworks, and expertise areas

### Interactive Elements
- **Contact Form**: Functional form with validation and status feedback
- **Navigation**: Smooth scrolling and active state indicators
- **Hover Effects**: Subtle animations on cards and buttons
- **Loading States**: Spinners and skeleton screens for better UX

## Contributing

Feel free to fork this project and customize it for your own portfolio. The code is well-structured and documented for easy modification.

## License

This project is open source and available under the MIT License.
