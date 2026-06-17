import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-number-to-words',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './number-to-words.component.html',
  styleUrl: './number-to-words.component.scss'
})
export class NumberToWordsComponent {
  inputNumber: string = '';
  selectedMoneda: string = 'PESOS';
  selectedCentavos: string = 'CENTAVOS';
  selectedFormato: string = 'MAYUSCULAS'; // 'MAYUSCULAS' | 'minusculas' | 'Titulo'
  outputText: string = '';
  isCopied: boolean = false;

  convert(): void {
    if (this.inputNumber === null || this.inputNumber === undefined || this.inputNumber === '') {
      this.outputText = '';
      return;
    }

    // Clean input: remove spaces and commas used as thousand separators, normalize decimal point
    const cleanedInput = this.inputNumber.toString().trim().replace(/\s/g, '').replace(/,/g, '.');
    const num = parseFloat(cleanedInput);

    if (isNaN(num)) {
      this.outputText = 'NÚMERO INVÁLIDO';
      return;
    }

    if (num < 0) {
      this.outputText = 'NÚMERO NEGATIVO NO SOPORTADO';
      return;
    }

    if (num >= 1000000000000) {
      this.outputText = 'NÚMERO DEMASIADO GRANDE (MÁXIMO 999,999,999,999)';
      return;
    }

    this.outputText = this.numeroALetras(num, {
      moneda: this.selectedMoneda,
      centavos: this.selectedCentavos,
      formato: this.selectedFormato
    });
  }

  numeroALetras(num: number, opciones: { moneda: string, centavos: string, formato: string }): string {
    const enteros = Math.floor(num);
    const centavosVal = Math.round((num - enteros) * 100);

    let resultado = '';

    if (enteros === 0) {
      resultado = 'cero';
    } else {
      resultado = this.convertirEntero(enteros);
    }

    let centavosTexto = '';
    if (centavosVal > 0) {
      const centTexto = this.convertirEntero(centavosVal);
      if (opciones.centavos) {
        centavosTexto = ` con ${centTexto} ${opciones.centavos}`;
      } else {
        centavosTexto = ` con ${centTexto}`;
      }
    } else {
      if (opciones.centavos) {
        centavosTexto = ` con cero ${opciones.centavos}`;
      }
    }

    // Adjust singular/plural and ending 'uno' to 'un'
    if (resultado.endsWith('uno') && opciones.moneda) {
      resultado = resultado.slice(0, -3) + 'un';
    }

    let textoFinal = '';
    if (opciones.moneda) {
      textoFinal = `${resultado} ${opciones.moneda}${centavosTexto}`;
    } else {
      // Remove leading 'con' if no currency is set, just join
      textoFinal = `${resultado}${centavosTexto}`;
    }

    // Clean spaces
    textoFinal = textoFinal.replace(/\s+/g, ' ').trim();

    if (opciones.formato === 'MAYUSCULAS') {
      return textoFinal.toUpperCase();
    } else if (opciones.formato === 'minusculas') {
      return textoFinal.toLowerCase();
    } else if (opciones.formato === 'Titulo') {
      return this.toTitleCase(textoFinal);
    }

    return textoFinal;
  }

  convertirEntero(num: number): string {
    if (num === 0) return '';

    const unidades = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const decenas = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
    const decenasVeinte = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

    if (num < 10) return unidades[num];
    if (num < 20) return decenas[num - 10];
    if (num < 30) {
      if (num === 20) return 'veinte';
      return `veinti${unidades[num - 20]}`;
    }
    if (num < 100) {
      const d = Math.floor(num / 10);
      const u = num % 10;
      if (u === 0) return decenasVeinte[d];
      return `${decenasVeinte[d]} y ${unidades[u]}`;
    }
    if (num < 1000) {
      if (num === 100) return 'cien';
      const c = Math.floor(num / 100);
      const resto = num % 100;
      return `${centenas[c]} ${this.convertirEntero(resto)}`.trim();
    }
    if (num < 1000000) {
      const miles = Math.floor(num / 1000);
      const resto = num % 1000;
      let textoMiles = '';
      if (miles === 1) {
        textoMiles = 'mil';
      } else {
        let milesStr = this.convertirEntero(miles);
        if (milesStr.endsWith('uno')) {
          milesStr = milesStr.slice(0, -3) + 'un';
        }
        textoMiles = `${milesStr} mil`;
      }
      return `${textoMiles} ${this.convertirEntero(resto)}`.trim();
    }
    if (num < 1000000000000) {
      const millones = Math.floor(num / 1000000);
      const resto = num % 1000000;
      let textoMillones = '';
      if (millones === 1) {
        textoMillones = 'un millón';
      } else {
        let millonesStr = this.convertirEntero(millones);
        if (millonesStr.endsWith('uno')) {
          millonesStr = millonesStr.slice(0, -3) + 'un';
        }
        textoMillones = `${millonesStr} millones`;
      }
      return `${textoMillones} ${this.convertirEntero(resto)}`.trim();
    }

    return 'número demasiado grande';
  }

  toTitleCase(str: string): string {
    return str.toLowerCase().replace(/(?:^|\s|-)\S/g, (m) => m.toUpperCase());
  }

  copyToClipboard() {
    if (!this.outputText) return;
    navigator.clipboard.writeText(this.outputText).then(() => {
      this.isCopied = true;
      setTimeout(() => this.isCopied = false, 2000);
    });
  }

  clearAll() {
    this.inputNumber = '';
    this.outputText = '';
  }
}
