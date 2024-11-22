from flask import Flask, jsonify, request
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Store questions and answers
q1_data = {
    "q1": {
        "question": "What types of shoes do you sell?",
        "answer": "We offer a wide range of shoes, including sneakers, boots, sandals, and formal shoes."
    },
    "q2": {
        "question": "Do you have women's shoes?",
        "answer": "Yes, we have a variety of women's shoes in different styles and sizes."
    },
    "q3": {
        "question": "How can I track my order?",
        "answer": "You can track your order using the tracking number sent to your email or by visiting our 'Track My Order' page."
    },
    "q4": {
        "question": "What is your return policy?",
        "answer": "We offer a 30-day return policy for unused shoes. Please refer to our returns page for more details."
    },
    "q5": {
        "question": "Are the shoes available in different sizes?",
        "answer": "Yes, we carry a wide range of sizes for all shoe types."
    },
    "q6": {
        "question": "How do I know which size to choose?",
        "answer": "You can check our size guide on the product page to find the best fit."
    },
    "q7": {
        "question": "Do you offer international shipping?",
        "answer": "Yes, we offer worldwide shipping. Additional shipping fees may apply depending on the destination."
    },
    "q8": {
        "question": "Can I cancel my order after placing it?",
        "answer": "Orders can be canceled within 1 hour of placing the order. After that, it’s processed and shipped."
    },
    "q9": {
        "question": "How long will it take to receive my order?",
        "answer": "Domestic orders typically arrive within 3-5 business days, while international orders may take 7-14 days."
    },
    "q10": {
        "question": "Do you offer free shipping?",
        "answer": "We offer free shipping on orders over $50 within the United States."
    },
    "q11": {
        "question": "Do you accept returns on sale items?",
        "answer": "Sale items are eligible for returns within 14 days of purchase."
    },
    "q12": {
        "question": "How can I pay for my order?",
        "answer": "We accept credit cards, PayPal, and Apple Pay for secure payments."
    },
    "q13": {
        "question": "Can I use multiple discount codes?",
        "answer": "Only one discount code can be used per order."
    },
    "q14": {
        "question": "Do you have any vegan shoe options?",
        "answer": "Yes, we offer a variety of vegan-friendly shoes made from synthetic materials."
    },
    "q15": {
        "question": "Do you offer gift cards?",
        "answer": "Yes, we offer gift cards in various denominations that can be used on our website."
    },
    "q16": {
        "question": "What brands of shoes do you sell?",
        "answer": "We carry many popular shoe brands, including Nike, Adidas, Puma, and more."
    },
    "q17": {
        "question": "Do you have any shoes for running?",
        "answer": "Yes, we offer running shoes from top brands like Nike, Adidas, and New Balance."
    },
    "q18": {
        "question": "What is the best shoe for hiking?",
        "answer": "Our hiking shoes offer comfort and support with durable soles and waterproof materials."
    },
    "q19": {
        "question": "Can I change the shipping address after placing an order?",
        "answer": "You can update your shipping address within 1 hour of placing the order. After that, the order is processed."
    },
    "q20": {
        "question": "Do you have a loyalty program?",
        "answer": "Yes, we have a loyalty program that rewards you with points for every purchase."
    },

    # Additional general questions
    "q21": {
        "question": "Hi",
        "answer": "Hi, how can I help you today?"
    },
    "q22": {
        "question": "Hello",
        "answer": "Hello! How can I assist you?"
    },
    "q23": {
        "question": "What is your name?",
        "answer": "I am your friendly assistant, here to help you with any shoe-related queries!"
    },
    "q24": {
        "question": "How are you?",
        "answer": "I'm just a bot, but I'm here and ready to help you with your questions!"
    },
    "q25": {
        "question": "Good morning",
        "answer": "Good morning! How can I assist you today?"
    },
    "q26": {
        "question": "Good afternoon",
        "answer": "Good afternoon! How can I assist you with your shopping?"
    },
    "q27": {
        "question": "Good evening",
        "answer": "Good evening! How may I help you tonight?"
    },
    "q28": {
        "question": "What is your purpose?",
        "answer": "I am here to answer any questions you have about our shoes and services."
    },
    "q29": {
        "question": "Can you help me?",
        "answer": "Of course! Let me know what you need assistance with."
    },
    "q30": {
        "question": "Thank you",
        "answer": "You're welcome! If you need anything else, just ask."
    }
}


@app.route('/chatbot', methods=['POST'])
def chatbot():
    user_input = request.json.get('question', '').lower()

    # Extract questions from q1_data for comparison
    questions = [value["question"] for key, value in q1_data.items()]

    # Vectorize the user input and the questions using TF-IDF
    vectorizer = TfidfVectorizer()
    all_questions = questions + [user_input]
    tfidf_matrix = vectorizer.fit_transform(all_questions)

    # Compute cosine similarity between user input and each question
    cosine_sim = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1])

    # Find the index of the most similar question
    most_similar_index = cosine_sim.argmax()

    # Fetch the answer to the most similar question
    most_similar_question = questions[most_similar_index]
    answer = q1_data[f"q{most_similar_index + 1}"]["answer"]

    # Return the answer
    return jsonify({"answer": answer})

if __name__ == '__main__':
    app.run(debug=True)
