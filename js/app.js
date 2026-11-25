const field = (name, label, options = {}) => ({ name, label, type: "text", required: true, ...options });
const lookup = (table, valueField, labelField) => ({ table, valueField, labelField });

const ENTITIES = {
  Departments: {
    table: "department",
    pk: "department_id",
    generatedPk: true,
    fields: [
      field("department_name", "Department Name"),
      field("location", "Location"),
      field("contact_info", "Contact Information"),
      field("manager_doctor_id", "Manager Doctor", { type: "number", required: false, lookup: lookup("doctor", "doctor_id", "name") })
    ]
  },
  Doctors: {
    table: "doctor",
    pk: "doctor_id",
    generatedPk: true,
    fields: [
      field("name", "Name"),
      field("specialization", "Specialization"),
      field("phone_number", "Phone Number"),
      field("email", "Email", { type: "email" }),
      field("department_id", "Department", { type: "number", lookup: lookup("department", "department_id", "department_name") })
    ]
  },
  Patients: {
    table: "patient",
    pk: "patient_id",
    generatedPk: true,
    fields: [
      field("name", "Name"),
      field("date_of_birth", "Date of Birth", { type: "date" }),
      field("gender", "Gender", { choices: ["Male", "Female"] }),
      field("phone_number", "Phone Number"),
      field("address", "Address", { wide: true }),
      field("blood_type", "Blood Type", { choices: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] }),
      field("emergency_contact", "Emergency Contact", { wide: true })
    ]
  },
  Rooms: {
    table: "room",
    pk: "room_number",
    generatedPk: false,
    fields: [
      field("room_number", "Room Number"),
      field("room_type", "Room Type"),
      field("floor", "Floor", { type: "number" }),
      field("capacity", "Capacity", { type: "number" }),
      field("availability_status", "Availability", { choices: ["Available", "Occupied", "Maintenance"] })
    ]
  },
  Appointments: {
    table: "appointment",
    pk: "appointment_id",
    generatedPk: true,
    fields: [
      field("patient_id", "Patient", { type: "number", lookup: lookup("patient", "patient_id", "name") }),
      field("doctor_id", "Doctor", { type: "number", lookup: lookup("doctor", "doctor_id", "name") }),
      field("appointment_datetime", "Date and Time", { type: "datetime-local" }),
      field("reason_for_visit", "Reason for Visit", { textarea: true, wide: true }),
      field("status", "Status", { choices: ["Scheduled", "Completed", "Cancelled"] })
    ]
  },
  Admissions: {
    table: "admission",
    pk: "admission_id",
    generatedPk: true,
    fields: [
      field("patient_id", "Patient", { type: "number", lookup: lookup("patient", "patient_id", "name") }),
      field("doctor_id", "Supervising Doctor", { type: "number", lookup: lookup("doctor", "doctor_id", "name") }),
      field("room_number", "Room", { lookup: lookup("room", "room_number", "room_type") }),
      field("admission_date", "Admission Date", { type: "date" }),
      field("discharge_date", "Discharge Date", { type: "date", required: false })
    ]
  },
  "Medical Records": {
    table: "medical_record",
    pk: "record_id",
    generatedPk: true,
    fields: [
      field("patient_id", "Patient", { type: "number", lookup: lookup("patient", "patient_id", "name") }),
      field("doctor_id", "Doctor", { type: "number", lookup: lookup("doctor", "doctor_id", "name") }),
      field("diagnosis", "Diagnosis", { wide: true }),
      field("treatment_details", "Treatment Details", { textarea: true, wide: true }),
      field("medical_notes", "Medical Notes", { textarea: true, wide: true, required: false }),
      field("record_date", "Record Date", { type: "date" })
    ]
  },
  Prescriptions: {
    table: "prescription",
    pk: "prescription_id",
    generatedPk: true,
    fields: [
      field("patient_id", "Patient", { type: "number", lookup: lookup("patient", "patient_id", "name") }),
      field("doctor_id", "Doctor", { type: "number", lookup: lookup("doctor", "doctor_id", "name") }),
      field("prescription_date", "Prescription Date", { type: "date" })
    ]
  },
  "Prescription Items": {
    table: "prescription_item",
    pk: "prescription_item_id",
    generatedPk: true,
    fields: [
      field("prescription_id", "Prescription", { type: "number", lookup: lookup("prescription", "prescription_id", "prescription_date") }),
      field("medication_id", "Medication", { type: "number", lookup: lookup("medication", "medication_id", "medication_name") }),
      field("dosage", "Dosage"),
      field("frequency", "Frequency"),
      field("start_date", "Start Date", { type: "date" }),
      field("end_date", "End Date", { type: "date" })
    ]
  },
  Medications: {
    table: "medication",
    pk: "medication_id",
    generatedPk: true,
    fields: [
      field("medication_name", "Medication Name"),
      field("description", "Description", { textarea: true, wide: true }),
      field("quantity_available", "Quantity Available", { type: "number" })
    ]
  },
  Bills: {
    table: "bill",
    pk: "bill_id",
    generatedPk: true,
    fields: [
      field("patient_id", "Patient", { type: "number", lookup: lookup("patient", "patient_id", "name") }),
      field("appointment_id", "Appointment", { type: "number", required: false, lookup: lookup("appointment", "appointment_id", "appointment_datetime") }),
      field("admission_id", "Admission", { type: "number", required: false, lookup: lookup("admission", "admission_id", "admission_date") }),
      field("prescription_id", "Prescription", { type: "number", required: false, lookup: lookup("prescription", "prescription_id", "prescription_date") }),
      field("total_amount", "Total Amount", { type: "number", step: "0.01" }),
      field("issue_date", "Issue Date", { type: "date" }),
      field("payment_status", "Payment Status", { choices: ["Unpaid", "Partially Paid", "Paid"] })
    ]
  },
  Payments: {
    table: "payment",
    pk: "payment_id",
    generatedPk: true,
    fields: [
      field("bill_id", "Bill", { type: "number", lookup: lookup("bill", "bill_id", "total_amount") }),
      field("payment_date", "Payment Date", { type: "date" }),
      field("amount_paid", "Amount Paid", { type: "number", step: "0.01" }),
      field("payment_method", "Payment Method", { choices: ["Cash", "Card", "Insurance", "Bank Transfer"] })
    ]
  }
};

