import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-cleaner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-cleaner.component.html',
  styleUrl: './list-cleaner.component.scss'
})
export class ListCleanerComponent {
  inputText = '';
  outputText = '';

  // Options
  removeDuplicates = true;
  trimSpaces = true;
  removeEmptyLines = true;
  textFormat = 'none'; // 'none' | 'upper' | 'lower' | 'title'
  sorting = 'none'; // 'none' | 'asc' | 'desc'
  inputSeparator = 'newline'; // 'newline' | 'comma' | 'semicolon'
  outputSeparator = 'newline'; // 'newline' | 'comma' | 'semicolon'

  // Stats
  inputCount = 0;
  outputCount = 0;
  duplicateCount = 0;
  isCopied = false;

  processList() {
    if (!this.inputText) {
      this.outputText = '';
      this.inputCount = 0;
      this.outputCount = 0;
      this.duplicateCount = 0;
      return;
    }

    // 1. Split input into elements based on selected separator
    let delimiter: RegExp | string = /\r?\n/;
    if (this.inputSeparator === 'comma') {
      delimiter = ',';
    } else if (this.inputSeparator === 'semicolon') {
      delimiter = ';';
    }

    let items = this.inputText.split(delimiter);
    this.inputCount = items.length;

    // 2. Trim spaces if enabled
    if (this.trimSpaces) {
      items = items.map(item => item.trim().replace(/\s+/g, ' '));
    }

    // 3. Remove empty lines if enabled
    if (this.removeEmptyLines) {
      items = items.filter(item => item !== '');
    }

    const totalBeforeDeduplication = items.length;

    // 4. Remove duplicates if enabled
    if (this.removeDuplicates) {
      const seen = new Set<string>();
      items = items.filter(item => {
        if (seen.has(item)) {
          return false;
        }
        seen.add(item);
        return true;
      });
      this.duplicateCount = totalBeforeDeduplication - items.length;
    } else {
      this.duplicateCount = 0;
    }

    // 5. Apply text format
    if (this.textFormat === 'upper') {
      items = items.map(item => item.toUpperCase());
    } else if (this.textFormat === 'lower') {
      items = items.map(item => item.toLowerCase());
    } else if (this.textFormat === 'title') {
      items = items.map(item => this.toTitleCase(item));
    }

    // 6. Sorting
    if (this.sorting === 'asc') {
      items.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    } else if (this.sorting === 'desc') {
      items.sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' }));
    }

    this.outputCount = items.length;

    // 7. Join with output separator
    let joiner = '\n';
    if (this.outputSeparator === 'comma') {
      joiner = ', ';
    } else if (this.outputSeparator === 'semicolon') {
      joiner = '; ';
    }

    this.outputText = items.join(joiner);
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
    this.inputText = '';
    this.outputText = '';
    this.inputCount = 0;
    this.outputCount = 0;
    this.duplicateCount = 0;
  }
}
