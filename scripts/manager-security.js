/* =========================================================
   RAFARA GATEPASS — ESTATE MANAGER · SECURITY
   Frontend demo logic
   ========================================================= */

(function () {
  "use strict";

  window.RafaraSecurity = window.RafaraSecurity || {};

  /* =======================================================
     MOCK DATA
     ======================================================= */

  window.RafaraSecurity.DATA = {

    overview: {
      total: 18,
      onDuty: 12,
      offDuty: 5,
      online: 10
    },

    shift: {
      name: "Morning Shift",
      time: "06:00 AM – 02:00 PM",
      status: "Active",
      onDuty: 12,
      total: 18
    },

    officers: [
      {
        id: "SEC-0018",
        name: "Abdulrahman Musa",
        phone: "0803 214 7765",
        role: "Security Officer",
        dateAdded: "Jan 14, 2025",
        verification: "Verified",
        status: "On Duty",
        online: true,
        shift: "Morning",
        assignment: "Main Gate",
        scans: 24,
        lastActive: "2 mins ago",
        lastActiveMinutes: 2,
        todayActivity: {
          scans: 24,
          visitorsVerified: 8,
          passesDenied: 3,
          passesApproved: 16
        },
        timeline: [
          { time: "08:42 AM", label: "Visitor pass verified" },
          { time: "08:31 AM", label: "Visitor denied access" },
          { time: "08:14 AM", label: "Visitor checked in" },
          { time: "07:58 AM", label: "Security shift started" }
        ]
      },
      {
        id: "SEC-0017",
        name: "Tunde Adeyemi",
        phone: "0812 556 3390",
        role: "Security Officer",
        dateAdded: "Feb 02, 2025",
        verification: "Verified",
        status: "On Duty",
        online: false,
        shift: "Morning",
        assignment: "Back Gate",
        scans: 18,
        lastActive: "5 mins ago",
        lastActiveMinutes: 18,
        todayActivity: {
          scans: 18,
          visitorsVerified: 6,
          passesDenied: 1,
          passesApproved: 13
        },
        timeline: [
          { time: "08:31 AM", label: "Visitor pass denied" },
          { time: "08:05 AM", label: "Visitor checked in" },
          { time: "07:58 AM", label: "Security shift started" }
        ]
      },
      {
        id: "SEC-0016",
        name: "Ibrahim Sani",
        phone: "0705 981 2246",
        role: "Security Officer",
        dateAdded: "Nov 21, 2024",
        verification: "Verified",
        status: "Off Duty",
        online: false,
        shift: "Night",
        assignment: "Estate Patrol",
        scans: 0,
        lastActive: "Yesterday",
        lastActiveMinutes: 1440,
        todayActivity: {
          scans: 0,
          visitorsVerified: 0,
          passesDenied: 0,
          passesApproved: 0
        },
        timeline: [
          { time: "Yesterday, 10:58 PM", label: "Security shift ended" },
          { time: "Yesterday, 6:02 PM", label: "Patrol round completed" }
        ]
      },
      {
        id: "SEC-0015",
        name: "Chinedu Okafor",
        phone: "0906 447 8821",
        role: "Senior Security Officer",
        dateAdded: "Aug 09, 2024",
        verification: "Verified",
        status: "On Duty",
        online: true,
        shift: "Morning",
        assignment: "Control Room",
        scans: 31,
        lastActive: "1 min ago",
        lastActiveMinutes: 1,
        todayActivity: {
          scans: 31,
          visitorsVerified: 11,
          passesDenied: 2,
          passesApproved: 22
        },
        timeline: [
          { time: "08:40 AM", label: "Checked in at Control Room" },
          { time: "08:20 AM", label: "Visitor pass verified" },
          { time: "07:58 AM", label: "Security shift started" }
        ]
      },
      {
        id: "SEC-0014",
        name: "Emeka Nwosu",
        phone: "0813 209 4471",
        role: "Security Officer",
        dateAdded: "Mar 18, 2025",
        verification: "Verified",
        status: "On Duty",
        online: true,
        shift: "Morning",
        assignment: "Visitor Verification",
        scans: 15,
        lastActive: "6 mins ago",
        lastActiveMinutes: 6,
        todayActivity: {
          scans: 15,
          visitorsVerified: 9,
          passesDenied: 0,
          passesApproved: 15
        },
        timeline: [
          { time: "08:36 AM", label: "Visitor pass verified" },
          { time: "07:58 AM", label: "Security shift started" }
        ]
      },
      {
        id: "SEC-0013",
        name: "Aisha Bello",
        phone: "0701 332 6698",
        role: "Security Officer",
        dateAdded: "May 04, 2025",
        verification: "Verified",
        status: "Off Duty",
        online: false,
        shift: "Afternoon",
        assignment: "Main Gate",
        scans: 0,
        lastActive: "3 hrs ago",
        lastActiveMinutes: 180,
        todayActivity: {
          scans: 0,
          visitorsVerified: 0,
          passesDenied: 0,
          passesApproved: 0
        },
        timeline: [
          { time: "Yesterday, 2:04 PM", label: "Security shift ended" }
        ]
      },
      {
        id: "SEC-0012",
        name: "Femi Ogunleye",
        phone: "0909 116 5502",
        role: "Security Supervisor",
        dateAdded: "Jul 22, 2024",
        verification: "Verified",
        status: "On Duty",
        online: true,
        shift: "Morning",
        assignment: "",
        scans: 9,
        lastActive: "14 mins ago",
        lastActiveMinutes: 14,
        todayActivity: {
          scans: 9,
          visitorsVerified: 4,
          passesDenied: 0,
          passesApproved: 9
        },
        timeline: [
          { time: "08:10 AM", label: "Visitor pass verified" },
          { time: "07:58 AM", label: "Security shift started" }
        ]
      },
      {
        id: "SEC-0011",
        name: "Grace Etim",
        phone: "0816 774 2013",
        role: "Security Officer",
        dateAdded: "Sep 30, 2024",
        verification: "Verified",
        status: "Suspended",
        online: false,
        shift: "Night",
        assignment: "Gate Support",
        scans: 0,
        lastActive: "4 days ago",
        lastActiveMinutes: 5760,
        todayActivity: {
          scans: 0,
          visitorsVerified: 0,
          passesDenied: 0,
          passesApproved: 0
        },
        timeline: [
          { time: "4 days ago", label: "Account suspended by manager" }
        ]
      },
      {
        id: "SEC-0010",
        name: "Yakubu Danladi",
        phone: "0704 558 9021",
        role: "Security Officer",
        dateAdded: "Jan 02, 2025",
        verification: "Verified",
        status: "On Duty",
        online: true,
        shift: "Morning",
        assignment: "Estate Patrol",
        scans: 6,
        lastActive: "20 mins ago",
        lastActiveMinutes: 20,
        todayActivity: {
          scans: 6,
          visitorsVerified: 2,
          passesDenied: 0,
          passesApproved: 6
        },
        timeline: [
          { time: "08:00 AM", label: "Patrol round started" },
          { time: "07:58 AM", label: "Security shift started" }
        ]
      },
      {
        id: "SEC-0009",
        name: "Blessing Okoro",
        phone: "0813 660 4487",
        role: "Security Officer",
        dateAdded: "Apr 11, 2025",
        verification: "Verified",
        status: "Off Duty",
        online: false,
        shift: "Afternoon",
        assignment: "Back Gate",
        scans: 0,
        lastActive: "Yesterday",
        lastActiveMinutes: 1500,
        todayActivity: {
          scans: 0,
          visitorsVerified: 0,
          passesDenied: 0,
          passesApproved: 0
        },
        timeline: [
          { time: "Yesterday, 3:12 PM", label: "Security shift ended" }
        ]
      },
      {
        id: "SEC-0008",
        name: "Musa Garba",
        phone: "0708 221 9034",
        role: "Security Officer",
        dateAdded: "Jun 06, 2024",
        verification: "Verified",
        status: "On Duty",
        online: true,
        shift: "Morning",
        assignment: "Control Room",
        scans: 12,
        lastActive: "9 mins ago",
        lastActiveMinutes: 9,
        todayActivity: {
          scans: 12,
          visitorsVerified: 5,
          passesDenied: 1,
          passesApproved: 11
        },
        timeline: [
          { time: "08:25 AM", label: "Visitor pass verified" },
          { time: "07:58 AM", label: "Security shift started" }
        ]
      },
      {
        id: "SEC-0007",
        name: "Chidinma Eze",
        phone: "0902 331 7745",
        role: "Security Officer",
        dateAdded: "Oct 15, 2024",
        verification: "Verified",
        status: "On Duty",
        online: false,
        shift: "Morning",
        assignment: "Visitor Verification",
        scans: 10,
        lastActive: "27 mins ago",
        lastActiveMinutes: 27,
        todayActivity: {
          scans: 10,
          visitorsVerified: 7,
          passesDenied: 0,
          passesApproved: 10
        },
        timeline: [
          { time: "08:03 AM", label: "Visitor pass verified" },
          { time: "07:58 AM", label: "Security shift started" }
        ]
      },
      {
        id: "SEC-0006",
        name: "Suleiman Bako",
        phone: "0810 447 2298",
        role: "Security Officer",
        dateAdded: "Dec 19, 2024",
        verification: "Verified",
        status: "Off Duty",
        online: false,
        shift: "Night",
        assignment: "",
        scans: 0,
        lastActive: "2 days ago",
        lastActiveMinutes: 2880,
        todayActivity: {
          scans: 0,
          visitorsVerified: 0,
          passesDenied: 0,
          passesApproved: 0
        },
        timeline: [
          { time: "2 days ago", label: "Security shift ended" }
        ]
      },
      {
        id: "SEC-0005",
        name: "Ngozi Chukwu",
        phone: "0705 118 8834",
        role: "Security Officer",
        dateAdded: "Feb 27, 2025",
        verification: "Verified",
        status: "On Duty",
        online: true,
        shift: "Morning",
        assignment: "Main Gate",
        scans: 20,
        lastActive: "4 mins ago",
        lastActiveMinutes: 4,
        todayActivity: {
          scans: 20,
          visitorsVerified: 8,
          passesDenied: 2,
          passesApproved: 18
        },
        timeline: [
          { time: "08:38 AM", label: "Visitor pass verified" },
          { time: "07:58 AM", label: "Security shift started" }
        ]
      },
      {
        id: "SEC-0004",
        name: "Ahmed Lawal",
        phone: "0813 992 5561",
        role: "Security Officer",
        dateAdded: "May 30, 2024",
        verification: "Verified",
        status: "Suspended",
        online: false,
        shift: "Afternoon",
        assignment: "Back Gate",
        scans: 0,
        lastActive: "9 days ago",
        lastActiveMinutes: 12960,
        todayActivity: {
          scans: 0,
          visitorsVerified: 0,
          passesDenied: 0,
          passesApproved: 0
        },
        timeline: [
          { time: "9 days ago", label: "Account suspended by manager" }
        ]
      },
      {
        id: "SEC-0003",
        name: "Funke Adebayo",
        phone: "0902 665 3312",
        role: "Security Officer",
        dateAdded: "Jan 29, 2025",
        verification: "Verified",
        status: "On Duty",
        online: true,
        shift: "Morning",
        assignment: "Estate Patrol",
        scans: 7,
        lastActive: "11 mins ago",
        lastActiveMinutes: 11,
        todayActivity: {
          scans: 7,
          visitorsVerified: 3,
          passesDenied: 0,
          passesApproved: 7
        },
        timeline: [
          { time: "08:12 AM", label: "Patrol round completed" },
          { time: "07:58 AM", label: "Security shift started" }
        ]
      },
      {
        id: "SEC-0002",
        name: "Segun Alabi",
        phone: "0803 774 1183",
        role: "Security Officer",
        dateAdded: "Aug 17, 2024",
        verification: "Verified",
        status: "Off Duty",
        online: false,
        shift: "Night",
        assignment: "Control Room",
        scans: 0,
        lastActive: "5 hrs ago",
        lastActiveMinutes: 300,
        todayActivity: {
          scans: 0,
          visitorsVerified: 0,
          passesDenied: 0,
          passesApproved: 0
        },
        timeline: [
          { time: "Yesterday, 10:00 PM", label: "Security shift ended" }
        ]
      },
      {
        id: "SEC-0001",
        name: "Patience Umeh",
        phone: "0706 883 0027",
        role: "Security Officer",
        dateAdded: "Mar 03, 2024",
        verification: "Verified",
        status: "On Duty",
        online: true,
        shift: "Morning",
        assignment: "Gate Support",
        scans: 5,
        lastActive: "16 mins ago",
        lastActiveMinutes: 16,
        todayActivity: {
          scans: 5,
          visitorsVerified: 2,
          passesDenied: 0,
          passesApproved: 5
        },
        timeline: [
          { time: "08:05 AM", label: "Visitor pass verified" },
          { time: "07:58 AM", label: "Security shift started" }
        ]
      }
    ],

    secActivity: [
      {
        icon: "fa-id-card-clip",
        officer: "Abdulrahman Musa",
        action: "verified a visitor pass",
        location: "Main Gate",
        time: "08:42 AM"
      },
      {
        icon: "fa-ban",
        iconVariant: "denied",
        officer: "Tunde Adeyemi",
        action: "denied a visitor pass",
        location: "Back Gate",
        time: "08:31 AM"
      },
      {
        icon: "fa-right-to-bracket",
        officer: "Chinedu Okafor",
        action: "checked in",
        location: "Control Room",
        time: "08:14 AM"
      },
      {
        icon: "fa-clock",
        officer: "Ibrahim Sani",
        action: "ended his shift",
        location: "Estate Patrol",
        time: "07:58 AM"
      }
    ],

    alerts: [
      {
        icon: "fa-user-clock",
        title: "Officer Offline",
        desc: "Tunde Adeyemi has been offline for 18 minutes.",
        cta: "View Officer",
        action: "view-officer",
        target: "SEC-0017"
      },
      {
        icon: "fa-location-dot",
        muted: true,
        title: "Unassigned Officer",
        desc: "2 security officers are currently not assigned to a location.",
        cta: "Assign",
        action: "filter-unassigned"
      },
      {
        icon: "fa-hourglass-half",
        title: "Shift Ending",
        desc: "3 security officers are approaching the end of their current shift.",
        cta: "View Shift",
        action: "view-shift"
      }
    ],

    notifications: [
      {
        icon: "fa-user-clock",
        title: "Officer offline",
        desc: "Tunde Adeyemi has been offline for 18 minutes.",
        time: "18m ago",
        unread: true
      },
      {
        icon: "fa-shield-halved",
        title: "New officer added",
        desc: "Patience Umeh was added to the security team.",
        time: "2h ago",
        unread: true
      }
    ]
  };

})();


