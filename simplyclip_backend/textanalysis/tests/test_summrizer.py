from textanalysis.summarizer import generate_summary_v2
import unittest
import re

class TestGenerateSummaryV2(unittest.TestCase):
    def setUp(self):
        # Sample text to use across multiple tests
        self.sample_text = (
            "Artificial intelligence (AI) is intelligence demonstrated by machines, in contrast to the natural intelligence displayed by humans and animals. "
            "Leading AI textbooks define the field as the study of \"intelligent agents\": any device that perceives its environment and takes actions that maximize its chance of successfully achieving its goals. "
            "Colloquially, the term \"artificial intelligence\" is often used to describe machines (or computers) that mimic \"cognitive\" functions that humans associate with the human mind, such as \"learning\" and \"problem-solving\"."
        )

    def test_generate_summary_normal_case(self):
        # Test a normal case with standard input
        result = generate_summary_v2(self.sample_text, max_words=30)
        self.assertIsInstance(result, str)
        self.assertTrue(len(result.split()) <= 30)

    def test_empty_text_input(self):
        # Test with empty input
        with self.assertRaises(ValueError) as context:
            generate_summary_v2("", max_words=30)
        self.assertEqual(str(context.exception), "Input 'text' cannot be empty or whitespace.")

    def test_non_string_input(self):
        # Test with non-string input
        with self.assertRaises(ValueError) as context:
            generate_summary_v2(12345, max_words=30)
        self.assertEqual(str(context.exception), "Input 'text' must be a string.")

    def test_invalid_max_words_type(self):
        # Test with non-integer max_words
        with self.assertRaises(ValueError) as context:
            generate_summary_v2(self.sample_text, max_words="fifty")
        self.assertEqual(str(context.exception), "Parameter 'max_words' must be an integer.")

    def test_negative_max_words(self):
        # Test with negative max_words
        with self.assertRaises(ValueError) as context:
            generate_summary_v2(self.sample_text, max_words=-5)
        self.assertEqual(str(context.exception), "Parameter 'max_words' must be greater than zero.")

    def test_text_with_only_stopwords(self):
        # Test input containing only stopwords
        stopwords_text = "the and if but or"
        with self.assertRaises(RuntimeError) as context:
            generate_summary_v2(stopwords_text, max_words=10)
        self.assertIn("No valid words found in text after filtering.", str(context.exception))

    def test_low_max_words_limit(self):
        # Test with max_words set to 1 (very low)
        result = generate_summary_v2(self.sample_text, max_words=1)
        self.assertTrue(len(result.split()) <= 1)

    def test_standardized_text_handling(self):
        # Test that non-alphanumeric characters are removed
        text_with_symbols = "AI!!! **is amazing**; isn't it?"
        result = generate_summary_v2(text_with_symbols, max_words=10)
        self.assertIsInstance(result, str)
        self.assertTrue(all(re.match(r'\w+', word) for word in result.split()))

if __name__ == "__main__":
    unittest.main()