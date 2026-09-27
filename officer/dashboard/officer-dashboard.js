// ========================================
// NIRMAL GRAMA
// OFFICER DASHBOARD JAVASCRIPT
// ========================================


// ========================================
// OFFICER DETAILS
// ========================================

const officerName =
    document.getElementById("officerName");

const officerArea =
    document.getElementById("officerArea");


const loggedInOfficerName =
    localStorage.getItem("officerName");

const loggedInOfficerArea =
    localStorage.getItem("officerArea");


officerName.textContent =
    loggedInOfficerName || "Officer";

officerArea.textContent =
    loggedInOfficerArea || "Assigned Area";


// ========================================
// COMPLAINTS
// ========================================

let complaints = [];


// ========================================
// LOAD COMPLAINTS FROM BACKEND
// ========================================

async function loadComplaints() {

    try {

        const area =
            localStorage.getItem(
                "officerArea"
            );


        if (!area) {

            console.error(
                "Officer area not found."
            );

            complaints = [];

            updateDashboard();

            return;

        }


        const response =
    await fetch(
        `https://nirmal-grama-backend.onrender.com/api/officer/complaints?area=${encodeURIComponent(area)}`
    );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to fetch complaints"
            );

        }


        complaints =
            data.complaints || [];


        updateDashboard();


    } catch (error) {

        console.error(
            "Failed to load complaints:",
            error
        );


        complaints = [];

        updateDashboard();

    }

}


// ========================================
// DASHBOARD COUNTS
// ========================================

const totalCount =
    document.getElementById("totalCount");

const pendingCount =
    document.getElementById("pendingCount");

const progressCount =
    document.getElementById("progressCount");

const resolvedCount =
    document.getElementById("resolvedCount");


// ========================================
// CATEGORY COUNTS
// ========================================

const roadCount =
    document.getElementById("roadCount");

const waterCount =
    document.getElementById("waterCount");

const garbageCount =
    document.getElementById("garbageCount");

const streetLightCount =
    document.getElementById("streetLightCount");

const otherCount =
    document.getElementById("otherCount");


// ========================================
// UPDATE DASHBOARD
// ========================================

function updateDashboard() {


    // ------------------------------------
    // STATUS COUNTS
    // ------------------------------------

    totalCount.textContent =
        complaints.length;


    pendingCount.textContent =
        complaints.filter(
            complaint =>
                complaint.status === "Pending"
        ).length;


    progressCount.textContent =
        complaints.filter(
            complaint =>
                complaint.status === "In Progress"
        ).length;


    resolvedCount.textContent =
        complaints.filter(
            complaint =>
                complaint.status === "Resolved"
        ).length;


    // ------------------------------------
    // CATEGORY COUNTS
    // ------------------------------------

    roadCount.textContent =
        complaints.filter(
            complaint =>
                complaint.category === "Road"
        ).length;


    waterCount.textContent =
        complaints.filter(
            complaint =>
                complaint.category === "Water"
        ).length;


    garbageCount.textContent =
        complaints.filter(
            complaint =>
                complaint.category === "Garbage"
        ).length;


    streetLightCount.textContent =
        complaints.filter(
            complaint =>
                complaint.category === "Street Light"
        ).length;


    otherCount.textContent =
        complaints.filter(
            complaint =>
                complaint.category === "Other"
        ).length;


    // ------------------------------------
    // DISPLAY COMPLAINTS
    // ------------------------------------

    displayComplaints(
        complaints
    );

}


// ========================================
// COMPLAINT LIST
// ========================================

const complaintsList =
    document.getElementById(
        "complaintsList"
    );

const emptyComplaints =
    document.getElementById(
        "emptyComplaints"
    );

const complaintsTitle =
    document.getElementById(
        "complaintsTitle"
    );

const complaintsSubtitle =
    document.getElementById(
        "complaintsSubtitle"
    );

const clearFilterBtn =
    document.getElementById(
        "clearFilterBtn"
    );


