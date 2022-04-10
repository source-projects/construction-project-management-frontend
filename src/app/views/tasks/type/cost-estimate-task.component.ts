import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  ScopeOfWork,
  ScopeOfWorkTask,
} from 'src/app/models/scope-of-work.model';
import { Task } from 'src/app/models/task.model';
import { TaskClientApiService } from 'src/app/services/task-client-api.service';
import { AddScopeOfWorkMaterialComponent } from '../../modals/add-scope-of-work-material.component';
import { AddScopeOfWorkTaskComponent } from '../../modals/add-scope-of-work-task.component';
import { AddScopeComponent } from '../../modals/add-scope.component';
import { TaskHandler } from './task-handler';

@Component({
  selector: 'app-cost-estimate-task',
  templateUrl: './cost-estimate-task.component.html',
  styleUrls: ['./cost-estimate-task.component.scss'],
})
export class CostEstimateTaskComponent implements OnInit, TaskHandler {
  @Input() task!: Task;

  scopes: ScopeOfWork[] = [];

  constructor(
    private dialog: MatDialog,
    public router: Router,
    private taskClientAPI: TaskClientApiService
  ) {}

  ngOnInit(): void {}

  showAddScopeForm(): void {
    const dialogRef = this.dialog.open(AddScopeComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((data: ScopeOfWork) => {
      if (data) {
        this.scopes.push(data);
      }
    });
  }

  showAddScopeWorkForm(scope: ScopeOfWork): void {
    const dialogRef = this.dialog.open(AddScopeOfWorkTaskComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((data: ScopeOfWorkTask) => {
      if (data) {
        scope.tasks.push(data);
      }
    });
  }

  deleteTask(scope: ScopeOfWork, index: number): void {
    scope.tasks.splice(index, 1);
  }

  editTask(task: ScopeOfWorkTask): void {
    const dialogRef = this.dialog.open(AddScopeOfWorkTaskComponent, {
      data: task,
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        task.name = data.name;
        task.quantity = data.quantity;
        task.unit = data.unit;
      }
    });
  }

  showAddMaterialsForm(task: ScopeOfWorkTask): void {
    const dialogRef = this.dialog.open(AddScopeOfWorkMaterialComponent);

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        task.materials.push(data);
      }
    });
  }

  setTask(task: Task): void {
    this.task = task;
  }

  complete() {
    this.taskClientAPI.completeTask(this.task).subscribe(() => {
      this.router.navigate(['/tasks']);
    });
  }
}
