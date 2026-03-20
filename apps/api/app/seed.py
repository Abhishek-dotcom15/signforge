"""Seed script for demo/development data."""
from app import create_app
from app.extensions import db
from app.models.user import User, UserRole
from app.models.sign import Sign, SignCategory, SignExample, SigmlFile
from app.models.story import Story, StoryChapter, StoryQuiz, QuizQuestion
from app.services.auth_service import hash_password


def seed():
    app = create_app()
    with app.app_context():
        db.create_all()

        # Skip if already seeded
        if User.query.filter_by(email="admin@signforge.dev").first():
            print("Database already seeded. Skipping.")
            return

        # ── Admin user ──
        admin = User(
            email="admin@signforge.dev",
            password_hash=hash_password("admin123"),
            full_name="Admin User",
            display_name="Admin",
            is_verified=True,
            onboarding_done=True,
        )
        db.session.add(admin)
        db.session.flush()
        db.session.add(UserRole(user_id=admin.id, role="admin"))
        db.session.add(UserRole(user_id=admin.id, role="learner"))

        # ── Demo user ──
        demo = User(
            email="demo@signforge.dev",
            password_hash=hash_password("demo1234"),
            full_name="Demo Learner",
            display_name="Demo",
            is_verified=True,
            onboarding_done=True,
        )
        db.session.add(demo)
        db.session.flush()
        db.session.add(UserRole(user_id=demo.id, role="learner"))

        # ── Teacher user ──
        teacher = User(
            email="teacher@signforge.dev",
            password_hash=hash_password("teach123"),
            full_name="ISL Teacher",
            display_name="Teacher",
            is_verified=True,
            onboarding_done=True,
        )
        db.session.add(teacher)
        db.session.flush()
        db.session.add(UserRole(user_id=teacher.id, role="teacher"))
        db.session.add(UserRole(user_id=teacher.id, role="learner"))

        # ── Signs ──
        signs_data = [
            ("Hello", "Namaste", "HELLO", "beginner", ["greetings"]),
            ("Thank you", "Dhanyavaad", "THANK-YOU", "beginner", ["greetings"]),
            ("Sorry", "Maaf kijiye", "SORRY", "beginner", ["greetings"]),
            ("Yes", "Haan", "YES", "beginner", ["basics"]),
            ("No", "Nahin", "NO", "beginner", ["basics"]),
            ("Please", "Kripya", "PLEASE", "beginner", ["greetings"]),
            ("Good morning", "Suprabhat", "GOOD-MORNING", "beginner", ["greetings"]),
            ("Good night", "Shubh ratri", "GOOD-NIGHT", "beginner", ["greetings"]),
            ("Help", "Madad", "HELP", "beginner", ["basics"]),
            ("Water", "Paani", "WATER", "beginner", ["food"]),
            ("Food", "Khana", "FOOD", "beginner", ["food"]),
            ("Home", "Ghar", "HOME", "beginner", ["places"]),
            ("School", "Vidyalay", "SCHOOL", "beginner", ["places"]),
            ("Family", "Parivaar", "FAMILY", "intermediate", ["people"]),
            ("Friend", "Dost", "FRIEND", "intermediate", ["people"]),
            ("Mother", "Maa", "MOTHER", "beginner", ["people"]),
            ("Father", "Pita", "FATHER", "beginner", ["people"]),
            ("Teacher", "Shikshak", "TEACHER", "beginner", ["people"]),
            ("Student", "Vidyaarthi", "STUDENT", "beginner", ["people"]),
            ("Love", "Pyaar", "LOVE", "intermediate", ["emotions"]),
            ("Happy", "Khush", "HAPPY", "beginner", ["emotions"]),
            ("Sad", "Dukhi", "SAD", "beginner", ["emotions"]),
            ("Angry", "Gussa", "ANGRY", "intermediate", ["emotions"]),
            ("Book", "Kitaab", "BOOK", "beginner", ["education"]),
            ("Write", "Likhna", "WRITE", "intermediate", ["education"]),
            ("Read", "Padhna", "READ", "intermediate", ["education"]),
            ("Learn", "Seekhna", "LEARN", "intermediate", ["education"]),
            ("Doctor", "Doctor", "DOCTOR", "intermediate", ["professions"]),
            ("Hospital", "Aspatal", "HOSPITAL", "intermediate", ["places"]),
            ("Money", "Paisa", "MONEY", "intermediate", ["daily"]),
            ("Time", "Samay", "TIME", "intermediate", ["daily"]),
            ("Today", "Aaj", "TODAY", "beginner", ["daily"]),
            ("Tomorrow", "Kal", "TOMORROW", "beginner", ["daily"]),
            ("Yesterday", "Kal-beet", "YESTERDAY", "beginner", ["daily"]),
            ("Question", "Sawaal", "QUESTION", "intermediate", ["grammar"]),
            ("Answer", "Jawaab", "ANSWER", "intermediate", ["grammar"]),
            ("Big", "Bada", "BIG", "beginner", ["adjectives"]),
            ("Small", "Chhota", "SMALL", "beginner", ["adjectives"]),
            ("Good", "Achha", "GOOD", "beginner", ["adjectives"]),
            ("Bad", "Bura", "BAD", "beginner", ["adjectives"]),
            ("Beautiful", "Sundar", "BEAUTIFUL", "intermediate", ["adjectives"]),
            ("Important", "Mahatvapurn", "IMPORTANT", "advanced", ["adjectives"]),
            ("India", "Bharat", "INDIA", "beginner", ["places"]),
            ("Deaf", "Badhir", "DEAF", "beginner", ["identity"]),
            ("Sign language", "Saanketik bhasha", "SIGN-LANGUAGE", "beginner", ["identity"]),
            ("Understand", "Samajhna", "UNDERSTAND", "intermediate", ["communication"]),
            ("Again", "Dobara", "AGAIN", "beginner", ["communication"]),
            ("Slow", "Dheere", "SLOW", "beginner", ["communication"]),
            ("Fast", "Tez", "FAST", "beginner", ["communication"]),
            ("Name", "Naam", "NAME", "beginner", ["basics"]),
            ("Goodbye", "Alvida", "GOODBYE", "beginner", ["greetings"]),
            ("Welcome", "Swagat", "WELCOME", "beginner", ["greetings"]),
            ("Eat", "Khana", "EAT", "beginner", ["daily"]),
            ("Drink", "Peena", "DRINK", "beginner", ["daily"]),
            ("Sleep", "Sona", "SLEEP", "beginner", ["daily"]),
            ("Work", "Kaam", "WORK", "intermediate", ["daily"]),
            ("Play", "Khelna", "PLAY", "beginner", ["daily"]),
            ("Come", "Aana", "COME", "beginner", ["basics"]),
            ("Go", "Jaana", "GO", "beginner", ["basics"]),
            ("Stop", "Ruko", "STOP", "beginner", ["basics"]),
            ("Wait", "Ruko", "WAIT", "beginner", ["basics"]),
            ("Like", "Pasand", "LIKE", "beginner", ["emotions"]),
            ("Want", "Chahna", "WANT", "beginner", ["basics"]),
            ("Need", "Zaroorat", "NEED", "intermediate", ["basics"]),
            ("Think", "Sochna", "THINK", "intermediate", ["communication"]),
            ("Boy", "Ladka", "BOY", "beginner", ["people"]),
            ("Girl", "Ladki", "GIRL", "beginner", ["people"]),
            ("Child", "Bachcha", "CHILD", "beginner", ["people"]),
            ("Man", "Aadmi", "MAN", "beginner", ["people"]),
            ("Woman", "Aurat", "WOMAN", "beginner", ["people"]),
            ("Brother", "Bhai", "BROTHER", "beginner", ["people"]),
            ("Sister", "Behen", "SISTER", "beginner", ["people"]),
            ("Color", "Rang", "COLOR", "beginner", ["education"]),
            ("House", "Ghar", "HOUSE", "beginner", ["places"]),
        ]

        for eng, hin, gloss, diff, cats in signs_data:
            sign = Sign(
                english_word=eng,
                hindi_word=hin,
                gloss=gloss,
                difficulty=diff,
                description=f"ISL sign for '{eng}'",
            )
            db.session.add(sign)
            db.session.flush()
            for cat in cats:
                db.session.add(SignCategory(sign_id=sign.id, category=cat))

        # ── Stories ──
        stories_data = [
            {
                "title_en": "The Monkey and the Crocodile",
                "title_hi": "बंदर और मगरमच्छ",
                "slug": "monkey-and-crocodile",
                "summary_en": "A clever monkey outwits a crocodile who wants his heart. A tale of friendship, betrayal, and quick thinking.",
                "theme": "animal",
                "difficulty": "beginner",
                "duration_min": 10,
                "chapter_count": 3,
                "chapters": [
                    {"num": 1, "title": "The Friendship Begins", "content": "Once upon a time, a monkey lived in a tree by the river. A crocodile would come to rest under the tree. They became friends.", "glosses": "ONCE TIME MONKEY LIVE TREE RIVER-SIDE CROCODILE COME REST TREE-UNDER THEY BECOME FRIEND"},
                    {"num": 2, "title": "The Crocodile's Wife", "content": "The crocodile's wife wanted to eat the monkey's heart. She told the crocodile to bring the monkey home.", "glosses": "CROCODILE WIFE WANT EAT MONKEY HEART SHE TELL CROCODILE BRING MONKEY HOME"},
                    {"num": 3, "title": "The Clever Escape", "content": "The monkey tricked the crocodile by saying his heart was in the tree. He climbed up and was safe.", "glosses": "MONKEY TRICK CROCODILE SAY HEART TREE-IN HE CLIMB-UP SAFE"},
                ],
            },
            {
                "title_en": "The Golden Swan",
                "title_hi": "सुनहरा हंस",
                "slug": "golden-swan",
                "summary_en": "A golden swan gives its feathers one by one to help a poor family, teaching the value of gratitude.",
                "theme": "sacrifice",
                "difficulty": "beginner",
                "duration_min": 8,
                "chapter_count": 2,
                "chapters": [
                    {"num": 1, "title": "The Gift", "content": "A golden swan visited a poor woman and her daughters. Each visit, it left a golden feather to sell.", "glosses": "GOLDEN SWAN VISIT POOR WOMAN DAUGHTER EACH VISIT LEAVE GOLDEN FEATHER SELL"},
                    {"num": 2, "title": "Greed's Price", "content": "The woman got greedy and plucked all feathers at once. They turned white and worthless.", "glosses": "WOMAN GREEDY PLUCK ALL FEATHER ONCE THEY TURN WHITE WORTHLESS"},
                ],
            },
            {
                "title_en": "The Wise Deer",
                "title_hi": "बुद्धिमान हिरण",
                "slug": "wise-deer",
                "summary_en": "A wise deer saves its herd from hunters by using intelligence instead of speed.",
                "theme": "wisdom",
                "difficulty": "intermediate",
                "duration_min": 12,
                "chapter_count": 3,
                "chapters": [
                    {"num": 1, "title": "The Hunter's Trap", "content": "A hunter set traps near the forest lake where deer came to drink water every morning.", "glosses": "HUNTER SET TRAP NEAR FOREST LAKE DEER COME DRINK WATER EVERY MORNING"},
                    {"num": 2, "title": "The Deer's Plan", "content": "The wise deer noticed the traps and warned the herd. He devised a plan to avoid them.", "glosses": "WISE DEER NOTICE TRAP WARN HERD HE PLAN AVOID"},
                    {"num": 3, "title": "Victory", "content": "The deer led the herd through a safe path. The hunter gave up and left the forest.", "glosses": "DEER LEAD HERD SAFE PATH HUNTER GIVE-UP LEAVE FOREST"},
                ],
            },
            {
                "title_en": "The Elephant and the Blind Men",
                "title_hi": "हाथी और अंधे आदमी",
                "slug": "elephant-blind-men",
                "summary_en": "Six blind men touch different parts of an elephant and argue about what it is — a lesson in perspective.",
                "theme": "wisdom",
                "difficulty": "intermediate",
                "duration_min": 10,
                "chapter_count": 2,
                "chapters": [
                    {"num": 1, "title": "The Argument", "content": "Six blind men touched an elephant. One felt the trunk and said it was a snake. Another felt the leg and said it was a tree.", "glosses": "SIX BLIND MAN TOUCH ELEPHANT ONE FEEL TRUNK SAY SNAKE ANOTHER FEEL LEG SAY TREE"},
                    {"num": 2, "title": "The King's Wisdom", "content": "The king explained that each man only knew a part. Together they could understand the whole truth.", "glosses": "KING EXPLAIN EACH MAN KNOW PART TOGETHER UNDERSTAND WHOLE TRUTH"},
                ],
            },
            {
                "title_en": "The Brave Quail",
                "title_hi": "बहादुर बटेर",
                "slug": "brave-quail",
                "summary_en": "A flock of quails learn that unity is strength when they work together to escape a hunter's net.",
                "theme": "karmic",
                "difficulty": "beginner",
                "duration_min": 7,
                "chapter_count": 2,
                "chapters": [
                    {"num": 1, "title": "Caught in the Net", "content": "A hunter caught many quails in his net. They were scared and didn't know what to do.", "glosses": "HUNTER CATCH MANY QUAIL NET THEY SCARED NOT-KNOW WHAT DO"},
                    {"num": 2, "title": "Flying Together", "content": "The wise quail said: fly together! All quails flapped their wings at once and carried the net away.", "glosses": "WISE QUAIL SAY FLY TOGETHER ALL QUAIL FLAP WING ONCE CARRY NET AWAY"},
                ],
            },
        ]

        for s_data in stories_data:
            story = Story(
                title_en=s_data["title_en"],
                title_hi=s_data["title_hi"],
                slug=s_data["slug"],
                summary_en=s_data["summary_en"],
                theme=s_data["theme"],
                difficulty=s_data["difficulty"],
                duration_min=s_data["duration_min"],
                chapter_count=s_data["chapter_count"],
                is_published=True,
            )
            db.session.add(story)
            db.session.flush()
            for ch in s_data["chapters"]:
                db.session.add(StoryChapter(
                    story_id=story.id,
                    chapter_num=ch["num"],
                    title_en=ch["title"],
                    content_en=ch["content"],
                    isl_glosses=ch["glosses"],
                    sigml_sequence=[],
                ))

        db.session.commit()
        print(f"Seeded: 3 users, {len(signs_data)} signs, {len(stories_data)} stories")


if __name__ == "__main__":
    seed()
