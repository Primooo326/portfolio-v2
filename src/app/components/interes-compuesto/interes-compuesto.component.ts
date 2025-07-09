import { AfterViewInit, Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-interes-compuesto',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  template: `
    <div class="flex flex-col items-center justify-center w-full">
      <form (ngSubmit)="renderChart()" class="space-y-4 w-full">
        <div class="grid grid-cols-2 gap-4 w-full">
          <div>
            <label class="label"><span class="label-text text-base-content">Inversión Inicial</span></label>
            <input
              type="text"
              [value]="initialInvestment | number:'1.0-0'"
              (input)="updateNumberValue('initialInvestment', $event)"
              class="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label class="label"><span class="label-text text-base-content">Tasa de Interés Anual (%)</span></label>
            <input type="number" [(ngModel)]="interestRate" name="interest-rate" required class="input input-bordered w-full" />
          </div>

          <div>
            <label class="label"><span class="label-text text-base-content">Frec. de Capitalización (Banco)</span></label>
            <select [(ngModel)]="compoundingFrequency" name="compounding-frequency" class="select select-bordered w-full">
              <option value="diaria">Diaria</option>
              <option value="semanal">Semanal</option>
              <option value="quincenal">Quincenal</option>
              <option value="mensual">Mensual</option>
              <option value="trimestral">Trimestral</option>
              <option value="semestral">Semestral</option>
              <option value="anual">Anual</option>
            </select>
          </div>

          <div>
            <label class="label"><span class="label-text text-base-content">Monto de Contribución</span></label>
            <input
              type="text"
              [value]="contributionAmount | number:'1.0-0'"
              (input)="updateNumberValue('contributionAmount', $event)"
              class="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label class="label"><span class="label-text text-base-content">Intervalo de Contribución</span></label>
            <select [(ngModel)]="contributionInterval" name="contribution-interval" class="select select-bordered w-full">
              <option value="diaria">Diaria</option>
              <option value="semanal">Semanal</option>
              <option value="quincenal">Quincenal</option>
              <option value="mensual">Mensual</option>
              <option value="trimestral">Trimestral</option>
              <option value="semestral">Semestral</option>
              <option value="anual">Anual</option>
            </select>
          </div>
          <div>
            <label class="label"><span class="label-text text-base-content">Número de Años</span></label>
            <input type="number" [(ngModel)]="years" name="years" required class="input input-bordered w-full" />
          </div>
          <div>
            <label class="label"><span class="label-text text-base-content">Moneda</span></label>
            <select [(ngModel)]="currency" name="currency" class="select select-bordered w-full">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="COP">COP</option>
            </select>
          </div>
        </div>
        <div class="card-actions pt-4 w-full">
          <button type="submit" class="btn btn-secondary text-secondary-content w-full">Calcular</button>
        </div>
      </form>

      <div *ngIf="finalBalance > 0" class="stats stats-vertical lg:stats-horizontal shadow mt-8 bg-secondary text-secondary-content w-full">
        <div class="stat">
          <div class="stat-title">Balance Final</div>
          <div class="stat-value text-2xl lg:text-3xl">{{ finalBalance | currency:currency:'symbol':'1.0-0' }}</div>
        </div>
        <div class="stat">
          <div class="stat-title">Total Contribuido</div>
          <div class="stat-value text-2xl lg:text-3xl">{{ totalContributions | currency:currency:'symbol':'1.0-0' }}</div>
        </div>
        <div class="stat">
          <div class="stat-title">Ganancia (Intereses)</div>
          <div class="stat-value text-accent text-2xl lg:text-3xl">{{ totalInterest | currency:currency:'symbol':'1.0-0' }}</div>
        </div>
      </div>

      <div class="mt-8 w-full">
        <canvas id="interestChart"></canvas>
      </div>
    </div>
  `,
})
export class InterestCalculatorComponent implements AfterViewInit {
  currency: string = 'COP';
  initialInvestment: number = 1000000;
  interestRate: number = 9.5;

  // Frecuencia de capitalización del banco
  compoundingFrequency: string = 'mensual';

  // Datos de las contribuciones del usuario
  contributionAmount: number = 100000;
  contributionInterval: string = 'mensual';

  years: number = 20;
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

  renderChart() {
    const data = this.getCalculationData();
    if (!data.length) return;

    const finalDataPoint = data[data.length - 1];
    this.finalBalance = finalDataPoint.totalValue;
    this.totalContributions = finalDataPoint.totalContributions;
    this.totalInterest = this.finalBalance - this.totalContributions;

    if (this.chart) {
      this.updateChart(data);
    } else {
      this.createChart(data);
    }
  }

  /**
   * ✅ LÓGICA DE CÁLCULO AVANZADA
   * Simula el crecimiento período a período basándose en la frecuencia de capitalización,
   * pero distribuyendo los aportes según su propio intervalo.
   */
  getCalculationData(): { year: number, totalValue: number, totalContributions: number }[] {
    // 1. Determinar las frecuencias anuales para ambos intervalos
    const getPeriodsPerYear = (interval: string) => {
      switch (interval) {
        case 'diaria': return 365;
        case 'semanal': return 52;
        case 'quincenal': return 24;
        case 'mensual': return 12;
        case 'trimestral': return 4;
        case 'semestral': return 2;
        case 'anual': return 1;
        default: return 0;
      }
    };

    const compoundingPeriodsPerYear = getPeriodsPerYear(this.compoundingFrequency);
    const contributionsPerYear = getPeriodsPerYear(this.contributionInterval);

    if (compoundingPeriodsPerYear === 0) return [];

    // 2. Calcular los valores por período de CAPITALIZACIÓN
    const ratePerCompoundingPeriod = (this.interestRate / 100) / compoundingPeriodsPerYear;
    const contributionValuePerCompoundingPeriod = this.contributionAmount * (contributionsPerYear / compoundingPeriodsPerYear);

    // 3. Simulación
    const data: { year: number, totalValue: number, totalContributions: number }[] = [];
    let futureValue = this.initialInvestment;
    let totalContributed = this.initialInvestment;

    data.push({
      year: 0,
      totalValue: parseFloat(futureValue.toFixed(2)),
      totalContributions: parseFloat(totalContributed.toFixed(2)),
    });

    for (let i = 0; i < this.years; i++) {
      // Bucle interno que simula el crecimiento para cada período de capitalización en un año
      for (let j = 0; j < compoundingPeriodsPerYear; j++) {
        futureValue = futureValue * (1 + ratePerCompoundingPeriod) + contributionValuePerCompoundingPeriod;
      }

      // El total contribuido se actualiza anualmente para el gráfico
      totalContributed += this.contributionAmount * contributionsPerYear;

      data.push({
        year: i + 1,
        totalValue: parseFloat(futureValue.toFixed(2)),
        totalContributions: parseFloat(totalContributed.toFixed(2)),
      });
    }
    return data;
  }

  createChart(data: { year: number, totalValue: number, totalContributions: number }[]) {
    const canvas = document.getElementById('interestChart') as HTMLCanvasElement;
    if (!canvas) return;

    const chartLineColor = '#00a6ff';
    const contributionsLineColor = '#ffb300';
    const gridColor = 'rgba(255, 255, 255, 0.2)';
    const textColor = '#ffffff';

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: data.map(d => d.year),
        datasets: [
          {
            label: 'Patrimonio Acumulado',
            data: data.map(d => d.totalValue),
            borderColor: chartLineColor,
            backgroundColor: 'rgba(0, 166, 255, 0.1)',
            fill: true,
            tension: 0.3
          },
          {
            label: 'Total Contribuido',
            data: data.map(d => d.totalContributions),
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
          legend: { labels: { color: textColor } },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                let label = context.dataset.label || '';
                if (label) { label += ': '; }
                if (context.parsed && context.parsed['y'] !== null) {
                  label += new Intl.NumberFormat('es-CO', { style: 'currency', currency: this.currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(context.parsed['y']);
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Años', color: textColor },
            ticks: { color: textColor },
            grid: { color: gridColor }
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
            grid: { color: gridColor }
          }
        }
      }
    });
  }

  updateChart(data: { year: number, totalValue: number, totalContributions: number }[]) {
    if (!this.chart) return;
    this.chart.data.labels = data.map(d => d.year);
    this.chart.data.datasets[0].data = data.map(d => d.totalValue);
    this.chart.data.datasets[1].data = data.map(d => d.totalContributions);
    this.chart.update();
  }
}
