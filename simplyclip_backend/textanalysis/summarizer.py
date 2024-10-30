import nltk
import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from collections import defaultdict

nltk.download("stopwords")
nltk.download("punkt_tab")
# from transformers import pipeline

# def generate_summary(text):
#     summarizer = pipeline("summarization")
#     summarized_text = summarizer(text, min_length=30, max_length=130, do_sample=False)
#     print("Summarised Text:  ")
#     print(summarized_text)
#     print("****** ")
#     latest_text = []
#     latest_text.append(summarized_text[0]["summary_text"])
#     return latest_text


def generate_summary_v2(text: str, max_words: int = 50):
    """Generates a concise summary of the input text, limited to a specified word count.

    This function processes the input text by standardizing, tokenizing, and removing
    stopwords, then calculates word frequencies to score sentences based on term importance.
    It selects the highest-scoring sentences until reaching the maximum word count specified,
    then constructs a summary from the selected sentences.

    Args:
        text (str): The input text to summarize.
        max_words (int, optional): The maximum number of words for the summary. Defaults to 50.

    Returns:
        str: The generated summary, containing up to `max_words` words.

    Raises:
        ValueError: If the input text is empty or `max_words` is less than 1.

    Example:
        >>> text = "Artificial intelligence is revolutionizing many industries. The advancements in AI..."
        >>> generate_summary_v2(text, max_words=20)
        "Artificial intelligence is revolutionizing many industries..."

    Notes:
        - The function removes non-alphanumeric characters and converts text to lowercase.
        - Stopwords are removed using the NLTK English stopwords list.
        - Sentence scoring is based on normalized word frequencies.
        - Sentence selection stops once the cumulative word count reaches `max_words`.
    """
    # Error checking for input text
    if not isinstance(text, str):
        raise ValueError("Input 'text' must be a string.")
    if len(text.strip()) == 0:
        raise ValueError("Input 'text' cannot be empty or whitespace.")

    # Error checking for max_words
    if not isinstance(max_words, int):
        raise ValueError("Parameter 'max_words' must be an integer.")
    if max_words <= 0:
        raise ValueError("Parameter 'max_words' must be greater than zero.")

    try:
        # Standardize text: lowercase and remove non-alphanumeric characters
        standardized_text = re.sub(r"\s+", " ", re.sub(r"\W", " ", text.lower()))
    except Exception as e:
        raise RuntimeError(f"Error in text standardization: {e}")

    # Load stop words and check if available
    try:
        stop_words = set(stopwords.words("english"))
    except LookupError:
        raise RuntimeError(
            "NLTK stopwords not found. Please download them using nltk.download('stopwords')."
        )

    # Tokenize and filter out stopwords
    try:
        word_tokens = word_tokenize(standardized_text)
        filtered_words = [word for word in word_tokens if word not in stop_words]
    except Exception as e:
        raise RuntimeError(f"Error in tokenization or stopword removal: {e}")

    # Calculate word frequency with error handling
    word_frequencies = defaultdict(int)
    try:
        for word in filtered_words:
            word_frequencies[word] += 1
    except Exception as e:
        raise RuntimeError(f"Error in calculating word frequencies: {e}")

    # Normalize frequencies by maximum frequency value
    try:
        max_freq = max(word_frequencies.values(), default=0)
        if max_freq == 0:
            raise ValueError("No valid words found in text after filtering.")
        for word in word_frequencies.keys():
            word_frequencies[word] = word_frequencies[word] / max_freq
    except Exception as e:
        raise RuntimeError(f"Error in frequency normalization: {e}")

    # Sentence tokenization and scoring based on word frequencies
    try:
        sentence_tok = sent_tokenize(text)
        sentence_scores = defaultdict(int)
        for sentence in sentence_tok:
            for word in word_tokenize(sentence.lower()):
                if word in word_frequencies:
                    sentence_scores[sentence] += word_frequencies[word]
    except Exception as e:
        raise RuntimeError(f"Error in sentence tokenization or scoring: {e}")

    # Build the summary within the maximum word count
    try:
        summary_sentences = []
        word_count = 0
        for sentence in sorted(sentence_scores, key=sentence_scores.get, reverse=True):
            sentence_word_count = len(word_tokenize(sentence))
            if word_count + sentence_word_count <= max_words:
                summary_sentences.append(sentence)
                word_count += sentence_word_count
            else:
                break
        summary = " ".join(summary_sentences)
    except Exception as e:
        raise RuntimeError(f"Error in building the summary: {e}")

    return summary


if __name__ == "__main__":
    # Example usage
    text = """
    Artificial intelligence (AI) is intelligence demonstrated by machines, in contrast to the natural intelligence displayed by humans and animals. 
    Leading AI textbooks define the field as the study of "intelligent agents": any device that perceives its environment and takes actions that maximize its chance of successfully achieving its goals. 
    Colloquially, the term "artificial intelligence" is often used to describe machines (or computers) that mimic "cognitive" functions that humans associate with the human mind, such as "learning" and "problem-solving".
    """
    print(generate_summary_v2(text, max_words=30))
