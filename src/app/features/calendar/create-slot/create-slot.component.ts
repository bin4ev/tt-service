import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogClose } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { MatError, MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { TranslateModule } from "@ngx-translate/core";
import { CalendarEvent } from "../services/calendar.service";

@Component({
  selector: "app-create-slot",
  standalone: true,
  imports: [
    MatInputModule,
    FormsModule,
    TranslateModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatIcon,
    CdkTextareaAutosize,
    MatDialogClose
  ],
  templateUrl: "./create-slot.component.html",
  styleUrl: "./create-slot.component.scss",
})
export class CreateSlotComponent {
  @Input() isAdmin: boolean = false;
  @Input() selectedDate!: Date
  @Output() slotCreated = new EventEmitter<CalendarEvent>();
  @Output() slotDeleted = new EventEmitter();

  formData :any = {
    name: "",
    email: "",
    phone: "",
    service: "",
    durationHours: 1,
  };

 onSubmit(form: any, event: Event) {
  event.preventDefault();
  if (form.invalid) return;

  const startDate = new Date(this.selectedDate);
  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + this.formData.durationHours);

  const newEvent = {
    title: `${this.formData.name} - ${this.formData.service}`,
    start: startDate,
    end: endDate,
    extendedProps: {
      name: this.formData.name,
      email: this.formData.email,
      phone: this.formData.phone,
      service: this.formData.service,
    },
    ...(this.formData?.id && { id: this.formData.id })
  };

  this.slotCreated.emit(newEvent);
  form.resetForm();
}

  onDelete() {
    
    this.slotDeleted.emit();
  }

}
