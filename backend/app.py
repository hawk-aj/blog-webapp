from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# Sample data - in a real app, this would come from a database
PROFILE_DATA = {
    "name": "Aarya Jha",
    "title": "Data Science Specialist & AI/ML Researcher",
    "tagline": "Transforming data into intelligence, One curious obsession at a time",
    "location": "Pune, Maharashtra",
    "email": "aj240502@gmail.com",
    "phone": "+91 6263883707",
    "github": "hawk-aj",
    "linkedin": "aarya-jha-2402",
    "bio": "Passionate Data Science Specialist with expertise in machine learning, computer vision, and cloud technologies. Currently working at Atomberg Technologies, developing innovative recommendation engines and AI solutions. Strong background in research and implementation of novel approaches in data processing and analysis.",
    "skills": {
        "languages": ["Python", "C++", "SQL", "JavaScript"],
        "tools": ["AWS Athena", "AWS Glue", "AWS Lambda", "AWS RDS"],
        "frameworks": ["Dash", "Plotly", "Flask", "React"],
        "expertise": ["Data Analytics", "Computer Vision", "NLP", "Core Electronics", "Cloud Computing"]
    }
}

EXPERIENCE_DATA = [
    {
        "id": 1,
        "company": "Atomberg Technologies",
        "position": "Data Science Specialist",
        "duration": "Jul. 2023 — Present",
        "location": "Pune",
        "description": [
            "Developed a recommendation engine for user behavior analysis using a novel convolution-inspired matrix approach",
            "Led firmware development for smart devices with rule-based decision mechanisms",
            "Implemented cloud capabilities using AWS Glue and Lambda for accessible AI solutions",
            "Designed and managed AWS RDS instances for scalable data storage",
            "Made archival data queryable using AWS Athena for enhanced data accessibility"
        ]
    },
    {
        "id": 2,
        "company": "Simbo.ai",
        "position": "Research Intern",
        "duration": "Jan. 2023 — Apr. 2023",
        "location": "Remote",
        "description": [
            "Implemented a custom Speaker Diarization Pipeline with novel clustering approach",
            "Conducted extensive research on existing speaker diarization methodologies",
            "Developed POC with submodules from various existing pipelines"
        ]
    },
    {
        "id": 3,
        "company": "College Of Military Engineering",
        "position": "ML & IOT Intern",
        "duration": "Oct. 2021 — Apr. 2022",
        "location": "Pune",
        "description": [
            "Implemented machine learning algorithms for military and defense applications",
            "Worked on IoT principles with hands-on approach to ML algorithms",
            "Developed projects focusing on core IoT principles and practical ML implementation"
        ]
    }
]

BLOG_POSTS = [
    {
        "id": 1,
        "title": "Revolutionizing Recommendation Systems: A Matrix-Based Approach",
        "excerpt": "How we moved beyond traditional collaborative filtering to develop a convolution-inspired recommendation engine that actually works.",
        "date": "2024-03-15",
        "tags": ["Machine Learning", "Recommendation Systems", "Data Science"],
        "content": "Traditional recommendation systems often fail to capture the nuanced patterns in user behavior..."
    },
    {
        "id": 2,
        "title": "Speaker Diarization: The Art of Voice Separation",
        "excerpt": "Exploring novel clustering approaches in speaker diarization and their real-world applications.",
        "date": "2024-02-20",
        "tags": ["NLP", "Audio Processing", "Research"],
        "content": "Speaker diarization is the process of partitioning an audio stream into homogeneous segments..."
    },
    {
        "id": 3,
        "title": "AWS in Production: Lessons from Building Scalable AI Solutions",
        "excerpt": "Real-world insights from deploying machine learning models using AWS Glue, Lambda, and RDS.",
        "date": "2024-01-10",
        "tags": ["AWS", "Cloud Computing", "MLOps"],
        "content": "Building production-ready AI solutions requires more than just good algorithms..."
    }
]