/* =========================================================
   STATE
   ========================================================= */

(function () {

  "use strict";

  window.RafaraSecurity.state = {
    search: "",
    status: "all",
    availability: "all",
    shift: "all",
    assignment: "all",
    page: 1,
    pageSize: 10,
    activeOfficerId: null
  };

})();


/* =========================================================
   HELPERS
   ======================================================= */

(function () {

  "use strict";

  const NS = window.RafaraSecurity;

  NS.helpers = {

    initials(name) {
      return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word[0].toUpperCase())
        .join("");
    },

    findOfficer(id) {
      return NS.DATA.officers.find(officer => officer.id === id) || null;
    },

    statusBadgeClass(status) {
      if (status === "On Duty") return "badge--onduty";
      if (status === "Off Duty") return "badge--offduty";
      if (status === "Suspended") return "badge--suspended";
      return "badge--offduty";
    },

    statusBadgeHTML(status) {
      const cls = NS.helpers.statusBadgeClass(status);
      const icon =
        status === "On Duty"
          ? "fa-circle-check"
          : status === "Suspended"
          ? "fa-ban"
          : "fa-circle-minus";

      return `
        <span class="badge ${cls}">
          <i class="fa-solid ${icon}" aria-hidden="true"></i>
          ${status}
        </span>
      `;
    },

    presenceHTML(online) {
      return `
        <span class="presence${online ? " presence--online" : ""}">
          <span class="presence-dot"></span>
          ${online ? "Online" : "Offline"}
        </span>
      `;
    },

    escapeHTML(str) {
      const div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    }

  };

})();