function displayComplaints(
    complaintsToDisplay
) {

    complaintsList.innerHTML = "";


    if (
        complaintsToDisplay.length === 0
    ) {

        emptyComplaints.style.display =
            "block";

        return;

    }


    emptyComplaints.style.display =
        "none";


    complaintsToDisplay.forEach(
        complaint => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "complaint-card";


            // ========================================
            // DATE
            // ========================================

            const complaintDate =
                complaint.createdAt
                    ? new Date(
                        complaint.createdAt
                    ).toLocaleDateString()
                    : "";


            // ========================================
            // CREATE CARD
            // ========================================

            card.innerHTML = `

                <div class="complaint-card-left">

                    <div class="complaint-id">
                        ${complaint.complaintId}
                    </div>

                    <h3>
                        ${complaint.category}
                    </h3>

                    <p>
                        ${complaint.description}
                    </p>

                    <span class="complaint-date">
                        ${complaintDate}
                    </span>

                </div>


                <div class="complaint-card-right">

                    <span class="status-badge ${getStatusClass(complaint.status)}">
                        ${complaint.status}
                    </span>

                    <button class="view-complaint-btn">
                        View Details
                    </button>

                </div>

            `;


            // ========================================
            // VIEW DETAILS
            // ========================================

            const viewButton =
                card.querySelector(
                    ".view-complaint-btn"
                );


            viewButton.addEventListener(
                "click",
                () => {

                    localStorage.setItem(
                        "selectedComplaintId",
                        complaint.complaintId
                    );


                    window.location.href =
                        "../verify/verify.html";

                }
            );


            complaintsList.appendChild(
                card
            );

        }
    );

}


// ========================================
// STATUS CLASS
// ========================================

function getStatusClass(status) {

    if (
        status === "Pending"
    ) {

        return "status-pending";

    }


    if (
        status === "In Progress"
    ) {

        return "status-progress";

    }


    if (
        status === "Resolved"
    ) {

        return "status-resolved";

    }


    if (
        status === "Rejected"
    ) {

        return "status-rejected";

    }


    return "";

}


// ========================================
// FILTER
// ========================================

let activeFilter = null;


// ========================================
// STATUS CARD FILTERING
// ========================================

document
    .getElementById("totalCard")
    .addEventListener(
        "click",
        () => {

            clearFilter();

        }
    );


document
    .getElementById("pendingCard")
    .addEventListener(
        "click",
        () => {

            filterByStatus(
                "Pending"
            );

        }
    );


document
    .getElementById("progressCard")
    .addEventListener(
        "click",
        () => {

            filterByStatus(
                "In Progress"
            );

        }
    );


document
    .getElementById("resolvedCard")
    .addEventListener(
        "click",
        () => {

            filterByStatus(
                "Resolved"
            );

        }
    );


function filterByStatus(status) {

    activeFilter = {

        type:
            "status",

        value:
            status

    };


    const filteredComplaints =
        complaints.filter(
            complaint =>
                complaint.status === status
        );


    displayComplaints(
        filteredComplaints
    );


    complaintsTitle.textContent =
        `${status} Complaints`;


    complaintsSubtitle.textContent =
        `Showing complaints with status: ${status}`;


    clearFilterBtn.style.display =
        "inline-block";

}


// ========================================
// CATEGORY FILTERING
// ========================================

document
    .getElementById("roadCategory")
    .addEventListener(
        "click",
        () => {

            filterByCategory(
                "Road"
            );

        }
    );


document
    .getElementById("waterCategory")
    .addEventListener(
        "click",
        () => {

            filterByCategory(
                "Water"
            );

        }
    );


document
    .getElementById("garbageCategory")
    .addEventListener(
        "click",
        () => {

            filterByCategory(
                "Garbage"
            );

        }
    );


document
    .getElementById("streetLightCategory")
    .addEventListener(
        "click",
        () => {

            filterByCategory(
                "Street Light"
            );

        }
    );


document
    .getElementById("otherCategory")
    .addEventListener(
        "click",
        () => {

            filterByCategory(
                "Other"
            );

        }
    );


function filterByCategory(category) {

    activeFilter = {

        type:
            "category",

        value:
            category

    };


    const filteredComplaints =
        complaints.filter(
            complaint =>
                complaint.category === category
        );


    displayComplaints(
        filteredComplaints
    );


    complaintsTitle.textContent =
        `${category} Complaints`;


    complaintsSubtitle.textContent =
        `Showing complaints related to ${category.toLowerCase()}.`;


    clearFilterBtn.style.display =
        "inline-block";

}


// ========================================
// CLEAR FILTER
// ========================================

clearFilterBtn.addEventListener(
    "click",
    clearFilter
);


function clearFilter() {

    activeFilter = null;


    const area =
        localStorage.getItem(
            "officerArea"
        );


    complaintsTitle.textContent =
        "All Complaints";


    complaintsSubtitle.textContent =
        area
            ? `Complaints from ${area}.`
            : "View and manage citizen complaints.";


    clearFilterBtn.style.display =
        "none";


    displayComplaints(
        complaints
    );

}


// ========================================
// LOGOUT
// ========================================

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


logoutBtn.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "officerName"
        );


        localStorage.removeItem(
            "officerEmail"
        );


        localStorage.removeItem(
            "officerArea"
        );


        window.location.href =
            "../../index.html";

    }
);


// ========================================
// INITIAL LOAD
// ========================================

loadComplaints();