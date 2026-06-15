import random

from services.question_bank import get_questions, DOMAINS, DIFFICULTIES


def pick_question(domain: str, difficulty: str, exclude_questions: list[str] = None) -> dict:
    """
    Pick a question from the curated bank matching domain + difficulty.
    Falls back to relaxing difficulty, then domain, if no match is found.
    `exclude_questions` avoids repeating recently-asked questions for the user.
    """
    exclude_questions = exclude_questions or []

    candidates = get_questions(domain=domain, difficulty=difficulty)
    candidates = [q for q in candidates if q["question"] not in exclude_questions]

    if not candidates:
        # Relax difficulty constraint
        candidates = [q for q in get_questions(domain=domain) if q["question"] not in exclude_questions]

    if not candidates:
        # Relax domain constraint too - pick from anything unused
        candidates = [q for q in get_questions() if q["question"] not in exclude_questions]

    if not candidates:
        # Everything has been used - allow repeats
        candidates = get_questions(domain=domain) or get_questions()

    return random.choice(candidates)


def suggest_domain_from_skills(skills: list[str]) -> str:
    """
    Simple heuristic mapping from resume skills to a likely-relevant domain.
    Used to recommend a starting domain for a new session.
    """
    skills_lower = [s.lower() for s in skills]

    domain_keywords = {
        "AI/ML": ["machine learning", "tensorflow", "pytorch", "scikit", "ml", "ai", "nlp", "deep learning"],
        "Backend": ["fastapi", "flask", "django", "node", "express", "api", "rest"],
        "DBMS": ["sql", "postgres", "mysql", "mongodb", "database", "sqlite"],
        "DSA": ["leetcode", "algorithms", "data structures"],
        "OOP": ["java", "c++", "oop"],
        "System Design": ["microservices", "docker", "kubernetes", "aws", "system design"],
    }

    scores = {domain: 0 for domain in DOMAINS}
    for domain, keywords in domain_keywords.items():
        for kw in keywords:
            for skill in skills_lower:
                if kw in skill:
                    scores[domain] += 1

    best_domain = max(scores, key=scores.get)
    if scores[best_domain] == 0:
        return random.choice(DOMAINS)
    return best_domain