/* =========================================================
   RENDERING
   ======================================================= */

(function () {

  "use strict";

  const NS = window.RafaraSecurity;
  const DATA = NS.DATA;
  const helpers = NS.helpers;


  /* -------- STATS -------- */

  function renderStats() {

    const grid = document.getElementById("stats-grid");
    if (!grid) return;

    const cards = [
      {
        icon: "fa-users",
        iconClass: "stat-icon--passes",
        value: DATA.overview.total,
        label: "Total Security Staff",
        context: "Registered security personnel"
      },
      {
        icon: "fa-shield-halved",
        iconClass: "stat-icon--inside",
        value: DATA.overview.onDuty,
        label: "On Duty",
        context: "Currently assigned to duty",
        pulse: true
      },
      {
        icon: "fa-circle-minus",
        iconClass: "stat-icon--pending",
        value: DATA.overview.offDuty,
        label: "Off Duty",
        context: "Currently unavailable"
      },
      {
        icon: "fa-signal",
        iconClass: "stat-icon--upcoming",
        value: DATA.overview.online,
        label: "Online",
        context: "Connected to Rafara",
        pulse: true
      }
    ];

    grid.innerHTML = cards.map(card => `
      <article class="stat-card">
        <span class="stat-icon ${card.iconClass}">
          <i class="fa-solid ${card.icon}" aria-hidden="true"></i>
        </span>
        <div class="stat-body">
          <span class="stat-number">${card.value}</span>
          <span class="stat-label">${card.label}</span>
          <span class="stat-context">${card.context}</span>
        </div>
        ${card.pulse ? `<span class="stat-pulse">Live</span>` : ""}
      </article>
    `).join("");
  }


  /* -------- OPERATIONS PANEL -------- */

  function renderOpsPanel() {

    const wrap = document.getElementById("ops-panel");
    if (!wrap) return;

    const pct = Math.round((DATA.shift.onDuty / DATA.shift.total) * 100);

    wrap.innerHTML = `
      <div class="ops-panel-info">
        <span class="ops-panel-eyebrow">
          <i class="fa-solid fa-tower-observation" aria-hidden="true"></i>
          Security Operations
        </span>
        <div class="ops-shift-name">${DATA.shift.name}</div>
        <div class="ops-shift-time">${DATA.shift.time}</div>
        <span class="badge badge--active" style="margin-top:9px;">
          <i class="fa-solid fa-circle" aria-hidden="true"></i>
          ${DATA.shift.status}
        </span>
      </div>

      <div class="ops-panel-progress">
        <div class="ops-progress-label">
          <span>${DATA.shift.onDuty} / ${DATA.shift.total} officers on duty</span>
          <span>${pct}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${pct}%;"></div>
        </div>
      </div>

      <div class="ops-panel-actions">
        <button type="button" class="btn btn--primary" id="ops-assign-btn">
          <i class="fa-solid fa-user-plus" aria-hidden="true"></i> Assign Security
        </button>
        <button type="button" class="btn btn--secondary" id="ops-manage-shifts-btn">
          Manage Shifts
        </button>
      </div>
    `;

    const assignBtn = document.getElementById("ops-assign-btn");
    if (assignBtn) {
      assignBtn.addEventListener("click", () => {
        document.getElementById("add-security-btn").click();
      });
    }

    const shiftsBtn = document.getElementById("ops-manage-shifts-btn");
    if (shiftsBtn) {
      shiftsBtn.addEventListener("click", () => {
        NS.toast.show("Shift management is coming soon.");
      });
    }
  }


  /* -------- FILTER LOGIC -------- */

  function getFilteredOfficers() {

    const state = NS.state;

    return DATA.officers.filter(officer => {

      if (state.search) {
        const term = state.search.toLowerCase();
        const haystack = `${officer.name} ${officer.id} ${officer.assignment}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }

      if (state.status !== "all") {
        const map = { onduty: "On Duty", offduty: "Off Duty", suspended: "Suspended" };
        if (officer.status !== map[state.status]) return false;
      }

      if (state.availability !== "all") {
        const wantOnline = state.availability === "online";
        if (officer.online !== wantOnline) return false;
      }

      if (state.shift !== "all") {
        if (officer.shift !== state.shift) return false;
      }

      if (state.assignment !== "all") {
        if (officer.assignment !== state.assignment) return false;
      }

      return true;
    });
  }


  /* -------- TABLE + CARDS -------- */

  function officerRowHTML(officer) {

    const assignmentPillClass = officer.assignment
      ? "assignment-pill"
      : "assignment-pill assignment-pill--unassigned";

    return `
      <tr data-officer-id="${officer.id}">
        <td>
          <div class="officer-cell" data-action="open-drawer" data-id="${officer.id}">
            <span class="officer-avatar" aria-hidden="true">${helpers.initials(officer.name)}</span>
            <div class="officer-info">
              <strong>${officer.name}</strong>
              <span>${officer.id}</span>
            </div>
          </div>
        </td>
        <td>
          ${helpers.statusBadgeHTML(officer.status)}
          <div style="margin-top:5px;">${helpers.presenceHTML(officer.online)}</div>
        </td>
        <td>${officer.shift}</td>
        <td>
          <button type="button" class="${assignmentPillClass}" data-action="open-assignment" data-id="${officer.id}">
            <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
            ${officer.assignment || "Unassigned"}
          </button>
        </td>
        <td>
          <span class="${officer.scans ? "scan-count" : "scan-count scan-count--none"}">
            ${officer.scans ? officer.scans + " scans" : "—"}
          </span>
        </td>
        <td>${officer.lastActive}</td>
        <td>
          <div class="row-menu-wrap">
            <button type="button" class="row-menu-btn" data-action="toggle-row-menu" data-id="${officer.id}" aria-haspopup="true" aria-expanded="false" aria-label="More actions for ${officer.name}">
              <i class="fa-solid fa-ellipsis-vertical" aria-hidden="true"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }


  function officerCardHTML(officer) {

    const assignmentPillClass = officer.assignment
      ? "assignment-pill"
      : "assignment-pill assignment-pill--unassigned";

    return `
      <article class="officer-card" data-officer-id="${officer.id}">
        <div class="officer-card-top">
          <div class="officer-cell" data-action="open-drawer" data-id="${officer.id}">
            <span class="officer-avatar" aria-hidden="true">${helpers.initials(officer.name)}</span>
            <div class="officer-info">
              <strong>${officer.name}</strong>
              <span>${officer.id}</span>
            </div>
          </div>
          <div class="row-menu-wrap">
            <button type="button" class="row-menu-btn" data-action="toggle-row-menu" data-id="${officer.id}" aria-haspopup="true" aria-expanded="false" aria-label="More actions for ${officer.name}">
              <i class="fa-solid fa-ellipsis-vertical" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        <div class="officer-card-meta">
          <div>
            <span>Status</span>
            <span>${officer.status}</span>
          </div>
          <div>
            <span>Shift</span>
            <span>${officer.shift}</span>
          </div>
          <div>
            <span>Assignment</span>
            <span>${officer.assignment || "Unassigned"}</span>
          </div>
          <div>
            <span>Last Active</span>
            <span>${officer.lastActive}</span>
          </div>
        </div>

        <div class="officer-card-actions">
          <button type="button" class="btn btn--ghost btn--sm" data-action="open-assignment" data-id="${officer.id}">
            <i class="fa-solid fa-location-dot" aria-hidden="true"></i> Assignment
          </button>
          <button type="button" class="btn btn--secondary btn--sm" data-action="open-drawer" data-id="${officer.id}">
            View Profile
          </button>
        </div>
      </article>
    `;
  }


  function renderEmptyState(target) {

    return `
      <div class="empty-state">
        <i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
        <strong>No security officers found</strong>
        <span>Try adjusting your search or filters.</span>
        <button type="button" class="btn btn--secondary btn--sm" id="empty-clear-filters-btn">Clear Filters</button>
      </div>
    `;
  }


  function renderTableAndPagination() {

    const tbody = document.getElementById("security-table-body");
    const cardList = document.getElementById("officer-card-list");
    const emptyWrap = document.getElementById("security-empty-state");
    const paginationBar = document.getElementById("pagination-bar");
    const statusEl = document.getElementById("pagination-status");
    const controlsEl = document.getElementById("pagination-controls");

    if (!tbody || !cardList) return;

    const state = NS.state;
    const filtered = getFilteredOfficers();

    if (!filtered.length) {
      tbody.innerHTML = "";
      cardList.innerHTML = "";
      emptyWrap.innerHTML = renderEmptyState();
      paginationBar.style.display = "none";

      const emptyBtn = document.getElementById("empty-clear-filters-btn");
      if (emptyBtn) {
        emptyBtn.addEventListener("click", () => {
          document.getElementById("clear-filters-btn").click();
        });
      }

      return;
    }

    emptyWrap.innerHTML = "";
    paginationBar.style.display = "flex";

    const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
    if (state.page > totalPages) state.page = totalPages;

    const start = (state.page - 1) * state.pageSize;
    const pageItems = filtered.slice(start, start + state.pageSize);

    tbody.innerHTML = pageItems.map(officerRowHTML).join("");
    cardList.innerHTML = pageItems.map(officerCardHTML).join("");

    statusEl.textContent =
      `Showing ${start + 1}–${Math.min(start + state.pageSize, filtered.length)} of ${filtered.length} security officers`;

    let controlsHTML = `
      <button type="button" class="page-btn" data-page="prev" ${state.page === 1 ? "disabled" : ""}>Previous</button>
    `;

    for (let i = 1; i <= totalPages; i++) {
      controlsHTML += `
        <button type="button" class="page-btn${i === state.page ? " is-active" : ""}" data-page="${i}">${i}</button>
      `;
    }

    controlsHTML += `
      <button type="button" class="page-btn" data-page="next" ${state.page === totalPages ? "disabled" : ""}>Next</button>
    `;

    controlsEl.innerHTML = controlsHTML;
  }


  /* -------- SECURITY ACTIVITY -------- */

  function renderSecActivity() {

    const wrap = document.getElementById("sec-activity-list");
    if (!wrap) return;

    if (!DATA.secActivity.length) {
      wrap.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-clock-rotate-left"></i>
          <strong>No activity yet</strong>
          <span>Security actions across the estate will appear here.</span>
        </div>
      `;
      return;
    }

    wrap.innerHTML = DATA.secActivity.map(item => `
      <div class="sec-activity-item">
        <span class="sec-activity-icon${item.iconVariant === "denied" ? " sec-activity-icon--denied" : ""}">
          <i class="fa-solid ${item.icon}" aria-hidden="true"></i>
        </span>
        <div class="sec-activity-body">
          <p><strong>${item.officer}</strong> ${item.action}</p>
          <div class="sec-activity-meta">
            <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
            <span>${item.location}</span>
          </div>
        </div>
        <span class="sec-activity-time">${item.time}</span>
      </div>
    `).join("");
  }


  /* -------- ALERTS -------- */

  function renderAlerts() {

    const wrap = document.getElementById("sec-alerts-list");
    if (!wrap) return;

    if (!DATA.alerts.length) {
      wrap.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-circle-check"></i>
          <strong>All clear</strong>
          <span>No security alerts right now.</span>
        </div>
      `;
      return;
    }

    wrap.innerHTML = DATA.alerts.map((alert, index) => `
      <div class="alert-item">
        <span class="alert-icon${alert.muted ? " alert-icon--muted" : ""}">
          <i class="fa-solid ${alert.icon}"></i>
        </span>
        <div class="alert-body">
          <strong>${alert.title}</strong>
          <p>${alert.desc}</p>
          <button type="button" class="text-link" data-alert-index="${index}">${alert.cta}</button>
        </div>
      </div>
    `).join("");

    wrap.querySelectorAll("[data-alert-index]").forEach(btn => {
      btn.addEventListener("click", () => {
        const alert = DATA.alerts[Number(btn.dataset.alertIndex)];
        NS.handlers.handleAlertAction(alert);
      });
    });
  }


  /* -------- NOTIFICATIONS -------- */

  function renderNotifications() {

    const list = document.getElementById("notif-panel-list");
    const dot = document.getElementById("notif-dot");
    const sidebarCount = document.getElementById("sidebar-notif-count");

    if (!list) return;

    const unread = DATA.notifications.filter(n => n.unread).length;

    if (!DATA.notifications.length) {
      list.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-bell-slash"></i>
          <strong>No notifications</strong>
          <span>You're all caught up.</span>
        </div>
      `;
    } else {
      list.innerHTML = DATA.notifications.map(n => `
        <div class="notif-item${n.unread ? " is-unread" : ""}">
          <span class="notif-icon">
            <i class="fa-solid ${n.icon}"></i>
          </span>
          <div class="notif-body">
            <strong>${n.title}</strong>
            <p>${n.desc}</p>
            <span class="notif-time">${n.time}</span>
          </div>
          ${n.unread ? `<span class="notif-unread-dot"></span>` : ""}
        </div>
      `).join("");
    }

    if (dot) dot.hidden = unread === 0;
    if (sidebarCount) {
      sidebarCount.textContent = unread;
      sidebarCount.hidden = unread === 0;
    }
  }


  NS.render = {
    all() {
      renderStats();
      renderOpsPanel();
      renderTableAndPagination();
      renderSecActivity();
      renderAlerts();
      renderNotifications();
    },
    table() {
      renderTableAndPagination();
    },
    stats() {
      renderStats();
      renderOpsPanel();
    }
  };

})();


/* =========================================================
   TOASTS
   ======================================================= */

(function () {

  "use strict";

  const NS = window.RafaraSecurity;

  function show(message, icon) {

    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <i class="fa-solid ${icon || "fa-circle-check"}" aria-hidden="true"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("is-leaving");
      setTimeout(() => toast.remove(), 220);
    }, 3200);
  }

  NS.toast = { show };

})();


/* =========================================================
   MODALS (generic open/close)
   ======================================================= */

(function () {

  "use strict";

  const NS = window.RafaraSecurity;

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add("is-open"));
    document.body.style.overflow = "hidden";
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => { modal.hidden = true; }, 200);
  }

  function closeAllModals() {
    document.querySelectorAll(".modal-overlay:not([hidden])").forEach(modal => {
      closeModal(modal.id);
    });
  }

  document.addEventListener("click", event => {

    const closeTrigger = event.target.closest("[data-close-modal]");
    if (closeTrigger) {
      closeModal(closeTrigger.dataset.closeModal);
      return;
    }

    if (event.target.classList && event.target.classList.contains("modal-overlay")) {
      closeModal(event.target.id);
    }

  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeAllModals();
    }
  });

  NS.modal = { open: openModal, close: closeModal, closeAll: closeAllModals };

})();


/* =========================================================
   OFFICER DRAWER
   ======================================================= */

(function () {

  "use strict";

  const NS = window.RafaraSecurity;
  const helpers = NS.helpers;

  function openDrawer(officerId) {

    const officer = helpers.findOfficer(officerId);
    if (!officer) return;

    NS.state.activeOfficerId = officerId;

    document.getElementById("drawer-avatar").textContent = helpers.initials(officer.name);
    document.getElementById("drawer-officer-name").textContent = officer.name;
    document.getElementById("drawer-officer-id").textContent = officer.id;
    document.getElementById("drawer-status-badge").outerHTML =
      helpers.statusBadgeHTML(officer.status).replace('<span class="badge', '<span id="drawer-status-badge" class="badge');

    document.getElementById("drawer-personal-info").innerHTML = `
      <div class="details-row"><span>Full Name</span><span>${officer.name}</span></div>
      <div class="details-row"><span>Security ID</span><span>${officer.id}</span></div>
      <div class="details-row"><span>Phone Number</span><span>${officer.phone}</span></div>
      <div class="details-row"><span>Date Added</span><span>${officer.dateAdded}</span></div>
      <div class="details-row"><span>Verification Status</span><span>${officer.verification}</span></div>
    `;

    document.getElementById("drawer-assignment-info").innerHTML = `
      <div class="details-row"><span>Location</span><span>${officer.assignment || "Unassigned"}</span></div>
      <div class="details-row"><span>Shift</span><span>${officer.shift}</span></div>
      <div class="details-row"><span>Duty Status</span><span>${officer.status}</span></div>
      <div class="details-row"><span>Availability</span><span>${officer.online ? "Online" : "Offline"}</span></div>
    `;

    document.getElementById("drawer-metrics").innerHTML = `
      <div class="drawer-metric">
        <strong>${officer.todayActivity.scans}</strong>
        <span>Access Scans</span>
      </div>
      <div class="drawer-metric">
        <strong>${officer.todayActivity.visitorsVerified}</strong>
        <span>Visitors Verified</span>
      </div>
      <div class="drawer-metric">
        <strong>${officer.todayActivity.passesDenied}</strong>
        <span>Passes Denied</span>
      </div>
      <div class="drawer-metric">
        <strong>${officer.todayActivity.passesApproved}</strong>
        <span>Passes Approved</span>
      </div>
    `;

    const timeline = officer.timeline.length
      ? officer.timeline.map(item => `
          <div class="drawer-timeline-item">
            <span class="drawer-timeline-dot" aria-hidden="true"></span>
            <div class="drawer-timeline-body">
              <p>${item.label}</p>
              <span>${item.time}</span>
            </div>
          </div>
        `).join("")
      : `<div class="empty-state"><i class="fa-solid fa-clock-rotate-left"></i><strong>No recent activity</strong></div>`;

    document.getElementById("drawer-timeline").innerHTML = timeline;

    const overlay = document.getElementById("officer-drawer");
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add("is-open"));
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    const overlay = document.getElementById("officer-drawer");
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => { overlay.hidden = true; }, 220);
  }

  document.getElementById("close-drawer-btn").addEventListener("click", closeDrawer);

  document.getElementById("officer-drawer").addEventListener("click", event => {
    if (event.target.id === "officer-drawer") closeDrawer();
  });

  document.getElementById("drawer-change-assignment-btn").addEventListener("click", () => {
    const id = NS.state.activeOfficerId;
    closeDrawer();
    setTimeout(() => NS.handlers.openAssignmentModal(id), 220);
  });

  document.getElementById("drawer-view-activity-btn").addEventListener("click", () => {
    window.location.href = "manager-activity.html";
  });

  document.getElementById("drawer-edit-btn").addEventListener("click", () => {
    NS.toast.show("Officer editing is coming soon.");
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeDrawer();
  });

  NS.drawer = { open: openDrawer, close: closeDrawer };

})();


/* =========================================================
   ROW ACTION MENU (three-dot dropdown)
   ======================================================= */

(function () {

  "use strict";

  const NS = window.RafaraSecurity;

  function closeAllRowMenus() {
    document.querySelectorAll(".dropdown-panel--menu").forEach(menu => menu.remove());
    document.querySelectorAll('[data-action="toggle-row-menu"]').forEach(btn => {
      btn.setAttribute("aria-expanded", "false");
    });
  }

  function buildMenu(officerId) {

    const officer = NS.helpers.findOfficer(officerId);
    if (!officer) return null;

    const menu = document.createElement("div");
    menu.className = "dropdown-panel dropdown-panel--menu";
    menu.setAttribute("role", "menu");

    menu.innerHTML = `
      <button type="button" role="menuitem" data-menu-action="view-profile"><i class="fa-solid fa-id-badge" aria-hidden="true"></i> View Profile</button>
      <button type="button" role="menuitem" data-menu-action="view-activity"><i class="fa-solid fa-clock-rotate-left" aria-hidden="true"></i> View Activity</button>
      <button type="button" role="menuitem" data-menu-action="change-assignment"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> Change Assignment</button>
      <button type="button" role="menuitem" data-menu-action="change-shift"><i class="fa-solid fa-clock" aria-hidden="true"></i> Change Shift</button>
      <hr>
      <button type="button" role="menuitem" class="is-danger" data-menu-action="suspend"><i class="fa-solid fa-ban" aria-hidden="true"></i> Suspend Officer</button>
      <button type="button" role="menuitem" class="is-danger" data-menu-action="remove"><i class="fa-solid fa-trash" aria-hidden="true"></i> Remove Officer</button>
    `;

    menu.querySelectorAll("[data-menu-action]").forEach(btn => {
      btn.addEventListener("click", () => {
        NS.handlers.handleRowMenuAction(btn.dataset.menuAction, officerId);
        closeAllRowMenus();
      });
    });

    return menu;
  }

  document.addEventListener("click", event => {

    const toggleBtn = event.target.closest('[data-action="toggle-row-menu"]');

    if (toggleBtn) {
      event.stopPropagation();

      const alreadyOpen = toggleBtn.getAttribute("aria-expanded") === "true";
      closeAllRowMenus();

      if (!alreadyOpen) {
        const officerId = toggleBtn.dataset.id;
        const menu = buildMenu(officerId);
        if (menu) {
          toggleBtn.parentElement.appendChild(menu);
          toggleBtn.setAttribute("aria-expanded", "true");
        }
      }

      return;
    }

    if (!event.target.closest(".dropdown-panel--menu")) {
      closeAllRowMenus();
    }

  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeAllRowMenus();
  });

  NS.rowMenu = { closeAll: closeAllRowMenus };

})();


/* =========================================================
   HANDLERS (business logic for actions)
   ======================================================= */

(function () {

  "use strict";

  const NS = window.RafaraSecurity;
  const helpers = NS.helpers;

  function openAssignmentModal(officerId) {

    const officer = helpers.findOfficer(officerId);
    if (!officer) return;

    NS.state.activeOfficerId = officerId;

    document.getElementById("assignment-officer-avatar").textContent = helpers.initials(officer.name);
    document.getElementById("assignment-officer-name").textContent = officer.name;
    document.getElementById("assignment-officer-id").textContent = officer.id;
    document.getElementById("assignment-location").value = officer.assignment || "Main Gate";
    document.getElementById("assignment-shift").value = officer.shift;

    NS.modal.open("assignment-modal");
  }

  function handleAlertAction(alert) {
    if (alert.action === "view-officer" && alert.target) {
      NS.drawer.open(alert.target);
      return;
    }

    if (alert.action === "filter-unassigned") {
      NS.state.assignment = "all";
      document.getElementById("filter-assignment").value = "all";
      NS.state.search = "";
      document.getElementById("manager-security-search").value = "";
      NS.toast.show("Showing unassigned officers in the table below.");
      // scroll to table for visibility
      document.querySelector(".security-table")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (alert.action === "view-shift") {
      document.querySelector(".ops-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
  }

  function handleRowMenuAction(action, officerId) {

    const officer = helpers.findOfficer(officerId);
    if (!officer) return;

    switch (action) {

      case "view-profile":
        NS.drawer.open(officerId);
        break;

      case "view-activity":
        window.location.href = "manager-activity.html";
        break;

      case "change-assignment":
        openAssignmentModal(officerId);
        break;

      case "change-shift":
        openAssignmentModal(officerId);
        document.getElementById("assignment-shift").focus();
        break;

      case "suspend":
        NS.state.activeOfficerId = officerId;
        NS.modal.open("suspend-modal");
        break;

      case "remove":
        NS.toast.show(`${officer.name} was removed from the security team.`, "fa-trash");
        NS.DATA.officers = NS.DATA.officers.filter(o => o.id !== officerId);
        NS.DATA.overview.total = NS.DATA.officers.length;
        NS.render.all();
        break;
    }
  }

  NS.handlers = {
    openAssignmentModal,
    handleAlertAction,
    handleRowMenuAction
  };

})();


/* =========================================================
   TABLE / CARD DELEGATED CLICKS
   ======================================================= */

(function () {

  "use strict";

  const NS = window.RafaraSecurity;

  document.addEventListener("click", event => {

    const drawerTrigger = event.target.closest('[data-action="open-drawer"]');
    if (drawerTrigger) {
      NS.drawer.open(drawerTrigger.dataset.id);
      return;
    }

    const assignmentTrigger = event.target.closest('[data-action="open-assignment"]');
    if (assignmentTrigger) {
      NS.handlers.openAssignmentModal(assignmentTrigger.dataset.id);
      return;
    }

  });

})();


/* =========================================================
   SEARCH + FILTERS + PAGINATION
   ======================================================= */

(function () {

  "use strict";

  const NS = window.RafaraSecurity;
  const state = NS.state;

  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  const searchInput = document.getElementById("manager-security-search");
  if (searchInput) {
    searchInput.addEventListener("input", debounce(() => {
      state.search = searchInput.value.trim();
      state.page = 1;
      NS.render.table();
    }, 200));
  }

  const topbarSearch = document.getElementById("topbar-search-input");
  if (topbarSearch) {
    topbarSearch.addEventListener("input", debounce(() => {
      state.search = topbarSearch.value.trim();
      searchInput.value = topbarSearch.value;
      state.page = 1;
      NS.render.table();
    }, 200));
  }

  const filterStatus = document.getElementById("filter-status");
  const filterAvailability = document.getElementById("filter-availability");
  const filterShift = document.getElementById("filter-shift");
  const filterAssignment = document.getElementById("filter-assignment");

  filterStatus.addEventListener("change", () => {
    state.status = filterStatus.value;
    state.page = 1;
    NS.render.table();
  });

  filterAvailability.addEventListener("change", () => {
    state.availability = filterAvailability.value;
    state.page = 1;
    NS.render.table();
  });

  filterShift.addEventListener("change", () => {
    state.shift = filterShift.value;
    state.page = 1;
    NS.render.table();
  });

  filterAssignment.addEventListener("change", () => {
    state.assignment = filterAssignment.value;
    state.page = 1;
    NS.render.table();
  });

  document.getElementById("clear-filters-btn").addEventListener("click", () => {
    state.search = "";
    state.status = "all";
    state.availability = "all";
    state.shift = "all";
    state.assignment = "all";
    state.page = 1;

    searchInput.value = "";
    if (topbarSearch) topbarSearch.value = "";
    filterStatus.value = "all";
    filterAvailability.value = "all";
    filterShift.value = "all";
    filterAssignment.value = "all";

    NS.render.table();
  });

  document.getElementById("pagination-controls").addEventListener("click", event => {

    const btn = event.target.closest(".page-btn");
    if (!btn || btn.disabled) return;

    const page = btn.dataset.page;

    if (page === "prev") {
      state.page = Math.max(1, state.page - 1);
    } else if (page === "next") {
      state.page += 1;
    } else {
      state.page = Number(page);
    }

    NS.render.table();
    document.querySelector(".security-table")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

})();


/* =========================================================
   ADD SECURITY MODAL
   ======================================================= */

(function () {

  "use strict";

  const NS = window.RafaraSecurity;

  document.getElementById("add-security-btn").addEventListener("click", () => {
    document.getElementById("add-security-form").reset();
    ["field-fullname", "field-phone", "field-secid"].forEach(id => {
      document.getElementById(id).classList.remove("has-error");
    });
    NS.modal.open("add-security-modal");
  });

  document.getElementById("generate-id-btn").addEventListener("click", () => {
    const existingIds = NS.DATA.officers.map(o => Number(o.id.replace("SEC-", "")));
    const nextId = Math.max(0, ...existingIds) + 1;
    document.getElementById("new-officer-id").value = `SEC-${String(nextId).padStart(4, "0")}`;
    document.getElementById("field-secid").classList.remove("has-error");
  });

  function validateField(fieldId, isValid) {
    const field = document.getElementById(fieldId);
    field.classList.toggle("has-error", !isValid);
    return isValid;
  }

  document.getElementById("submit-add-security-btn").addEventListener("click", () => {

    const name = document.getElementById("new-officer-name").value.trim();
    const phone = document.getElementById("new-officer-phone").value.trim();
    const secId = document.getElementById("new-officer-id").value.trim();
    const role = document.getElementById("new-officer-role").value;
    const shift = document.getElementById("new-officer-shift").value;
    const assignment = document.getElementById("new-officer-assignment").value;
    const status = document.getElementById("new-officer-status").value;

    const nameValid = validateField("field-fullname", name.length > 1);
    const phoneValid = validateField("field-phone", /^[\d\s+()-]{7,}$/.test(phone));
    const idTaken = NS.DATA.officers.some(o => o.id.toLowerCase() === secId.toLowerCase());
    const idValid = validateField("field-secid", secId.length > 0 && !idTaken);

    if (!nameValid || !phoneValid || !idValid) return;

    NS.DATA.officers.unshift({
      id: secId.toUpperCase(),
      name,
      phone,
      role,
      dateAdded: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      verification: "Pending",
      status: status === "Suspended" ? "Suspended" : "Off Duty",
      online: false,
      shift,
      assignment,
      scans: 0,
      lastActive: "Just now",
      lastActiveMinutes: 0,
      todayActivity: { scans: 0, visitorsVerified: 0, passesDenied: 0, passesApproved: 0 },
      timeline: [{ time: "Just now", label: "Officer account created" }]
    });

    NS.DATA.overview.total = NS.DATA.officers.length;
    NS.state.page = 1;

    NS.modal.close("add-security-modal");
    NS.render.all();
    NS.toast.show("Security officer added successfully.");
  });

})();


/* =========================================================
   ASSIGNMENT MODAL — SAVE
   ======================================================= */

(function () {

  "use strict";

  const NS = window.RafaraSecurity;

  document.getElementById("save-assignment-btn").addEventListener("click", () => {

    const officer = NS.helpers.findOfficer(NS.state.activeOfficerId);
    if (!officer) return;

    officer.assignment = document.getElementById("assignment-location").value;
    officer.shift = document.getElementById("assignment-shift").value;

    NS.modal.close("assignment-modal");
    NS.render.table();
    NS.toast.show("Security assignment updated successfully.");
  });

})();


/* =========================================================
   SUSPEND MODAL — CONFIRM
   ======================================================= */

(function () {

  "use strict";

  const NS = window.RafaraSecurity;

  document.getElementById("confirm-suspend-btn").addEventListener("click", () => {

    const officer = NS.helpers.findOfficer(NS.state.activeOfficerId);
    if (!officer) return;

    officer.status = "Suspended";
    officer.online = false;

    NS.modal.close("suspend-modal");
    NS.render.all();
    NS.toast.show(`${officer.name} has been suspended.`, "fa-ban");
  });

})();


/* =========================================================
   SIDEBAR DRAWER (mobile shell)
   ========================================================= */

(function () {

  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  const toggle = document.getElementById("sidebar-toggle-btn");

  if (!sidebar || !backdrop || !toggle) return;

  function openSidebar() {
    sidebar.classList.add("is-open");
    backdrop.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    sidebar.classList.remove("is-open");
    backdrop.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  toggle.addEventListener("click", () => {
    if (sidebar.classList.contains("is-open")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  backdrop.addEventListener("click", closeSidebar);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeSidebar();
  });

})();


/* =========================================================
   TOPBAR DROPDOWNS
   ========================================================= */

(function () {

  const dropdowns = document.querySelectorAll("[data-dropdown]");
  if (!dropdowns.length) return;

  function closeAll(except = null) {
    dropdowns.forEach(wrapper => {
      if (wrapper === except) return;
      const panel = wrapper.querySelector(".dropdown-panel");
      const button = wrapper.querySelector("button");
      if (panel) panel.hidden = true;
      if (button) button.setAttribute("aria-expanded", "false");
    });
  }

  dropdowns.forEach(wrapper => {
    const button = wrapper.querySelector("button");
    const panel = wrapper.querySelector(".dropdown-panel");
    if (!button || !panel) return;

    button.addEventListener("click", event => {
      event.stopPropagation();
      const wasOpen = !panel.hidden;
      closeAll();
      panel.hidden = wasOpen;
      button.setAttribute("aria-expanded", String(!wasOpen));
    });
  });

  document.addEventListener("click", event => {
    const inside = [...dropdowns].some(dropdown => dropdown.contains(event.target));
    if (!inside) closeAll();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeAll();
  });

})();


/* =========================================================
   MARK ALL NOTIFICATIONS READ
   ========================================================= */

(function () {

  const button = document.getElementById("mark-all-read-btn");
  if (!button) return;

  button.addEventListener("click", () => {
    window.RafaraSecurity.DATA.notifications.forEach(n => { n.unread = false; });
    window.RafaraSecurity.render.all();
  });

})();


/* =========================================================
   MOBILE MORE SHEET
   ========================================================= */

(function () {

  const sheet = document.getElementById("mobile-menu-sheet");
  const button = document.getElementById("mobile-menu-btn");
  const closeTriggers = document.querySelectorAll("[data-close-mobile-sheet]");

  if (!sheet || !button) return;

  function openSheet() {
    sheet.hidden = false;
    requestAnimationFrame(() => sheet.classList.add("is-open"));
    button.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeSheet() {
    sheet.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    setTimeout(() => { sheet.hidden = true; }, 220);
  }

  button.addEventListener("click", () => {
    if (sheet.hidden) {
      openSheet();
    } else {
      closeSheet();
    }
  });

  closeTriggers.forEach(trigger => {
    trigger.addEventListener("click", closeSheet);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !sheet.hidden) closeSheet();
  });

})();


/* =========================================================
   LOGOUT
   ========================================================= */

(function () {

  const triggers = [
    document.getElementById("logout-btn"),
    document.getElementById("mobile-logout-btn"),
    document.getElementById("dropdown-logout-btn")
  ].filter(Boolean);

  triggers.forEach(button => {
    button.addEventListener("click", () => {
      window.location.href = "manager-login.html";
    });
  });

})();


/* =========================================================
   INIT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  window.RafaraSecurity.render.all();
});
