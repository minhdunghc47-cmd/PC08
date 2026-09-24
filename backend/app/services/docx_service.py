import io
import os
from docxtpl import DocxTemplate

def generate_pc08_docx(context: dict) -> io.BytesIO:
    template_path = os.path.join(os.path.dirname(__file__), '../templates/template_pc08.docx')
    if not os.path.exists(template_path):
        raise FileNotFoundError(f"Template not found at {template_path}")
        
    doc = DocxTemplate(template_path)
    doc.render(context)
    
    file_stream = io.BytesIO()
    doc.save(file_stream)
    file_stream.seek(0)
    
    return file_stream
