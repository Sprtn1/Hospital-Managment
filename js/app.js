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
  selectedRecord: null,
  reportRows: [],
  user: null,
  profile: null
};

const elements = {
  loading: document.getElementById("loading-screen"),
  shell: document.getElementById("app-shell"),
  sidebar: document.getElementById("sidebar"),
  navigation: document.getElementById("navigation"),
  pageTitle: document.getElementById("page-title"),
  pageSubtitle: document.getElementById("page-subtitle"),
  dashboardPage: document.getElementById("dashboard-page"),
  entityPage: document.getElementById("entity-page"),
  reportsPage: document.getElementById("reports-page"),
  searchInput: document.getElementById("search-input"),
  entityHead: document.getElementById("entity-head"),
  entityBody: document.getElementById("entity-body"),
  entityEmpty: document.getElementById("entity-empty"),
  reportSelect: document.getElementById("report-select"),
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
  staffEmail: document.getElementById("staff-email")
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

function showToast(message, isError = false) {
  elements.toast.textContent = message;
  elements.toast.className = isError ? "toast error" : "toast";
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => elements.toast.classList.add("hidden"), 3500);
}

function showPage(page) {
  elements.dashboardPage.classList.toggle("hidden", page !== "dashboard");
  elements.entityPage.classList.toggle("hidden", page !== "entity");
  elements.reportsPage.classList.toggle("hidden", page !== "reports");
  elements.sidebar.classList.remove("open");
}

function setActiveNavigation(key) {
  document.querySelectorAll(".nav-button").forEach(button => {
    button.classList.toggle("active", button.dataset.key === key);
  });
}

function createNavigation() {
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
    button.textContent = item.label;
    button.addEventListener("click", item.action);
    elements.navigation.appendChild(button);
  });
}

function createTable(head, body, rows, onRowClick = null) {
  head.replaceChildren();
  body.replaceChildren();
  if (!rows.length) return [];

  const columns = Object.keys(rows[0]);
  const headRow = document.createElement("tr");
  columns.forEach(column => {
    const cell = document.createElement("th");
    cell.textContent = friendlyLabel(column);
    headRow.appendChild(cell);
  });
  head.appendChild(headRow);

  rows.forEach(row => {
    const tableRow = document.createElement("tr");
    if (onRowClick) {
      tableRow.classList.add("selectable");
      tableRow.addEventListener("click", () => onRowClick(row));
    }
    columns.forEach(column => {
      const cell = document.createElement("td");
      cell.textContent = formatDisplayValue(row[column]);
      tableRow.appendChild(cell);
    });
    body.appendChild(tableRow);
  });
  return columns;
}

function createDashboardPanel(title, rows) {
  const panel = document.createElement("div");
  panel.className = "dashboard-panel";
  const heading = document.createElement("h2");
  heading.textContent = title;
  panel.appendChild(heading);
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

    const cards = document.createElement("div");
    cards.className = "dashboard-cards";
    [
      ["Patients", patients],
      ["Doctors", doctors],
      ["Scheduled Appointments", appointments],
      ["Available Rooms", rooms],
      ["Outstanding Bills", bills]
    ].forEach(([label, value]) => {
      const card = document.createElement("div");
      card.className = "summary-card";
      const text = document.createElement("span");
      text.textContent = label;
      const number = document.createElement("strong");
      number.textContent = value;
      card.append(text, number);
      cards.appendChild(card);
    });

    const grid = document.createElement("div");
    grid.className = "dashboard-grid";
    grid.append(
      createDashboardPanel("Upcoming Appointments", upcomingResult.data || []),
      createDashboardPanel("Outstanding Bill Balances", balancesResult.data || [])
    );
    elements.dashboardPage.append(cards, grid);
  } catch (error) {
    showToast(error.message, true);
  }
}

async function openEntity(name) {
  state.currentEntityName = name;
  state.selectedRecord = null;
  elements.searchInput.value = "";
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
  filterEntityRows();
}

function filterEntityRows() {
  const search = elements.searchInput.value.trim().toLowerCase();
  state.filteredRows = search
    ? state.currentRows.filter(row => Object.values(row).some(value => formatDisplayValue(value).toLowerCase().includes(search)))
    : [...state.currentRows];
  createTable(elements.entityHead, elements.entityBody, state.filteredRows, record => openRecordModal(record));
  elements.entityEmpty.classList.toggle("hidden", state.filteredRows.length > 0);
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
      option.textContent = `${item[fieldConfig.lookup.valueField]} - ${formatDisplayValue(item[fieldConfig.lookup.labelField])}`;
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
  await loadEntityRows();
}

function csvValue(value) {
  const text = formatDisplayValue(value).replaceAll('"', '""');
  return `"${text}"`;
}

function downloadCsv(rows, filename) {
  if (!rows.length) {
    showToast("There are no rows to export.", true);
    return;
  }
  const columns = Object.keys(rows[0]);
  const lines = [columns.map(csvValue).join(",")];
  rows.forEach(row => lines.push(columns.map(column => csvValue(row[column])).join(",")));
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
  createTable(elements.reportHead, elements.reportBody, state.reportRows);
  elements.reportEmpty.classList.toggle("hidden", state.reportRows.length > 0);
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
  elements.staffEmail.textContent = data.user.email;
  createNavigation();
  elements.loading.classList.add("hidden");
  elements.shell.classList.remove("hidden");
  await openDashboard();
}

document.getElementById("menu-button").addEventListener("click", () => elements.sidebar.classList.toggle("open"));
document.getElementById("logout-button").addEventListener("click", async () => {
  await window.dbClient.auth.signOut();
  window.location.replace("index.html");
});
document.getElementById("new-record-button").addEventListener("click", () => openRecordModal());
document.getElementById("clear-search-button").addEventListener("click", () => {
  elements.searchInput.value = "";
  filterEntityRows();
});
elements.searchInput.addEventListener("input", filterEntityRows);
document.getElementById("export-button").addEventListener("click", () => {
  const filename = `${ENTITIES[state.currentEntityName].table}.csv`;
  downloadCsv(state.filteredRows, filename);
});
document.getElementById("run-report-button").addEventListener("click", runReport);
document.getElementById("export-report-button").addEventListener("click", () => {
  const filename = `${elements.reportSelect.value.toLowerCase().replaceAll(" ", "_")}.csv`;
  downloadCsv(state.reportRows, filename);
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

initializeApp();
