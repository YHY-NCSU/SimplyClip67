import habanero

class CitationError(Exception):
    pass

def createCitation(text):
    citationTypes = ['apa', 'bibtex', 'chicago-author-date', 'modern-language-association', 'vancouver']
    citeText = ""

    try:
        # Attempt to interpret the text as a DOI first
        for citation in citationTypes:
            citeText += citation.upper()
            citeText += ":\n"
            citeText += habanero.cn.content_negotiation(ids=text, format='text', style=citation)
            citeText += "\n"
        print("Citation generation completed using DOI.")
        return citeText
    except Exception as e:
        print("Failed to generate citation using DOI. Attempting to search for article.")
        # If that fails, search for the article using the text
        try:
            works = habanero.Crossref()
            res = works.works(query=text, limit=1)
            items = res.get('message', {}).get('items', [])
            if not items:
                raise CitationError("No matching articles found for the provided text.")
            # Get the DOI of the best matching article
            doi = items[0]['DOI']
            # Now generate the citation using the found DOI
            citeText = ""
            for citation in citationTypes:
                citeText += citation.upper()
                citeText += ":\n"
                citeText += habanero.cn.content_negotiation(ids=doi, format='text', style=citation)
                citeText += "\n"
            print("Citation generation completed using article search.")
            print(citeText)
            return citeText
        except Exception as e:
            citeText = "Unable to generate the citation. Please check the input text."
            print(f"Error in citation generation: {e}")
            return citeText
