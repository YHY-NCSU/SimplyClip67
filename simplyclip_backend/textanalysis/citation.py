import habanero

class CitationError(Exception):
    pass

def createCitation(text):
    citationTypes = ['apa', 'bibtex', 'chicago-author-date', 'modern-language-association', 'vancouver']
    citeText = ""

    if len(text) > 300:
        citeText = "Unable to create the citations. Please check the DOI."
        print("Generated the citation")
        return [citeText]

    try:
        for citation in citationTypes:
            citeText += citation.upper()
            citeText += ":\n"
            citeText += habanero.cn.content_negotiation(ids=text, format='text', style=citation)
            citeText += "\n"

        print("Citation generation completed")
    except Exception as e:
        raise CitationError("Error in citation generation: " + str(e))
    except:
        citeText = ""
        citeText += "URL: \n"
        citeText += text
        print("Citation generation completed")

    ansList = [citeText]
    return ansList