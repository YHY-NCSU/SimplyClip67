import unittest
from unittest.mock import patch, MagicMock
from textanalysis.citation import createCitation, CitationError

class TestCreateCitation(unittest.TestCase):

    @patch('habanero.cn.content_negotiation')
    def test_create_citation_with_valid_doi(self, mock_content_negotiation):
        # Mocking the response for a valid DOI
        mock_content_negotiation.return_value = "Mocked Citation Text"
        doi = "10.1000/xyz123"

        result = createCitation(doi)
        self.assertIn("APA:\nMocked Citation Text\n", result)
        self.assertIn("CHICAGO-AUTHOR-DATE:\nMocked Citation Text\n", result)

    @patch('habanero.cn.content_negotiation')
    @patch('habanero.Crossref.works')
    def test_create_citation_with_search_query(self, mock_works, mock_content_negotiation):
        # Mocking the search result for an article
        mock_works.return_value = {
            'message': {
                'items': [{
                    'DOI': '10.1000/xyz123'
                }]
            }
        }
        mock_content_negotiation.return_value = "Mocked Citation Text"
        search_text = "An example article title"

        result = createCitation(search_text)
        self.assertIn("APA:\nMocked Citation Text\n", result)
        self.assertIn("VANCOUVER:\nMocked Citation Text\n", result)

    @patch('habanero.cn.content_negotiation', side_effect=Exception("DOI lookup failed"))
    @patch('habanero.Crossref.works', side_effect=Exception("Search failed"))
    def test_create_citation_with_all_failures(self, mock_works, mock_content_negotiation):
        text = "Invalid input that causes all failures"
        result = createCitation(text)
        self.assertEqual(result, "Unable to generate the citation. Please check the input text.")

if __name__ == "__main__":
    unittest.main()