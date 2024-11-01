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



