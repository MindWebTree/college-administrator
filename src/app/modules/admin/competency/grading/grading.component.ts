import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-grading',
  standalone: true,
  imports: [FormsModule, CommonModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule],
  templateUrl: './grading.component.html',
  styleUrl: './grading.component.scss'
})
export class GradingComponent {
  gradingRulesForm: FormGroup;

  questionOptions = [5, 6, 7, 8, 9, 10];
  minRequiredOptions = ['All', 1, 2, 3, 4, 5];

  constructor(private fb: FormBuilder) {
    this.gradingRulesForm = this.fb.group({
      rules: this.fb.array([])
    });
    this.addRule(); // Start with one rule
  }

  get rules(): FormArray {
    return this.gradingRulesForm.get('rules') as FormArray;
  }

  addRule(): void {
    const rule = this.fb.group({
      label: ['', Validators.required],
      logic: ['AND'],
      conditions: this.fb.array([])
    });
    this.rules.push(rule);
    this.addCondition(rule);
  }

  removeRule(index: number): void {
    this.rules.removeAt(index);
  }

  getConditions(rule: FormGroup): FormArray {
    return rule.get('conditions') as FormArray;
  }

  addCondition(rule: FormGroup): void {
    const conditions = this.getConditions(rule);
    const condition = this.fb.group({
      scoreOperator: ['>'],
      scoreValue: [null, Validators.required],
      questionType: ['correct'],
      questions: [[]],
      minRequired: ['1']
    });
    conditions.push(condition);
  }

  removeCondition(rule: FormGroup, conditionIndex: number): void {
    this.getConditions(rule).removeAt(conditionIndex);
  }

  onSubmit(): void {
    console.log('Grading Rules Data:', this.gradingRulesForm.value);
    console.log('Grading Rules Data:', JSON.stringify(this.gradingRulesForm.value));
    alert('Rules saved! Check console for structure.');
  }
}