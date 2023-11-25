from transformers import pipeline


def generate_summary(text):
    summarizer = pipeline("summarization")
    summarized_text = summarizer(text, min_length=30, max_length=130, do_sample=False)
    print("Summarised Text:  ")
    print(summarized_text)
    print("****** ")
    latest_text = []
    latest_text.append(summarized_text[0]['summary_text'])
    return latest_text