const REPORTS = {
  "Upcoming Appointments": { view: "upcoming_appointments", order: "appointment_datetime" },
  "Available Rooms": { view: "available_rooms", order: "room_number" },
  "Current Admissions": { view: "current_admissions", order: "admission_date" },
  "Patient Medical History": { view: "patient_history", order: "record_date", ascending: false },
  "Outstanding Bills": { view: "bill_balance", order: "balance", ascending: false, filter: ["balance", "gt", 0] },
  "Low Medication Stock": { view: "low_medication_stock", order: "quantity_available" },
  "Doctors by Department": { view: "doctors_by_department", order: "department_name" },
  "Prescription Details": { view: "prescription_details", order: "prescription_id" }
};

const state = {
  currentEntityName: null,
  currentRows: [],
  filteredRows: [],
  visibleRows: [],
  selectedRecord: null,
  reportRows: [],
  reportFilteredRows: [],
  sortColumn: null,
  sortDirection: "asc",
  reportSortColumn: null,
  reportSortDirection: "asc",
  currentPage: 1,
  pageSize: 25,
  currentPageType: "dashboard",
  lookupMaps: {},
  user: null,
  profile: null
};

const elements = {
  loading: document.getElementById("loading-screen"),
  shell: document.getElementById("app-shell"),
  sidebar: document.getElementById("sidebar"),
  sidebarOverlay: document.getElementById("sidebar-overlay"),
  navigation: document.getElementById("navigation"),
  pageTitle: document.getElementById("page-title"),
  pageSubtitle: document.getElementById("page-subtitle"),
  dashboardPage: document.getElementById("dashboard-page"),
  entityPage: document.getElementById("entity-page"),
  reportsPage: document.getElementById("reports-page"),
  searchInput: document.getElementById("search-input"),
  filterColumn: document.getElementById("filter-column"),
  filterValueWrap: document.getElementById("filter-value-wrap"),
  filterValue: document.getElementById("filter-value"),
  entityRecordCount: document.getElementById("entity-record-count"),
  pageSize: document.getElementById("page-size"),
  pageStatus: document.getElementById("page-status"),
  previousPage: document.getElementById("previous-page"),
  nextPage: document.getElementById("next-page"),
  entityHead: document.getElementById("entity-head"),
  entityBody: document.getElementById("entity-body"),
  entityEmpty: document.getElementById("entity-empty"),
  reportSelect: document.getElementById("report-select"),
  reportSearch: document.getElementById("report-search"),
  reportRecordCount: document.getElementById("report-record-count"),
  reportHead: document.getElementById("report-head"),
  reportBody: document.getElementById("report-body"),
  reportEmpty: document.getElementById("report-empty"),
  modal: document.getElementById("record-modal"),
  modalTitle: document.getElementById("modal-title"),
  recordForm: document.getElementById("record-form"),
  formFields: document.getElementById("form-fields"),
  deleteButton: document.getElementById("delete-button"),
  saveButton: document.getElementById("save-button"),
  toast: document.getElementById("toast"),
  staffEmail: document.getElementById("staff-email"),
  staffName: document.getElementById("staff-name"),
  staffAvatar: document.getElementById("staff-avatar"),
  themeButton: document.getElementById("theme-button"),
  refreshCurrentButton: document.getElementById("refresh-current-button")
};

function friendlyLabel(value) {
  return value.replaceAll("_", " ").replace(/\b\w/g, letter => letter.toUpperCase());
}

function formatDisplayValue(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed.toLocaleString();
  }
  return String(value);
}

const RELATION_LABELS = {
  patient_id: "Patient",
  doctor_id: "Doctor",
  department_id: "Department",
  manager_doctor_id: "Manager Doctor",
  medication_id: "Medication",
  bill_id: "Bill",
  appointment_id: "Appointment",
  admission_id: "Admission",
  prescription_id: "Prescription"
};

function relationMapKey(column) {
  return column === "manager_doctor_id" ? "doctor_id" : column;
}

function displayColumnLabel(column, primaryKey = null) {
  if (column !== primaryKey && RELATION_LABELS[column]) return RELATION_LABELS[column];
  return friendlyLabel(column);
}

