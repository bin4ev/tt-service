import { Component, inject, OnInit, ViewChild } from "@angular/core";
import {
  FullCalendarComponent,
  FullCalendarModule,
} from "@fullcalendar/angular";
import { CalendarOptions, EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import {
  getOpeningTimeDateForDay,
  getWorkingHoursForDay,
  WORKING_TIME,
} from "src/app/core/constants/constants";
import { CalendarEvent, CalendarService } from "./services/calendar.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDialog } from "@angular/material/dialog";
import { CreateSlotComponent } from "./create-slot/create-slot.component";
import { NotificationService } from "src/app/core/services/notification.service";
import { switchMap } from "rxjs";
import { TranslateModule } from "@ngx-translate/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import bgLocale from "@fullcalendar/core/locales/bg";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
@Component({
  selector: "app-calendar",
  standalone: true,
  imports: [
    FullCalendarModule,
    MatTooltipModule,
    TranslateModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule
  ],
  templateUrl: "./calendar.component.html",
  styleUrl: "./calendar.component.scss",
})
export class CalendarComponent implements OnInit {
  @ViewChild(FullCalendarComponent) calendarComponent?: FullCalendarComponent;

  #calendarService = inject(CalendarService);
  #matDialog = inject(MatDialog);
  #notificationService = inject(NotificationService);
  #breakpointObserver = inject(BreakpointObserver);

  startWorkingTime = WORKING_TIME.split("-")[0];
  endWorkingTime = WORKING_TIME.split("-")[1];
  searchTerm: string = "";
  allEvents: any = [];
  filteredEvents: any = [];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: window.innerWidth < 768 ? "timeGridDay" : "timeGridWeek",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    // auto-adjust when resizing
    slotMinTime: this.startWorkingTime,
    slotMaxTime: this.endWorkingTime,
    slotLabelInterval: "00:30:00",
    firstDay: 1,
    locale: bgLocale,
    nowIndicator: true,

    businessHours: {
      // Highlight working hours
      daysOfWeek: [1, 2, 3, 4, 5, 6], // Monday to Saturday (0 = Sunday)
      startTime: this.startWorkingTime,
      endTime: this.endWorkingTime,
    },
    selectable: true,
    editable: true,
    events: [],
    eventContent: (arg) => {
      const props = arg.event.extendedProps;
      const tooltip = `Service: ${props["service"]}\nEmail: ${props["email"]}\nPhone: ${props["phone"]}`;

      return {
        html: `
      <div title="${tooltip}">
        <strong>${arg.event.title}</strong>
      </div>
    `,
      };
    },
    eventDrop: this.editEvent.bind(this), // when an event is dropped
    eventResize: this.editEvent.bind(this), // when an event is resized
    dateClick: this.handleDateClick.bind(this), // for new event (empty slot)
    eventClick: this.handleEventClick.bind(this), // for existing event

    slotLabelFormat: {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // force 24-hour format
    },
    eventTimeFormat: {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // event times also in 24-hour format
    },
    contentHeight: "auto",
    eventDidMount: (arg) => {
      // Attach event ID to the element
      const el = arg.el as HTMLElement;
      if (arg.event.id) {
        el.setAttribute("data-event-id", arg.event.id);
      }
    },
  };

  constructor() {}

  ngOnInit() {
    this.getAll();
  }

  ngAfterViewInit() {
    this.observeScreenSize();
  }

  observeScreenSize() {
    this.#breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe((result) => {
        const calendarApi = this.calendarComponent?.getApi();
        if (!calendarApi) return;

        if (result.matches) {
          // Mobile / Tablet
          calendarApi.changeView("timeGridDay");
          calendarApi.setOption("headerToolbar", {
            left: "prev,next",
            center: "title",
            right: "dayGridMonth,timeGridDay",
          });
        } else {
          // Desktop
          calendarApi.changeView("timeGridWeek");
          calendarApi.setOption("headerToolbar", {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          });
        }
      });
  }

  getAll() {
    this.#calendarService.getEvents().subscribe((evs) => {
      console.log(evs);
      this.allEvents = evs;
      this.filteredEvents = evs;
      this.calendarOptions.events = evs;
    });
  }

  handleDateClick(arg: DateClickArg) {
    this.createEvent(arg);
  }

  handleEventClick(arg: EventClickArg) {
    this.editEvent(arg);
  }

  createEvent(arg: DateClickArg) {
   
    const compRef = this.#matDialog.open(CreateSlotComponent).componentInstance;
    compRef.isAdmin = true;
    let selectedDate = arg.date
    if (arg.allDay) {
      compRef.formData.durationHours = getWorkingHoursForDay(arg.date);
      selectedDate = getOpeningTimeDateForDay(arg.date);
    }
    compRef.selectedDate = selectedDate;

    compRef.slotCreated
      .pipe(switchMap((res) => this.#calendarService.createEvent(res)))
      .subscribe((_) => {
        this.#notificationService.showSuccess("Успешно запазихте час!");
        this.getAll();
      });
  }

  editEvent(arg: EventClickArg) {
    const dialogRef = this.#matDialog.open(CreateSlotComponent);
    const compRef = dialogRef.componentInstance;

    compRef.isAdmin = true;
    compRef.selectedDate = arg.event.start as Date;
    compRef.formData = {
      ...arg.event.extendedProps,
      durationHours:
        arg.event.end && arg.event.start
          ? (arg.event.end.getTime() - arg.event.start.getTime()) /
            (1000 * 60 * 60)
          : 0,
      id: arg.event.id,
    } as any;

    compRef.slotCreated
      .pipe(switchMap((res) => this.#calendarService.updateEvent(res)))
      .subscribe(() => {
        this.#notificationService.showSuccess("Успешно редактирахте час!");
        this.getAll();
        dialogRef.close();
      });

    compRef.slotDeleted.subscribe(() => {
      this.#calendarService.deleteEvent({ id: arg.event.id }).subscribe(() => {
        this.#notificationService.showSuccess("Успешно изтрихте час!");
        this.getAll();
        dialogRef.close();
      });
    });
  }

  filterEvents() {
    const term = this.searchTerm.toLowerCase();
    this.filteredEvents = this.allEvents.filter(
      (ev: any) =>
        ev.title.toLowerCase().includes(term) ||
        (ev.extendedProps?.phone || "").toLowerCase().includes(term) ||
        (ev.extendedProps?.email || "").toLowerCase().includes(term) ||
        (ev.extendedProps?.service || "").toLowerCase().includes(term)
    );
  }

  clearSearch() {
    this.searchTerm = "";
    this.filteredEvents = this.allEvents;
  }

  goToEvent(ev: CalendarEvent) {
    const calendarApi = this.calendarComponent?.getApi();
    if (!calendarApi) return;

    if (ev.start) {
      calendarApi.gotoDate(ev.start as Date); // jump to date
      calendarApi.changeView("timeGridDay"); // switch to day view

      setTimeout(() => {
        // Find the event element by ID
        const eventEl = document.querySelector(
          `[data-event-id="${ev.id}"]`
        ) as HTMLElement;

        if (eventEl) {
          // Highlight
          eventEl.scrollIntoView({ behavior: "smooth", block: "center" });
          eventEl.classList.add("highlighted");
          setTimeout(() => eventEl.classList.remove("highlighted"), 3000);

          // Scroll into view
        }
      }, 300); // wait a bit for calendar to render events
    }
  }

  displayWith(ev: any) {
    return ev && ev.title ? ev.title : "";
  }
}
