from textanalysis.summarizer import generate_summary_v2
from django.urls import reverse, resolve
from transformers import pipeline


class TestUrls:

    def test_post_content_url(self):
        output = generate_summary_v2(
            "This is the test case input, This is the test case input, This is the test case input, This is the test case input, This is the test case input, This is the test case input"
        )
        assert output != ""

    def generate_summary(text):
        summarizer = pipeline("summarization")
        summarize_text = summarizer(
            text, min_length=30, max_length=130, do_sample=False
        )
        print(summarize_text)
        return summarize_text