function displayTableValue(row, column, primaryKey = null) {
  const value = row[column];
  if (column !== primaryKey && RELATION_LABELS[column]) {
    const lookup = state.lookupMaps[relationMapKey(column)];
    if (lookup?.has(String(value))) return lookup.get(String(value));
  }
  return formatDisplayValue(value);
}

function mapBy(items, keyField, labelBuilder) {
  return new Map((items || []).map(item => [String(item[keyField]), labelBuilder(item)]));
}

async function loadLookupMaps() {
  const requests = [
    window.dbClient.from("patient").select("patient_id,name"),
    window.dbClient.from("doctor").select("doctor_id,name"),
    window.dbClient.from("department").select("department_id,department_name"),
    window.dbClient.from("medication").select("medication_id,medication_name"),
    window.dbClient.from("bill").select("bill_id,patient_id,total_amount"),
    window.dbClient.from("appointment").select("appointment_id,patient_id,appointment_datetime"),
    window.dbClient.from("admission").select("admission_id,patient_id,admission_date"),
    window.dbClient.from("prescription").select("prescription_id,patient_id,prescription_date")
  ];
  const results = await Promise.all(requests);
  const failed = results.find(result => result.error);
  if (failed) throw failed.error;
  const [patients, doctors, departments, medications, bills, appointments, admissions, prescriptions] = results.map(result => result.data || []);
  const patientMap = mapBy(patients, "patient_id", item => item.name);
  state.lookupMaps = {
    patient_id: patientMap,
    doctor_id: mapBy(doctors, "doctor_id", item => item.name),
    department_id: mapBy(departments, "department_id", item => item.department_name),
    medication_id: mapBy(medications, "medication_id", item => item.medication_name),
    bill_id: mapBy(bills, "bill_id", item => `Bill #${item.bill_id} — ${patientMap.get(String(item.patient_id)) || "Patient"} — ${Number(item.total_amount).toFixed(2)}`),
    appointment_id: mapBy(appointments, "appointment_id", item => `Appointment #${item.appointment_id} — ${patientMap.get(String(item.patient_id)) || "Patient"} — ${formatDisplayValue(item.appointment_datetime)}`),
    admission_id: mapBy(admissions, "admission_id", item => `Admission #${item.admission_id} — ${patientMap.get(String(item.patient_id)) || "Patient"} — ${formatDisplayValue(item.admission_date)}`),
    prescription_id: mapBy(prescriptions, "prescription_id", item => `Prescription #${item.prescription_id} — ${patientMap.get(String(item.patient_id)) || "Patient"} — ${formatDisplayValue(item.prescription_date)}`)
  };
}

function compareValues(first, second) {
  if (first === null || first === undefined || first === "") return 1;
  if (second === null || second === undefined || second === "") return -1;
  const firstNumber = Number(first);
  const secondNumber = Number(second);
  if (!Number.isNaN(firstNumber) && !Number.isNaN(secondNumber)) return firstNumber - secondNumber;
  const firstDate = Date.parse(first);
  const secondDate = Date.parse(second);
  if (!Number.isNaN(firstDate) && !Number.isNaN(secondDate) && String(first).includes("-")) return firstDate - secondDate;
  return String(first).localeCompare(String(second), undefined, { numeric: true, sensitivity: "base" });
}

function statusClass(value) {
  const text = String(value).toLowerCase();
  if (["available", "paid", "completed", "active"].includes(text)) return "status-green";
  if (["scheduled", "partially paid", "maintenance"].includes(text)) return "status-yellow";
  if (["cancelled", "unpaid", "occupied", "inactive"].includes(text)) return "status-red";
  return "status-purple";
}

function isStatusColumn(column) {
  return column.includes("status") || column === "availability";
}

function toggleSort(column, report = false) {
  const columnKey = report ? "reportSortColumn" : "sortColumn";
  const directionKey = report ? "reportSortDirection" : "sortDirection";
  if (state[columnKey] === column) {
    state[directionKey] = state[directionKey] === "asc" ? "desc" : "asc";
  } else {
    state[columnKey] = column;
    state[directionKey] = "asc";
  }
  if (report) filterReportRows();
  else {
    state.currentPage = 1;
    filterEntityRows();
  }
}

function showToast(message, isError = false) {
  elements.toast.textContent = message;
  elements.toast.className = isError ? "toast error" : "toast";
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => elements.toast.classList.add("hidden"), 3500);
}

function showPage(page) {
  state.currentPageType = page;
  elements.dashboardPage.classList.toggle("hidden", page !== "dashboard");
  elements.entityPage.classList.toggle("hidden", page !== "entity");
  elements.reportsPage.classList.toggle("hidden", page !== "reports");
  elements.sidebar.classList.remove("open");
  elements.sidebarOverlay.classList.add("hidden");
}

function setActiveNavigation(key) {
  document.querySelectorAll(".nav-button").forEach(button => {
    button.classList.toggle("active", button.dataset.key === key);
  });
}

