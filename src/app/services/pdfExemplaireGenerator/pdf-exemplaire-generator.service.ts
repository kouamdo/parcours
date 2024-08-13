import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfExemplaireGeneratorService {

  constructor() { }
  
  generatePdf(content: HTMLElement): Promise<jsPDF> {
    return new Promise((resolve, reject) => {
      html2canvas(content).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0,0,0);
        resolve(pdf);
      }).catch(error => {
        reject(error);
      });
    });
  }
}
