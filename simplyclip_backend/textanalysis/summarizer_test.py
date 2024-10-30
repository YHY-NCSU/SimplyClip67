import unittest
from unittest.mock import patch
from django.http import HttpRequest, HttpResponse
from summarizer import generate_summary_v2  # Adjust import as necessary
import re


class SummarizeEndpointTest(unittest.TestCase):
    @patch("habanero.cn.content_negotiation")
    def test_summarize_correct_length(self, mock_generate_summary):
        # Define the expected summary length
        expected_summary_length = 50  # Example expected length for the summary

        # Mock the generate_summary function to return a summary of the expected length
        mock_generate_summary.return_value = "x" * expected_summary_length

        summ_input = """
        In the heart of a bustling city, where the skyline was painted with 
        shimmering glass towers and the streets thrummed with the energy of 
        life, there existed a quaint little bookstore. This charming 
        establishment, tucked between a modern café and an old-fashioned bakery, 
        was a sanctuary for book lovers. It was filled with the rich scent of 
        aged paper and the sound of soft pages turning. Visitors could lose 
        themselves for hours among the shelves, discovering hidden gems and 
        timeless classics. The friendly owner, an elderly gentleman with a 
        passion for literature, often shared stories about the books he loved, 
        creating a sense of community among his customers."""

        response = generate_summary_v2(
            text=summ_input, max_words=expected_summary_length
        )
        words = re.findall(r"\b\w+\b", response)

        self.assertIsInstance(response, str)
        self.assertLessEqual(len(words), expected_summary_length)

    @patch("habanero.cn.content_negotiation")
    def test_invalid_text_type(self, mock_content_negotiation):
        with self.assertRaises(ValueError) as context:
            generate_summary_v2(123, 5)
        self.assertEqual(str(context.exception), "Input 'text' must be a string.")

    @patch("habanero.cn.content_negotiation")
    def test_empty_text(self, mock_content_negotiation):
        with self.assertRaises(ValueError) as context:
            generate_summary_v2("   ", 5)
        self.assertEqual(
            str(context.exception), "Input 'text' cannot be empty or whitespace."
        )

    @patch("habanero.cn.content_negotiation")
    def test_invalid_max_words_type(self, mock_content_negotiation):
        with self.assertRaises(ValueError) as context:
            generate_summary_v2("Sample text", "five")
        self.assertEqual(
            str(context.exception), "Parameter 'max_words' must be an integer."
        )

    @patch("habanero.cn.content_negotiation")
    def test_invalid_max_words_value(self, mock_content_negotiation):
        with self.assertRaises(ValueError) as context:
            generate_summary_v2("Sample text", -1)
        self.assertEqual(
            str(context.exception), "Parameter 'max_words' must be greater than zero."
        )

    @patch("habanero.cn.content_negotiation")
    def test_no_stopwords_found(self, mock_content_negotiation):
        text = "Floccinaucinihilipilification"
        max_words = 5
        summary = generate_summary_v2(text, max_words)
        self.assertEqual(summary, "Floccinaucinihilipilification")


if __name__ == "__main__":
    unittest.main()