function createNavigation() {
  const icons = {
    Dashboard: "DB",
    Departments: "DP",
    Doctors: "DR",
    Patients: "PT",
    Rooms: "RM",
    Appointments: "AP",
    Admissions: "AD",
    "Medical Records": "MR",
    Prescriptions: "PR",
    "Prescription Items": "PI",
    Medications: "MD",
    Bills: "BL",
    Payments: "PY",
    Reports: "RP"
  };
  const items = [
    { key: "dashboard", label: "Dashboard", action: openDashboard },
    ...Object.keys(ENTITIES).map(name => ({ key: `entity-${name}`, label: name, action: () => openEntity(name) })),
    { key: "reports", label: "Reports", action: openReports }
  ];

  elements.navigation.replaceChildren();
  items.forEach(item => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "nav-button";
    button.dataset.key = item.key;
    button.dataset.icon = icons[item.label] || "•";
    button.textContent = item.label;
    button.addEventListener("click", item.action);
    elements.navigation.appendChild(button);
  });
}

function createTable(head, body, rows, options = {}) {
  head.replaceChildren();
  body.replaceChildren();
  if (!rows.length) return [];

  const columns = Object.keys(rows[0]);
  const headRow = document.createElement("tr");
  columns.forEach(column => {
    const cell = document.createElement("th");
    if (options.sortable) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "sortable-header";
      button.textContent = displayColumnLabel(column, options.primaryKey);
      if (options.sortColumn === column) {
        const mark = document.createElement("span");
        mark.className = "sort-mark";
        mark.textContent = options.sortDirection === "asc" ? "↑" : "↓";
        button.appendChild(mark);
      }
      button.addEventListener("click", () => options.onSort(column));
      cell.appendChild(button);
    } else {
      cell.textContent = displayColumnLabel(column, options.primaryKey);
    }
    headRow.appendChild(cell);
  });
  if (options.onRowClick) {
    const actionHead = document.createElement("th");
    actionHead.textContent = "Action";
    headRow.appendChild(actionHead);
  }
  head.appendChild(headRow);

  rows.forEach(row => {
    const tableRow = document.createElement("tr");
    if (options.onRowClick) {
      tableRow.classList.add("selectable");
      tableRow.addEventListener("click", () => options.onRowClick(row));
    }
    columns.forEach(column => {
      const cell = document.createElement("td");
      const displayValue = displayTableValue(row, column, options.primaryKey);
      if (isStatusColumn(column) && displayValue) {
        const badge = document.createElement("span");
        badge.className = `status-badge ${statusClass(displayValue)}`;
        badge.textContent = displayValue;
        cell.appendChild(badge);
      } else {
        cell.textContent = displayValue;
      }
      if (typeof row[column] === "number") cell.classList.add("numeric-cell");
      tableRow.appendChild(cell);
    });
    if (options.onRowClick) {
      const actionCell = document.createElement("td");
      const actionButton = document.createElement("button");
      actionButton.type = "button";
      actionButton.className = "row-action";
      actionButton.textContent = "Edit";
      actionButton.addEventListener("click", event => {
        event.stopPropagation();
        options.onRowClick(row);
      });
      actionCell.appendChild(actionButton);
      tableRow.appendChild(actionCell);
    }
    body.appendChild(tableRow);
  });
  return columns;
}

function createDashboardPanel(title, rows) {
  const panel = document.createElement("div");
  panel.className = "dashboard-panel";
  const headingWrap = document.createElement("div");
  headingWrap.className = "panel-heading";
  const heading = document.createElement("h2");
  heading.textContent = title;
  const count = document.createElement("span");
  count.textContent = `${rows.length} shown`;
  headingWrap.append(heading, count);
  panel.appendChild(headingWrap);
  const scroll = document.createElement("div");
  scroll.className = "table-scroll";
  scroll.style.maxHeight = "360px";
  const table = document.createElement("table");
  const head = document.createElement("thead");
  const body = document.createElement("tbody");
  table.append(head, body);
  scroll.appendChild(table);
  panel.appendChild(scroll);
  createTable(head, body, rows);
  if (!rows.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No records found.";
    panel.appendChild(empty);
  }
  return panel;
}

async function getCount(table, filter = null) {
  let request = window.dbClient.from(table).select("*", { count: "exact", head: true });
  if (filter) request = request.eq(filter.column, filter.value);
  const { count, error } = await request;
  if (error) throw error;
  return count || 0;
}

async function quickCreate(entityName) {
  await openEntity(entityName);
  await openRecordModal();
}

