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
  initialInvestment: number = 1000;
  contributionAmount: number = 100;
  contributionInterval: string = 'mensual';
  interestRate: number = 9.5;
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

  getCalculationData(): { year: number, totalValue: number, totalContributions: number }[] {
    const data: { year: number, totalValue: number, totalContributions: number }[] = [];
    let futureValue = this.initialInvestment;
    let totalContributed = this.initialInvestment;

    const annualInterestRate = this.interestRate / 100;
    let contributionsPerYear = 0;
    switch (this.contributionInterval) {
      case 'quincenal': contributionsPerYear = 24; break;
      case 'mensual': contributionsPerYear = 12; break;
      case 'trimestral': contributionsPerYear = 4; break;
      case 'semestral': contributionsPerYear = 2; break;
      case 'anual': contributionsPerYear = 1; break;
    }
    const totalAnnualContribution = this.contributionAmount * contributionsPerYear;

    for (let i = 0; i <= this.years; i++) {
      data.push({
        year: i,
        totalValue: parseFloat(futureValue.toFixed(2)),
        totalContributions: parseFloat(totalContributed.toFixed(2)),
      });
      futureValue = futureValue * (1 + annualInterestRate) + totalAnnualContribution;
      totalContributed += totalAnnualContribution;
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

    if (this.chart.options.plugins?.tooltip?.callbacks) {
      this.chart.options.plugins.tooltip.callbacks.label = (context: any) => {
        let label = context.dataset.label || '';
        if (label) { label += ': '; }
        if (context.parsed && context.parsed['y'] !== null) {
          label += new Intl.NumberFormat('es-CO', { style: 'currency', currency: this.currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(context.parsed['y']);
        }
        return label;
      }
    }

    this.chart.update();
  }
}
