"""
Curated interview question bank.

40 questions across 8 domains (5 per domain), each tagged with a difficulty
and a list of keywords that the evaluation/keyword-detection logic looks for
in the user's answer.
"""

QUESTION_BANK = [
    # ---------------- Backend ----------------
    {
        "domain": "Backend",
        "difficulty": "Easy",
        "question": "What is the difference between a GET and a POST HTTP request, and when would you use each?",
        "keywords": ["idempotent", "request body", "query parameters", "caching", "safe method"],
    },
    {
        "domain": "Backend",
        "difficulty": "Medium",
        "question": "Explain how middleware works in a framework like FastAPI or Express, and give an example of a use case.",
        "keywords": ["middleware", "request pipeline", "authentication", "logging", "next handler"],
    },
    {
        "domain": "Backend",
        "difficulty": "Medium",
        "question": "What is the purpose of JWT-based authentication, and what are its tradeoffs compared to session-based authentication?",
        "keywords": ["JWT", "stateless", "token expiry", "session", "refresh token"],
    },
    {
        "domain": "Backend",
        "difficulty": "Hard",
        "question": "How would you design rate limiting for a public API, and what algorithms could you use?",
        "keywords": ["rate limiting", "token bucket", "sliding window", "throttling", "Redis"],
    },
    {
        "domain": "Backend",
        "difficulty": "Hard",
        "question": "Walk through what happens when a client sends an HTTPS request to a server, from DNS resolution to response.",
        "keywords": ["DNS", "TCP handshake", "TLS", "HTTP", "response"],
    },

    # ---------------- DSA ----------------
    {
        "domain": "DSA",
        "difficulty": "Easy",
        "question": "Explain the difference between an array and a linked list, including time complexity tradeoffs.",
        "keywords": ["time complexity", "contiguous memory", "pointer", "insertion", "access"],
    },
    {
        "domain": "DSA",
        "difficulty": "Medium",
        "question": "How does a hash map achieve average O(1) lookup time? What causes collisions and how are they handled?",
        "keywords": ["hash function", "collision", "chaining", "load factor", "O(1)"],
    },
    {
        "domain": "DSA",
        "difficulty": "Medium",
        "question": "Explain the difference between BFS and DFS, and describe a scenario where each is preferred.",
        "keywords": ["BFS", "DFS", "queue", "stack", "shortest path", "traversal"],
    },
    {
        "domain": "DSA",
        "difficulty": "Hard",
        "question": "How would you find the kth largest element in an unsorted array efficiently? Discuss the time complexity of your approach.",
        "keywords": ["heap", "quickselect", "time complexity", "partition", "priority queue"],
    },
    {
        "domain": "DSA",
        "difficulty": "Hard",
        "question": "Explain dynamic programming with an example, and describe how it differs from plain recursion.",
        "keywords": ["dynamic programming", "memoization", "overlapping subproblems", "optimal substructure", "recursion"],
    },

    # ---------------- DBMS ----------------
    {
        "domain": "DBMS",
        "difficulty": "Easy",
        "question": "What is normalization in databases, and why is it important?",
        "keywords": ["normalization", "redundancy", "normal form", "data integrity", "anomalies"],
    },
    {
        "domain": "DBMS",
        "difficulty": "Medium",
        "question": "Explain the difference between a clustered and a non-clustered index.",
        "keywords": ["clustered index", "non-clustered index", "B-tree", "lookup", "primary key"],
    },
    {
        "domain": "DBMS",
        "difficulty": "Medium",
        "question": "What are ACID properties in a database transaction, and why do they matter?",
        "keywords": ["atomicity", "consistency", "isolation", "durability", "transaction"],
    },
    {
        "domain": "DBMS",
        "difficulty": "Hard",
        "question": "Explain the difference between SQL and NoSQL databases, and describe a scenario where you'd choose one over the other.",
        "keywords": ["schema", "scalability", "consistency", "document store", "relational"],
    },
    {
        "domain": "DBMS",
        "difficulty": "Hard",
        "question": "What is a database deadlock, and how can it be detected and prevented?",
        "keywords": ["deadlock", "lock ordering", "transaction", "timeout", "wait-for graph"],
    },

    # ---------------- OOP ----------------
    {
        "domain": "OOP",
        "difficulty": "Easy",
        "question": "Explain the four pillars of object-oriented programming with examples.",
        "keywords": ["encapsulation", "inheritance", "polymorphism", "abstraction", "class"],
    },
    {
        "domain": "OOP",
        "difficulty": "Medium",
        "question": "What is the difference between method overloading and method overriding?",
        "keywords": ["overloading", "overriding", "compile-time", "runtime", "polymorphism"],
    },
    {
        "domain": "OOP",
        "difficulty": "Medium",
        "question": "Explain the SOLID principles and why they matter in software design.",
        "keywords": ["single responsibility", "open-closed", "dependency inversion", "interface", "SOLID"],
    },
    {
        "domain": "OOP",
        "difficulty": "Hard",
        "question": "What is the difference between composition and inheritance, and when would you prefer one over the other?",
        "keywords": ["composition", "inheritance", "has-a", "is-a", "coupling"],
    },
    {
        "domain": "OOP",
        "difficulty": "Hard",
        "question": "Explain the concept of design patterns with an example of one you've used, and the problem it solves.",
        "keywords": ["design pattern", "singleton", "factory", "observer", "reusability"],
    },

    # ---------------- AI/ML ----------------
    {
        "domain": "AI/ML",
        "difficulty": "Easy",
        "question": "What is the difference between supervised and unsupervised learning? Give an example of each.",
        "keywords": ["supervised", "unsupervised", "labels", "clustering", "classification"],
    },
    {
        "domain": "AI/ML",
        "difficulty": "Medium",
        "question": "Explain overfitting and underfitting, and how you would detect and address each.",
        "keywords": ["overfitting", "underfitting", "regularization", "validation set", "bias-variance"],
    },
    {
        "domain": "AI/ML",
        "difficulty": "Medium",
        "question": "What is the difference between precision and recall, and when would you prioritize one over the other?",
        "keywords": ["precision", "recall", "false positive", "false negative", "F1 score"],
    },
    {
        "domain": "AI/ML",
        "difficulty": "Hard",
        "question": "Explain how a transformer model's attention mechanism works at a high level.",
        "keywords": ["attention", "self-attention", "query key value", "transformer", "context"],
    },
    {
        "domain": "AI/ML",
        "difficulty": "Hard",
        "question": "How would you approach building a recommendation system for an e-commerce platform?",
        "keywords": ["collaborative filtering", "content-based", "embeddings", "cold start", "ranking"],
    },

    # ---------------- System Design ----------------
    {
        "domain": "System Design",
        "difficulty": "Easy",
        "question": "What is the difference between vertical and horizontal scaling?",
        "keywords": ["vertical scaling", "horizontal scaling", "load balancer", "throughput", "single machine"],
    },
    {
        "domain": "System Design",
        "difficulty": "Medium",
        "question": "Explain what a load balancer does and describe a common load balancing algorithm.",
        "keywords": ["load balancer", "round robin", "health check", "traffic distribution", "availability"],
    },
    {
        "domain": "System Design",
        "difficulty": "Medium",
        "question": "What is caching, and what strategies would you use to keep a cache consistent with the underlying database?",
        "keywords": ["cache", "cache invalidation", "TTL", "write-through", "consistency"],
    },
    {
        "domain": "System Design",
        "difficulty": "Hard",
        "question": "How would you design a URL shortening service like bit.ly? Outline the key components.",
        "keywords": ["hashing", "database", "redirect", "scalability", "unique ID"],
    },
    {
        "domain": "System Design",
        "difficulty": "Hard",
        "question": "Explain the CAP theorem and how it applies to distributed database design.",
        "keywords": ["consistency", "availability", "partition tolerance", "CAP theorem", "distributed system"],
    },

    # ---------------- Resume-aware / general practical ----------------
    {
        "domain": "Backend",
        "difficulty": "Medium",
        "question": "Describe how you would structure a FastAPI project with multiple models, routes, and services for maintainability.",
        "keywords": ["folder structure", "separation of concerns", "routes", "services", "models"],
    },
    {
        "domain": "DSA",
        "difficulty": "Easy",
        "question": "What is the time complexity of binary search, and what precondition must hold for it to work?",
        "keywords": ["binary search", "O(log n)", "sorted array", "divide and conquer", "time complexity"],
    },
    {
        "domain": "DBMS",
        "difficulty": "Easy",
        "question": "What is the difference between a primary key and a foreign key?",
        "keywords": ["primary key", "foreign key", "uniqueness", "referential integrity", "relationship"],
    },
    {
        "domain": "OOP",
        "difficulty": "Easy",
        "question": "What is an abstract class, and how is it different from an interface?",
        "keywords": ["abstract class", "interface", "implementation", "multiple inheritance", "contract"],
    },
    {
        "domain": "AI/ML",
        "difficulty": "Easy",
        "question": "What is a confusion matrix, and what information does it provide about a classification model?",
        "keywords": ["confusion matrix", "true positive", "false positive", "accuracy", "classification"],
    },
    {
        "domain": "System Design",
        "difficulty": "Medium",
        "question": "What is the difference between synchronous and asynchronous communication between services, and when would you use message queues?",
        "keywords": ["synchronous", "asynchronous", "message queue", "decoupling", "latency"],
    },
    {
        "domain": "Backend",
        "difficulty": "Easy",
        "question": "What is dependency injection, and how does it improve testability?",
        "keywords": ["dependency injection", "testability", "decoupling", "mocking", "inversion of control"],
    },
    {
        "domain": "DSA",
        "difficulty": "Medium",
        "question": "Explain how a trie data structure works and a real-world use case for it.",
        "keywords": ["trie", "prefix", "autocomplete", "tree", "search"],
    },
    {
        "domain": "DBMS",
        "difficulty": "Medium",
        "question": "What is database connection pooling, and why is it important for application performance?",
        "keywords": ["connection pooling", "latency", "concurrency", "resource reuse", "performance"],
    },
    {
        "domain": "AI/ML",
        "difficulty": "Medium",
        "question": "What is the role of an activation function in a neural network, and name a couple of common ones.",
        "keywords": ["activation function", "ReLU", "sigmoid", "non-linearity", "neural network"],
    },
]


DOMAINS = ["AI/ML", "Backend", "DSA", "DBMS", "OOP", "System Design"]
DIFFICULTIES = ["Easy", "Medium", "Hard"]


def get_questions(domain: str = None, difficulty: str = None) -> list[dict]:
    """Filter the question bank by domain and/or difficulty."""
    results = QUESTION_BANK
    if domain:
        results = [q for q in results if q["domain"] == domain]
    if difficulty:
        results = [q for q in results if q["difficulty"] == difficulty]
    return results