async function openDashboard() {
  setActiveNavigation("dashboard");
  showPage("dashboard");
  elements.pageTitle.textContent = "Hospital Dashboard";
  elements.pageSubtitle.textContent = "Live summary from Supabase";
  elements.dashboardPage.replaceChildren();

  try {
    const [patients, doctors, appointments, rooms, bills, upcomingResult, balancesResult] = await Promise.all([
      getCount("patient"),
      getCount("doctor"),
      getCount("appointment", { column: "status", value: "Scheduled" }),
      getCount("room", { column: "availability_status", value: "Available" }),
      window.dbClient.from("bill_balance").select("bill_id", { count: "exact", head: true }).gt("balance", 0).then(result => {
        if (result.error) throw result.error;
        return result.count || 0;
      }),
      window.dbClient.from("upcoming_appointments").select("*").order("appointment_datetime").limit(8),
      window.dbClient.from("bill_balance").select("*").gt("balance", 0).order("balance", { ascending: false }).limit(8)
    ]);

    if (upcomingResult.error) throw upcomingResult.error;
    if (balancesResult.error) throw balancesResult.error;

    const welcome = document.createElement("div");
    welcome.className = "dashboard-welcome";
    const welcomeText = document.createElement("div");
    const welcomeTitle = document.createElement("h2");
    welcomeTitle.textContent = `Welcome, ${state.profile?.full_name || "Staff"}`;
    const welcomeSubtitle = document.createElement("p");
    welcomeSubtitle.textContent = `Live hospital overview updated ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    welcomeText.append(welcomeTitle, welcomeSubtitle);
    const quickActions = document.createElement("div");
    quickActions.className = "quick-actions";
    [["+ Patient", "Patients"], ["+ Appointment", "Appointments"], ["+ Payment", "Payments"]].forEach(([label, entity]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "button secondary";
      button.textContent = label;
      button.addEventListener("click", () => quickCreate(entity));
      quickActions.appendChild(button);
    });
    welcome.append(welcomeText, quickActions);

    const cards = document.createElement("div");
    cards.className = "dashboard-cards";
    [
      ["Patients", patients, "PT", "Patients"],
      ["Doctors", doctors, "DR", "Doctors"],
      ["Scheduled Appointments", appointments, "AP", "Appointments"],
      ["Available Rooms", rooms, "RM", "Rooms"],
      ["Outstanding Bills", bills, "BL", "Bills"]
    ].forEach(([label, value, icon, entity]) => {
      const card = document.createElement("div");
      card.className = "summary-card";
      card.tabIndex = 0;
      card.role = "button";
      const iconBox = document.createElement("div");
      iconBox.className = "summary-icon";
      iconBox.textContent = icon;
      const text = document.createElement("span");
      text.textContent = label;
      const number = document.createElement("strong");
      number.textContent = value;
      card.append(iconBox, text, number);
      card.addEventListener("click", () => openEntity(entity));
      card.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") openEntity(entity);
      });
      cards.appendChild(card);
    });

    const grid = document.createElement("div");
    grid.className = "dashboard-grid";
    grid.append(
      createDashboardPanel("Upcoming Appointments", upcomingResult.data || []),
      createDashboardPanel("Outstanding Bill Balances", balancesResult.data || [])
    );
    elements.dashboardPage.append(welcome, cards, grid);
  } catch (error) {
    showToast(error.message, true);
  }
}

async function openEntity(name) {
  state.currentEntityName = name;
  state.selectedRecord = null;
  state.sortColumn = null;
  state.sortDirection = "asc";
  state.currentPage = 1;
  elements.searchInput.value = "";
  elements.filterColumn.value = "";
  elements.filterValue.value = "";
  setActiveNavigation(`entity-${name}`);
  showPage("entity");
  elements.pageTitle.textContent = name;
  elements.pageSubtitle.textContent = "Add, search, update, delete, and export records";
  await loadEntityRows();
}

async function loadEntityRows() {
  const config = ENTITIES[state.currentEntityName];
  const { data, error } = await window.dbClient
    .from(config.table)
    .select("*")
    .order(config.pk, { ascending: true })
    .limit(500);

  if (error) {
    showToast(error.message, true);
    return;
  }

  state.currentRows = data || [];
  populateEntityFilters();
  filterEntityRows();
}

function populateEntityFilters() {
  const config = ENTITIES[state.currentEntityName];
  const currentValue = elements.filterColumn.value;
  elements.filterColumn.replaceChildren();
  const allOption = document.createElement("option");
  allOption.value = "";
  allOption.textContent = "All columns";
  elements.filterColumn.appendChild(allOption);
  const columns = state.currentRows.length
    ? Object.keys(state.currentRows[0])
    : [config.pk, ...config.fields.map(item => item.name)];
  columns.forEach(column => {
    const option = document.createElement("option");
    option.value = column;
    option.textContent = displayColumnLabel(column, config.pk);
    elements.filterColumn.appendChild(option);
  });
  elements.filterColumn.value = columns.includes(currentValue) ? currentValue : "";
  updateFilterValueControl();
}

function updateFilterValueControl() {
  const column = elements.filterColumn.value;
  const config = ENTITIES[state.currentEntityName];
  const fieldConfig = config.fields.find(item => item.name === column);
  const previousValue = elements.filterValue.value;
  let control;
  if (fieldConfig?.choices) {
    control = document.createElement("select");
    const all = document.createElement("option");
    all.value = "";
    all.textContent = "All values";
    control.appendChild(all);
    fieldConfig.choices.forEach(choice => {
      const option = document.createElement("option");
      option.value = choice;
      option.textContent = choice;
      control.appendChild(option);
    });
  } else {
    control = document.createElement("input");
    control.type = "search";
    control.placeholder = column ? `Filter ${displayColumnLabel(column, config.pk)}` : "Filter value";
  }
  control.id = "filter-value";
  control.value = previousValue;
  control.disabled = !column;
  control.addEventListener("input", () => {
    state.currentPage = 1;
    filterEntityRows();
  });
  control.addEventListener("change", () => {
    state.currentPage = 1;
    filterEntityRows();
  });
  elements.filterValueWrap.replaceChildren(control);
  elements.filterValue = control;
}

function filterEntityRows() {
  const config = ENTITIES[state.currentEntityName];
  const search = elements.searchInput.value.trim().toLowerCase();
  const filterColumn = elements.filterColumn.value;
  const filterValue = elements.filterValue.value.trim().toLowerCase();
  let rows = search
    ? state.currentRows.filter(row => Object.keys(row).some(column => displayTableValue(row, column, config.pk).toLowerCase().includes(search)))
    : [...state.currentRows];

  if (filterColumn && filterValue) {
    rows = rows.filter(row => displayTableValue(row, filterColumn, config.pk).toLowerCase().includes(filterValue));
  }

  if (state.sortColumn) {
    const direction = state.sortDirection === "asc" ? 1 : -1;
    rows.sort((first, second) => compareValues(displayTableValue(first, state.sortColumn, config.pk), displayTableValue(second, state.sortColumn, config.pk)) * direction);
  }

  state.filteredRows = rows;
  const pageCount = Math.max(1, Math.ceil(rows.length / state.pageSize));
  state.currentPage = Math.min(state.currentPage, pageCount);
  const startIndex = (state.currentPage - 1) * state.pageSize;
  state.visibleRows = rows.slice(startIndex, startIndex + state.pageSize);
  createTable(elements.entityHead, elements.entityBody, state.visibleRows, {
    sortable: true,
    sortColumn: state.sortColumn,
    sortDirection: state.sortDirection,
    primaryKey: config.pk,
    onSort: column => toggleSort(column),
    onRowClick: record => openRecordModal(record)
  });
  elements.entityEmpty.classList.toggle("hidden", state.filteredRows.length > 0);
  elements.entityRecordCount.textContent = `${state.filteredRows.length} ${state.filteredRows.length === 1 ? "record" : "records"}`;
  const firstShown = rows.length ? startIndex + 1 : 0;
  const lastShown = Math.min(startIndex + state.pageSize, rows.length);
  elements.pageStatus.textContent = `${firstShown}–${lastShown} of ${rows.length}`;
  elements.previousPage.disabled = state.currentPage <= 1;
  elements.nextPage.disabled = state.currentPage >= pageCount;
}

function valueForInput(value, type) {
  if (value === null || value === undefined) return "";
  if (type === "datetime-local") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      const offset = parsed.getTimezoneOffset() * 60000;
      return new Date(parsed.getTime() - offset).toISOString().slice(0, 16);
    }
  }
  return String(value);
}

async function createFormControl(fieldConfig, currentValue, editing) {
  let control;
  if (fieldConfig.lookup) {
    control = document.createElement("select");
    const blank = document.createElement("option");
    blank.value = "";
    blank.textContent = fieldConfig.required ? "Select an option" : "None";
    control.appendChild(blank);
    const { data, error } = await window.dbClient
      .from(fieldConfig.lookup.table)
      .select(`${fieldConfig.lookup.valueField},${fieldConfig.lookup.labelField}`)
      .order(fieldConfig.lookup.valueField);
    if (error) throw error;
    (data || []).forEach(item => {
      const option = document.createElement("option");
      option.value = item[fieldConfig.lookup.valueField];
      const mappedLabel = state.lookupMaps[relationMapKey(fieldConfig.name)]?.get(String(item[fieldConfig.lookup.valueField]));
      option.textContent = mappedLabel || formatDisplayValue(item[fieldConfig.lookup.labelField]);
      control.appendChild(option);
    });
  } else if (fieldConfig.choices) {
    control = document.createElement("select");
    const blank = document.createElement("option");
    blank.value = "";
    blank.textContent = "Select an option";
    control.appendChild(blank);
    fieldConfig.choices.forEach(choice => {
      const option = document.createElement("option");
      option.value = choice;
      option.textContent = choice;
      control.appendChild(option);
    });
  } else if (fieldConfig.textarea) {
    control = document.createElement("textarea");
  } else {
    control = document.createElement("input");
    control.type = fieldConfig.type;
    if (fieldConfig.step) control.step = fieldConfig.step;
  }

  control.id = `field-${fieldConfig.name}`;
  control.name = fieldConfig.name;
  control.required = fieldConfig.required;
  control.value = valueForInput(currentValue, fieldConfig.type);
  if (editing && fieldConfig.isPrimaryKey) control.disabled = true;
  return control;
}

async function openRecordModal(record = null) {
  const config = ENTITIES[state.currentEntityName];
  state.selectedRecord = record;
  elements.formFields.replaceChildren();
  elements.modalTitle.textContent = record ? `Edit ${state.currentEntityName}` : `New ${state.currentEntityName}`;
  elements.deleteButton.classList.toggle("hidden", !record);
  elements.saveButton.disabled = true;

  const fields = [...config.fields];
  if (!config.generatedPk && !fields.some(item => item.name === config.pk)) {
    fields.unshift(field(config.pk, friendlyLabel(config.pk), { isPrimaryKey: true }));
  }
  fields.forEach(item => {
    if (item.name === config.pk) item.isPrimaryKey = true;
  });

  try {
    for (const fieldConfig of fields) {
      const wrapper = document.createElement("div");
      wrapper.className = fieldConfig.wide ? "form-field wide" : "form-field";
      const label = document.createElement("label");
      label.htmlFor = `field-${fieldConfig.name}`;
      label.textContent = fieldConfig.required ? fieldConfig.label : `${fieldConfig.label} (optional)`;
      const control = await createFormControl(fieldConfig, record ? record[fieldConfig.name] : "", Boolean(record));
      wrapper.append(label, control);
      elements.formFields.appendChild(wrapper);
    }
    elements.saveButton.disabled = false;
    elements.modal.classList.remove("hidden");
  } catch (error) {
    showToast(error.message, true);
  }
}

function closeRecordModal() {
  state.selectedRecord = null;
  elements.modal.classList.add("hidden");
  elements.recordForm.reset();
}

function readFormPayload() {
  const config = ENTITIES[state.currentEntityName];
  const fields = [...config.fields];
  const payload = {};

  fields.forEach(fieldConfig => {
    const control = document.getElementById(`field-${fieldConfig.name}`);
    if (!control || control.disabled) return;
    const raw = control.value.trim();
    if (raw === "") {
      payload[fieldConfig.name] = null;
    } else if (fieldConfig.type === "number") {
      payload[fieldConfig.name] = Number(raw);
    } else if (fieldConfig.type === "datetime-local") {
      payload[fieldConfig.name] = new Date(raw).toISOString();
    } else {
      payload[fieldConfig.name] = raw;
    }
  });

  if (!config.generatedPk && !state.selectedRecord) {
    const pkControl = document.getElementById(`field-${config.pk}`);
    if (pkControl) payload[config.pk] = pkControl.value.trim();
  }
  return payload;
}

function validateEntityPayload(payload) {
  if (state.currentEntityName === "Bills") {
    const sourceCount = [payload.appointment_id, payload.admission_id, payload.prescription_id].filter(value => value !== null).length;
    if (sourceCount !== 1) return "Enter exactly one appointment, admission, or prescription source.";
  }
  return null;
}

async function saveRecord(event) {
  event.preventDefault();
  const config = ENTITIES[state.currentEntityName];
  const payload = readFormPayload();
  const validationError = validateEntityPayload(payload);
  if (validationError) {
    showToast(validationError, true);
    return;
  }

  elements.saveButton.disabled = true;
  let request;
  if (state.selectedRecord) {
    request = window.dbClient
      .from(config.table)
      .update(payload)
      .eq(config.pk, state.selectedRecord[config.pk]);
  } else {
    request = window.dbClient.from(config.table).insert(payload);
  }

  const { error } = await request;
  elements.saveButton.disabled = false;
  if (error) {
    showToast(error.message, true);
    return;
  }

  showToast(state.selectedRecord ? "Record updated." : "Record added.");
  closeRecordModal();
  await loadLookupMaps();
  await loadEntityRows();
}

async function deleteRecord() {
  if (!state.selectedRecord) return;
  if (!window.confirm("Delete this record? This cannot be undone.")) return;
  const config = ENTITIES[state.currentEntityName];
  const { error } = await window.dbClient
    .from(config.table)
    .delete()
    .eq(config.pk, state.selectedRecord[config.pk]);

  if (error) {
    showToast(error.message, true);
    return;
  }

  showToast("Record deleted.");
  closeRecordModal();
  await loadLookupMaps();
  await loadEntityRows();
}

function csvValue(value) {
  const text = formatDisplayValue(value).replaceAll('"', '""');
  return `"${text}"`;
}

function downloadCsv(rows, filename, primaryKey = null) {
  if (!rows.length) {
    showToast("There are no rows to export.", true);
    return;
  }
  const columns = Object.keys(rows[0]);
  const lines = [columns.map(column => csvValue(displayColumnLabel(column, primaryKey))).join(",")];
  rows.forEach(row => lines.push(columns.map(column => csvValue(displayTableValue(row, column, primaryKey))).join(",")));
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function openReports() {
  state.reportSortColumn = null;
  state.reportSortDirection = "asc";
  elements.reportSearch.value = "";
  setActiveNavigation("reports");
  showPage("reports");
  elements.pageTitle.textContent = "Hospital Reports";
  elements.pageSubtitle.textContent = "Prepared joined and filtered database reports";
  if (!elements.reportSelect.options.length) {
    Object.keys(REPORTS).forEach(name => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      elements.reportSelect.appendChild(option);
    });
  }
  await runReport();
}

async function runReport() {
  const name = elements.reportSelect.value || Object.keys(REPORTS)[0];
  const config = REPORTS[name];
  let request = window.dbClient.from(config.view).select("*");
  if (config.filter) request = request[config.filter[1]](config.filter[0], config.filter[2]);
  if (config.order) request = request.order(config.order, { ascending: config.ascending !== false });
  const { data, error } = await request.limit(500);
  if (error) {
    showToast(error.message, true);
    return;
  }
  state.reportRows = data || [];
  filterReportRows();
}

function filterReportRows() {
  const search = elements.reportSearch.value.trim().toLowerCase();
  let rows = search
    ? state.reportRows.filter(row => Object.keys(row).some(column => displayTableValue(row, column).toLowerCase().includes(search)))
    : [...state.reportRows];
  if (state.reportSortColumn) {
    const direction = state.reportSortDirection === "asc" ? 1 : -1;
    rows.sort((first, second) => compareValues(displayTableValue(first, state.reportSortColumn), displayTableValue(second, state.reportSortColumn)) * direction);
  }
  state.reportFilteredRows = rows;
  createTable(elements.reportHead, elements.reportBody, rows, {
    sortable: true,
    sortColumn: state.reportSortColumn,
    sortDirection: state.reportSortDirection,
    onSort: column => toggleSort(column, true)
  });
  elements.reportEmpty.classList.toggle("hidden", rows.length > 0);
  elements.reportRecordCount.textContent = `${rows.length} ${rows.length === 1 ? "result" : "results"}`;
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem("hospital-theme", theme);
  elements.themeButton.textContent = theme === "dark" ? "☀" : "◐";
  elements.themeButton.title = theme === "dark" ? "Use light theme" : "Use dark theme";
}

async function refreshCurrentPage() {
  elements.refreshCurrentButton.disabled = true;
  await loadLookupMaps();
  if (state.currentPageType === "dashboard") await openDashboard();
  if (state.currentPageType === "entity") await loadEntityRows();
  if (state.currentPageType === "reports") await runReport();
  elements.refreshCurrentButton.disabled = false;
  showToast("Data refreshed.");
}

async function initializeApp() {
  if (!window.configReady) {
    window.sessionStorage.setItem("loginError", "Open js/config.js and enter your Supabase project details.");
    window.location.replace("index.html");
    return;
  }

  const { data, error } = await window.dbClient.auth.getUser();
  if (error || !data.user) {
    window.location.replace("index.html");
    return;
  }

  state.user = data.user;
  const profileResult = await window.dbClient
    .from("staff_profiles")
    .select("full_name,role,is_active")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (profileResult.error || !profileResult.data || !profileResult.data.is_active) {
    await window.dbClient.auth.signOut();
    window.sessionStorage.setItem("loginError", "Your account is not approved as active hospital staff.");
    window.location.replace("index.html");
    return;
  }

  state.profile = profileResult.data;
  await loadLookupMaps();
  elements.staffEmail.textContent = data.user.email;
  elements.staffName.textContent = profileResult.data.full_name;
  elements.staffAvatar.textContent = profileResult.data.full_name.trim().charAt(0).toUpperCase() || "S";
  createNavigation();
  elements.loading.classList.add("hidden");
  elements.shell.classList.remove("hidden");
  await openDashboard();
}

document.getElementById("menu-button").addEventListener("click", () => {
  elements.sidebar.classList.toggle("open");
  elements.sidebarOverlay.classList.toggle("hidden", !elements.sidebar.classList.contains("open"));
});
elements.sidebarOverlay.addEventListener("click", () => {
  elements.sidebar.classList.remove("open");
  elements.sidebarOverlay.classList.add("hidden");
});
document.getElementById("logout-button").addEventListener("click", async () => {
  await window.dbClient.auth.signOut();
  window.location.replace("index.html");
});
document.getElementById("new-record-button").addEventListener("click", () => openRecordModal());
document.getElementById("clear-search-button").addEventListener("click", () => {
  elements.searchInput.value = "";
  elements.filterColumn.value = "";
  updateFilterValueControl();
  elements.filterValue.value = "";
  state.sortColumn = null;
  state.currentPage = 1;
  filterEntityRows();
});
elements.searchInput.addEventListener("input", () => {
  state.currentPage = 1;
  filterEntityRows();
});
elements.filterColumn.addEventListener("change", () => {
  state.currentPage = 1;
  updateFilterValueControl();
  filterEntityRows();
});
elements.pageSize.addEventListener("change", () => {
  state.pageSize = Number(elements.pageSize.value);
  state.currentPage = 1;
  filterEntityRows();
});
elements.previousPage.addEventListener("click", () => {
  state.currentPage = Math.max(1, state.currentPage - 1);
  filterEntityRows();
});
elements.nextPage.addEventListener("click", () => {
  state.currentPage += 1;
  filterEntityRows();
});
document.getElementById("export-button").addEventListener("click", () => {
  const config = ENTITIES[state.currentEntityName];
  const filename = `${config.table}.csv`;
  downloadCsv(state.filteredRows, filename, config.pk);
});
document.getElementById("run-report-button").addEventListener("click", runReport);
elements.reportSelect.addEventListener("change", runReport);
elements.reportSearch.addEventListener("input", filterReportRows);
document.getElementById("export-report-button").addEventListener("click", () => {
  const filename = `${elements.reportSelect.value.toLowerCase().replaceAll(" ", "_")}.csv`;
  downloadCsv(state.reportFilteredRows, filename);
});
document.getElementById("close-modal-button").addEventListener("click", closeRecordModal);
document.getElementById("cancel-button").addEventListener("click", closeRecordModal);
elements.recordForm.addEventListener("submit", saveRecord);
elements.deleteButton.addEventListener("click", deleteRecord);
elements.modal.addEventListener("click", event => {
  if (event.target === elements.modal) closeRecordModal();
});
window.addEventListener("keydown", event => {
  if (event.key === "Escape" && !elements.modal.classList.contains("hidden")) closeRecordModal();
});
window.dbClient?.auth.onAuthStateChange(event => {
  if (event === "SIGNED_OUT") window.location.replace("index.html");
});

elements.themeButton.addEventListener("click", () => {
  const current = document.documentElement.dataset.theme || "light";
  applyTheme(current === "dark" ? "light" : "dark");
});
elements.refreshCurrentButton.addEventListener("click", refreshCurrentPage);

applyTheme(window.localStorage.getItem("hospital-theme") || "light");

initializeApp();