RAMBLINGS = [
    {
        "id": 1,
        "title": "The Philosophy of Data: Why Numbers Tell Stories",
        "content": "Every dataset is a narrative waiting to be discovered. In my journey through data science, I've learned that the most profound insights come not from complex algorithms, but from asking the right questions.",
        "date": "2024-03-01",
        "mood": "contemplative"
    },
    {
        "id": 2,
        "title": "Coffee, Code, and Convergence",
        "content": "3 AM thoughts: Is there a correlation between caffeine intake and algorithm performance? Probably not scientifically, but definitely personally. Some of my best breakthroughs happen when the world is quiet and the code is loud.",
        "date": "2024-02-15",
        "mood": "caffeinated"
    },
    {
        "id": 3,
        "title": "The Beauty of Failed Experiments",
        "content": "Today's failed model taught me more than last week's successful deployment. In research, failure isn't the opposite of success—it's the stepping stone to it.",
        "date": "2024-01-20",
        "mood": "reflective"
    },
    {
        "id": 4,
        "title": "Pune Cafes and Data Patterns",
        "content": "Sitting at Cafe Goodluck, watching the evening crowd, I realized that human behavior follows patterns just like data points. The uncle who orders the same chai every day at 5 PM, the college students clustering around corner tables—it's all beautiful, predictable chaos. Maybe the best datasets are the ones we live in.",
        "date": "2024-02-28",
        "mood": "observant"
    },
    {
        "id": 5,
        "title": "Lessons from History: WW2 Codebreakers and Modern ML",
        "content": "Reading about Bletchley Park again. Those mathematicians breaking Enigma with limited computing power achieved what we struggle with today despite having supercomputers. Sometimes I wonder if we've overcomplicated things. The elegance of their approach—pattern recognition, statistical analysis, human intuition—reminds me that the best AI solutions are often the simplest ones.",
        "date": "2024-02-10",
        "mood": "inspired"
    },
    {
        "id": 6,
        "title": "Sunset Algorithms",
        "content": "Watching the sunset from my terrace, I noticed how the colors blend seamlessly—no harsh transitions, just smooth gradients. Nature's gradient descent is perfect. No learning rate to tune, no overfitting, just pure optimization. Maybe that's what we're missing in our models: the patience to let things evolve naturally.",
        "date": "2024-01-25",
        "mood": "peaceful"
    },
    {
        "id": 7,
        "title": "The German Coffee Shop Paradox",
        "content": "There's this small German bakery in Koregaon Park that serves the most incredible coffee. The owner, an elderly German gentleman, measures everything by hand—no digital scales, no precise timers. Yet every cup is perfect. It made me think: sometimes the most sophisticated algorithms can't replace decades of intuitive experience. Data science needs both precision and intuition.",
        "date": "2024-01-15",
        "mood": "thoughtful"
    },
    {
        "id": 8,
        "title": "War Stories and Data Stories",
        "content": "My grandfather used to tell stories about the 1965 war, how they had to make critical decisions with incomplete information. Today, I face similar challenges with incomplete datasets. The difference? He had to trust his instincts; I have algorithms. But maybe the real skill is knowing when to trust the data and when to trust your gut.",
        "date": "2024-01-05",
        "mood": "nostalgic"
    }
]

@app.route('/')
def home():
    return jsonify({"message": "Welcome to Aarya's Portfolio API"})

@app.route('/api/profile')
def get_profile():
    return jsonify(PROFILE_DATA)

@app.route('/api/experience')
def get_experience():
    return jsonify(EXPERIENCE_DATA)

@app.route('/api/blogs')
def get_blogs():
    return jsonify(BLOG_POSTS)

@app.route('/api/blogs/<int:blog_id>')
def get_blog(blog_id):
    blog = next((blog for blog in BLOG_POSTS if blog['id'] == blog_id), None)
    if blog:
        return jsonify(blog)
    return jsonify({"error": "Blog not found"}), 404

@app.route('/api/ramblings')
def get_ramblings():
    return jsonify(RAMBLINGS)

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json()
    # In a real app, you'd save this to a database or send an email
    return jsonify({"message": "Thank you for your message! I'll get back to you soon."})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
