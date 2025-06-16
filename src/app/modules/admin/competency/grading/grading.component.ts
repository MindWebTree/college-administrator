import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import { helperService } from 'app/core/auth/helper';
import { ActivatedRoute } from '@angular/router';
import { CompetencyService } from '../competency.service';

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

  questionOptions = [];
  Guid='';
  minRequiredOptions = ['All', '1', '2', '3', '4', '5'];
  

  constructor(private fb: FormBuilder, private _competencyService: CompetencyService,private _helperService: helperService,private route: ActivatedRoute) {
    this.gradingRulesForm = this.fb.group({
      rules: this.fb.array([], Validators.required),
      rubricId: ['', Validators.required] 
    });
    // Don't add default rule here, will be added after checking for existing rules
  }

  ngOnInit(): void {
    this.Guid = this.route.snapshot.paramMap.get('id');
    this.gradingRulesForm.patchValue({
      rubricId: this.Guid
    });
    
    // Load question options
    this._competencyService.getRubricListbyid(this.Guid).then((data) => {
      const criteriaList = data.sections.flatMap(section => section.criteria);
      this.questionOptions = criteriaList
        .filter((item: any) => item.isCritical)
        .map((item: any) => ({
          id: item.id,
          name: item.description
        }));
      
      // Load existing rules after questions are loaded
      this.loadExistingRules();
    });
  }

  hasExistingRules: boolean = false; // Add this property to track if rules exist

  loadExistingRules(): void {
    this._competencyService.getGradingRules(this.Guid).subscribe({
      next: (existingRules: any[]) => {
        if (existingRules && existingRules.length > 0) {
          this.hasExistingRules = true; // Set flag to true if rules exist
          
          // Clear the default rule that was added in constructor
          this.rules.clear();
          
          // Sort rules by ruleOrder
          const sortedRules = existingRules.sort((a, b) => a.ruleOrder - b.ruleOrder);
          
          sortedRules.forEach(rule => {
            this.addExistingRule(rule);
          });
        } else {
          this.hasExistingRules = false; // Set flag to false if no rules exist
        }
      },
      error: (err) => {
        console.error('Error loading existing rules:', err);
        this.hasExistingRules = false; // Set flag to false on error
        // If no existing rules or error, keep the default empty rule
      }
    });
  }

  addExistingRule(ruleData: any): void {
    const rule = this.fb.group({
      id: [ruleData.id || 0],
      label: [ruleData.label || '', [Validators.required]],
      logic: [String(ruleData.logic || 0), [Validators.required]],
      conditions: this.fb.array([], [Validators.required, Validators.minLength(1)])
    });

    // Sort conditions by conditionOrder before adding them
    const sortedConditions = ruleData.conditions 
      ? ruleData.conditions.sort((a, b) => a.conditionOrder - b.conditionOrder)
      : [];

    sortedConditions.forEach(conditionData => {
      this.addExistingCondition(rule, conditionData);
    });

    this.rules.push(rule);
  }

  addExistingCondition(rule: FormGroup, conditionData: any): void {
    const conditions = this.getConditions(rule);
    const condition = this.fb.group({
      id: [conditionData.id || 0],
      scoreOperator: [conditionData.scoreOperator || '>', [Validators.required]],
      scoreValue: [conditionData.scoreValue || null, [Validators.required, Validators.min(0)]],
      // FIX: Convert number to string for questionType
      questionType: [String(conditionData.questionType || 0), [Validators.required]],
      questions: [conditionData.questions || [], []],
      minRequired: [String(conditionData.minRequired || '1'), [Validators.required]],
      // FIX: Convert number to string for status
      status: [String(conditionData.status || 0), [Validators.required, this.statusValidator]]
    });
    conditions.push(condition);
  }

  get rules(): FormArray {
    return this.gradingRulesForm.get('rules') as FormArray;
  }

  addRule(): void {
    const rule = this.fb.group({
      id: [0], // Add id field for new rules
      label: ['', [Validators.required]],
      logic: ['0', [Validators.required]],
      conditions: this.fb.array([], [Validators.required, Validators.minLength(1)])
    });
    this.rules.push(rule);
    this.addCondition(rule);
  }

  removeRule(index: number): void {
    if (this.rules.length > 1) {
      this.rules.removeAt(index);
    }
  }

  getConditions(rule: FormGroup): FormArray {
    return rule.get('conditions') as FormArray;
  }

  addCondition(rule: FormGroup): void {
    const conditions = this.getConditions(rule);
    const condition = this.fb.group({
      id: [0], // Add id field for new conditions
      scoreOperator: ['>', [Validators.required]],
      scoreValue: [null, [Validators.required, Validators.min(0)]],
      // FIX: Use string values for consistency
      questionType: ['0', [Validators.required]],
      questions: [[], []],
      minRequired: ['1', [Validators.required]],
      // FIX: Use string values for consistency
      status: ['0', [Validators.required, this.statusValidator]]
    });
    conditions.push(condition);
  }

  removeCondition(rule: FormGroup, conditionIndex: number): void {
    const conditions = this.getConditions(rule);
    if (conditions.length > 1) {
      conditions.removeAt(conditionIndex);
    }
  }

  // Custom validator for questions array
  questionsValidator(control: any) {
    const value = control.value;
    if (!value || !Array.isArray(value) || value.length === 0) {
      return { required: true };
    }
    return null;
  }

  // FIX: Updated status validator to handle string values
  statusValidator(control: any) {
    const value = control.value;
    if (value === 0 || value === '0' || value === null || value === '') {
      return { invalidStatus: true };
    }
    return null;
  }

  // Helper method to check if a field has errors
  hasError(control: any, errorType: string): boolean {
    return control?.hasError(errorType) && (control?.dirty || control?.touched);
  }

  // Helper method to get error message
  getErrorMessage(control: any, fieldName: string): string {
    if (this.hasError(control, 'required')) {
      return `${fieldName} is required`;
    }
    if (this.hasError(control, 'min')) {
      return `${fieldName} must be greater than or equal to 0`;
    }
    if (this.hasError(control, 'invalidStatus')) {
      return 'Please select a valid status';
    }
    return '';
  }

  // Check if form is valid before submission
  isFormValid(): boolean {
    return this.gradingRulesForm.valid;
  }

  // Mark all fields as touched to show validation errors
  markAllFieldsAsTouched(): void {
    this.gradingRulesForm.markAllAsTouched();
    
    // Mark all nested form arrays as touched
    this.rules.controls.forEach((rule:any) => {
      rule.markAllAsTouched();
      const conditions = this.getConditions(rule);
      conditions.controls.forEach(condition => {
        condition.markAllAsTouched();
      });
    });
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.markAllFieldsAsTouched();
      console.log('Form is invalid. Please check all required fields.');
      return;
    }

    const formValue = this.gradingRulesForm.value;

    const transformedRules = formValue.rules.map((rule: any, ruleIndex: number) => {
      return {
        id: rule.id || 0, // Use existing id or 0 for new rules
        rubricId: formValue.rubricId || this.Guid,
        label: rule.label?.replace(/\s+/g, '') || '',
        logic: parseInt(rule.logic, 10),
        ruleOrder: ruleIndex + 1, // Start from 1 instead of 0
        createdAt: new Date().toISOString(),
        conditions: (rule.conditions || []).map((cond: any, condIndex: number) => ({
          id: cond.id || 0, // Use existing id or 0 for new conditions
          ruleId: rule.id || 0, // This will be set by the backend for new rules
          scoreOperator: cond.scoreOperator,
          scoreValue: String(cond.scoreValue),
          // FIX: Properly convert string back to number for API
          questionType: parseInt(cond.questionType, 10),
          minRequired: String(cond.minRequired),
          questions: Array.isArray(cond.questions) ? cond.questions.map(q => parseInt(q, 10)) : [],
          conditionOrder: condIndex + 1, // Start from 1 instead of 0
          createdAt: new Date().toISOString(),
          // FIX: Properly convert string back to number for API
          status: parseInt(cond.status, 10)
        }))
      };
    });

    console.log('Transformed payload:', transformedRules);

    // Determine which API to call based on whether rules exist
    if (this.hasExistingRules) {
      // Call Update API if rules exist
      console.log('Calling Update Rules API');
      this._competencyService.updateGradingRules(transformedRules).subscribe({
        next: (res) => {
          console.log('Rules updated successfully:', res);
          // Optionally reload the rules to get updated data
          this.loadExistingRules();
        },
        error: (err) => {
          console.error('Error updating rules:', err);
        }
      });
    } else {
      // Call Create API if no rules exist
      console.log('Calling Create Rules API');
      this._competencyService.createGradingRules(transformedRules).subscribe({
        next: (res) => {
          console.log('Rules created successfully:', res);
          // Set flag to true after successful creation
          this.hasExistingRules = true;
          // Optionally reload the rules to get updated IDs
          this.loadExistingRules();
        },
        error: (err) => {
          console.error('Error creating rules:', err);
        }
      });
    }
  }
}