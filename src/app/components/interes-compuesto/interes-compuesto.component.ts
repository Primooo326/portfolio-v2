// Copia y pega esta clase completa en tu archivo .ts
import { AfterViewInit, Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';
import * as XLSX from 'xlsx';

type DisplayData = {
  periodLabel: string;
  totalValue: number;
  totalContributions: number;
  sustainableWithdrawal?: number;
};

@Component({
  selector: 'app-interes-compuesto',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './interes-compuesto.component.html'
})
export class InterestCalculatorComponent implements AfterViewInit {
  currency: string = 'COP';
  initialInvestment: number = 1000000;
  interestRate: number = 9.25;
  compoundingFrequency: string = 'diaria';
  contributionAmount: number = 1000000;
  contributionInterval: string = 'quincenal';
  years: number = 1;
  displayPeriod: string = 'anual';
  tableData: DisplayData[] = [];
  showSustainableWithdrawal: boolean = false;
  chart: Chart | undefined;
  finalBalance: number = 0;
  totalContributions: number = 0;
  totalInterest: number = 0;

  ngAfterViewInit() {
    this.renderChart();
  }

  updateNumberValue(model: 'initialInvestment' | 'contributionAmount', event: any) {
    const value = event.target.value.replace(/[^0-9]/g, '');
    this[model] = Number(value);
  }

  // **NUEVO** Método para manejar el cambio de período
  onDisplayPeriodChange() {
    if (this.displayPeriod === 'mensual') {
      this.showSustainableWithdrawal = false;
    }
    this.renderChart();
  }

  renderChart() {
    const data = this.getCalculationData();
    if (!data.fullCalculation || data.fullCalculation.length === 0) return;

    const finalDataPoint = data.fullCalculation[data.fullCalculation.length - 1];
    this.finalBalance = finalDataPoint.totalValue;
    this.totalContributions = finalDataPoint.totalContributions;
    this.totalInterest = this.finalBalance - this.totalContributions;

    this.tableData = data.displayData;

    if (this.chart) {
      this.chart.destroy();
    }
    this.createChart();
  }

  // **MÉTODO DE CÁLCULO CON LA LÓGICA CORREGIDA**
  getCalculationData(): { displayData: DisplayData[], fullCalculation: DisplayData[] } {
    const getPeriodsPerYear = (interval: string) => {
      switch (interval) {
        case 'diaria': return 365; case 'semanal': return 52; case 'quincenal': return 24;
        case 'mensual': return 12; case 'trimestral': return 4; case 'semestral': return 2;
        case 'anual': return 1; default: return 0;
      }
    };

    const contributionsPerYear = getPeriodsPerYear(this.contributionInterval);
    if (contributionsPerYear === 0) return { displayData: [], fullCalculation: [] };

    const effectiveAnnualRate = this.interestRate / 100;
    const ratePerContributionPeriod = Math.pow(1 + effectiveAnnualRate, 1 / contributionsPerYear) - 1;

    const totalPeriods = this.years * contributionsPerYear;
    let futureValue = this.initialInvestment;
    let totalContributed = this.initialInvestment;

    const initialPoint: DisplayData = { periodLabel: 'Inicio', totalValue: futureValue, totalContributions: totalContributed, sustainableWithdrawal: 0 };
    const fullCalculation: DisplayData[] = [initialPoint];
    const displayData: DisplayData[] = [initialPoint];

    let lastDisplayedPoint = initialPoint;
    const monthlyPeriods = contributionsPerYear / 12;

    for (let period = 1; period <= totalPeriods; period++) {
      futureValue = futureValue * (1 + ratePerContributionPeriod) + this.contributionAmount;
      totalContributed += this.contributionAmount;

      const currentYear = Math.ceil(period / contributionsPerYear);
      const point: DisplayData = {
        periodLabel: `Periodo ${period}`,
        totalValue: parseFloat(futureValue.toFixed(2)),
        totalContributions: parseFloat(totalContributed.toFixed(2)),
      };
      fullCalculation.push(point);

      let shouldDisplay = false;
      let isAnnualView = false;

      switch (this.displayPeriod) {
        case 'mensual':
          if (contributionsPerYear >= 12 && period % monthlyPeriods === 0) {
            point.periodLabel = `Mes ${Math.round(period / monthlyPeriods)}`;
            shouldDisplay = true;
          }
          break;
        case 'anual':
          if (period % contributionsPerYear === 0) {
            point.periodLabel = `Año ${currentYear}`;
            shouldDisplay = true; isAnnualView = true;
          }
          break;
        case '5-anios':
        case '10-anios':
          const displayInterval = this.displayPeriod === '5-anios' ? 5 : 10;
          if (period % contributionsPerYear === 0 && currentYear > 0 && currentYear % displayInterval === 0) {
            point.periodLabel = `Año ${currentYear}`;
            shouldDisplay = true; isAnnualView = true;
          }
          break;
      }

      if (shouldDisplay) {
        if (this.showSustainableWithdrawal && isAnnualView) {
          const totalInterestNow = point.totalValue - point.totalContributions;
          const totalInterestPreviously = lastDisplayedPoint.totalValue - lastDisplayedPoint.totalContributions;
          const interestThisPeriod = totalInterestNow - totalInterestPreviously;
          point.sustainableWithdrawal = interestThisPeriod / 12;
        }
        displayData.push(point);
        lastDisplayedPoint = point;
      }
    }

    const finalDataPoint = fullCalculation[fullCalculation.length - 1];
    const lastDataPointInDisplay = displayData[displayData.length - 1];

    // **INICIO DE LA CORRECCIÓN CLAVE**
    if (lastDataPointInDisplay && lastDataPointInDisplay.totalValue !== finalDataPoint.totalValue) {
      finalDataPoint.periodLabel = `Año ${this.years}`;

      // Se calcula el retiro para este punto final específico, si es necesario.
      if (this.showSustainableWithdrawal) {
        const totalInterestFinal = finalDataPoint.totalValue - finalDataPoint.totalContributions;
        const totalInterestPrevious = lastDataPointInDisplay.totalValue - lastDataPointInDisplay.totalContributions;
        const interestThisFinalPeriod = totalInterestFinal - totalInterestPrevious;
        finalDataPoint.sustainableWithdrawal = interestThisFinalPeriod / 12;
      }

      displayData.push(finalDataPoint);
    }
    // **FIN DE LA CORRECCIÓN CLAVE**

    return { displayData, fullCalculation };
  }

  createChart() {
    const canvas = document.getElementById('interestChart') as HTMLCanvasElement;
    if (!canvas) return;

    // --- INICIO DE CAMBIOS: Paleta de colores para tema oscuro ---
    // Hemos reemplazado la detección dinámica por colores fijos de alto contraste.
    const textColor = '#E0E0E0'; // Un gris muy claro, casi blanco, para textos y etiquetas.
    const gridColor = 'rgba(255, 255, 255, 0.15)'; // Líneas de la cuadrícula sutiles pero visibles.
    const chartLineColor = '#38BDF8'; // Un azul cielo vibrante (Patrimonio Acumulado).
    const contributionsLineColor = '#FACC15'; // Un amarillo/ámbar para contraste (Total Invertido).
    // --- FIN DE CAMBIOS ---

    // Si ya existe un gráfico, lo destruimos para evitar conflictos al recrearlo.
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.tableData.map(d => d.periodLabel),
        datasets: [
          {
            label: 'Patrimonio Acumulado',
            data: this.tableData.map(d => d.totalValue),
            borderColor: chartLineColor,
            // CAMBIO: El color de fondo del área ahora coincide con la nueva línea.
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            fill: true,
            tension: 0.3
          },
          {
            label: 'Total Invertido (Sin Intereses)',
            data: this.tableData.map(d => d.totalContributions),
            borderColor: contributionsLineColor,
            borderDash: [5, 5],
            fill: false,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: textColor } }, // Usa el nuevo color de texto
          tooltip: {
            // Estilos para el tooltip que se ve al pasar el mouse
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#FFFFFF',
            bodyColor: '#FFFFFF',
            callbacks: {
              label: (context: any) => {
                let label = context.dataset.label || '';
                if (label) { label += ': '; }
                if (context.parsed?.y !== null) {
                  label += new Intl.NumberFormat('es-CO', { style: 'currency', currency: this.currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(context.parsed.y);
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Período', color: textColor },
            ticks: { color: textColor },
            grid: { color: gridColor } // Usa el nuevo color de cuadrícula
          },
          y: {
            title: { display: true, text: `Valor (${this.currency})`, color: textColor },
            ticks: {
              color: textColor,
              callback: (value) => {
                if (Number(value) >= 1000000) return (Number(value) / 1000000).toFixed(1) + 'M';
                if (Number(value) >= 1000) return (Number(value) / 1000) + 'K';
                return value;
              }
            },
            grid: { color: gridColor } // Usa el nuevo color de cuadrícula
          }
        }
      }
    });
  }


  // **NUEVO MÉTODO** para exportar a Excel
  exportToExcel(): void {
    // 1. Prepara los datos para la exportación
    const dataToExport = this.tableData.map(row => {
      const exportRow: any = {
        'Período': row.periodLabel,
        'Total Invertido': row.totalContributions,
        'Intereses Ganados': row.totalValue - row.totalContributions,
        'Balance Total': row.totalValue,
      };
      // Añade la columna de retiro solo si está visible
      if (this.showSustainableWithdrawal) {
        exportRow['Retiro Mensual Sostenible'] = row.sustainableWithdrawal ?? 0;
      }
      return exportRow;
    });

    // 2. Crea la hoja de cálculo y el libro
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inversión'); // 'Inversión' es el nombre de la pestaña

    // 3. Genera y descarga el archivo
    XLSX.writeFile(wb, 'calculo-interes-compuesto.xlsx');
  }
}
