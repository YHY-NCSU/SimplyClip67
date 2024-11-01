import json
import os
import pdb
from os.path import basename
from zipfile import ZipFile

from django.core.files.storage import FileSystemStorage
from django.http import HttpResponse,JsonResponse
from django.http.response import FileResponse
from django.views.decorators.csrf import csrf_exempt

from . import summarizer
from . import citation


@csrf_exempt
def summarize(request, summ_input):
    if request.method == 'GET':
        body_data = summ_input
        summarized_output = summarizer.generate_summary_v2(body_data)
        return HttpResponse(summarized_output, content_type='text/plain')


@csrf_exempt
def getcitation(request):
    if request.method == 'POST':
        input_text = request.POST.get('citation_input', '')
        print(input_text)
        citation_output = citation.createCitation(input_text)
        return HttpResponse(citation_output, content_type='text/plain')
    else:
        return HttpResponse('Invalid request method.', status=400)


@csrf_exempt
def upload(request):
    folder='docs/'
    if request.method == 'POST' and request.FILES['myfile']:
        myfile = request.FILES['myfile']
        fs = FileSystemStorage(location=folder)
        filename = fs.save(myfile.name, myfile)
        #file_url = fs.url(filename)
        msg = "File stored successfully"
        print("file stored")
        return HttpResponse(msg, content_type='text/plain')

@csrf_exempt
def fetch(request, summary_in):
    print(summary_in)
    if request.method == 'GET':
        pdb.set_trace()
        with ZipFile('docs.zip', 'w') as zipObj:
            folderName, subfolders, filenames = os.walk("docs/")
            for filename in filenames:
                filePath = os.path.join(folderName, filename)
                zipObj.write(filePath, basename(filePath))
            doczip = open('docs.zip','rb')
            response = FileResponse(doczip)
            print("files returned")
            return response


@csrf_exempt
def summarize_all(request):
    if request.method == 'POST':
        try:
            # Extract and parse the list of texts
            texts_json = request.POST.get('texts', '[]')
            texts = json.loads(texts_json)
            
            if not isinstance(texts, list) or not all(isinstance(text, str) for text in texts):
                return HttpResponse('Invalid data format.', status=400)

            if not texts:
                return HttpResponse('No texts provided for summarization.', status=400)

            # Concatenate all texts into a single string
            combined_text = ' '.join(texts)

            # Generate summary using the existing summarizer
            summary = summarizer.generate_summary_v2(combined_text, max_words=300)  # Adjust max_words as needed

            return HttpResponse(summary, content_type='text/plain')

        except json.JSONDecodeError:
            return HttpResponse('Invalid JSON data.', status=400)
        except Exception as e:
            return HttpResponse(f'Error during summarization: {str(e)}', status=500)
    else:
        return HttpResponse('Invalid request method.', status=400)
