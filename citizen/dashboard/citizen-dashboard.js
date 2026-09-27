
// ========================================
// CITIZEN DASHBOARD JAVASCRIPT
// ========================================


// ========================================
// CURRENT LANGUAGE
// ========================================

let currentLanguage = "en";


// ========================================
// GET CITIZEN INFORMATION
// ========================================

const citizenName =
    localStorage.getItem("citizenName");

const loggedInMobile =
    localStorage.getItem("citizenMobile");

const citizenWelcome =
    document.getElementById("citizenWelcome");


// ========================================
// LANGUAGE BUTTON
// ========================================

const languageBtn =
    document.getElementById("languageBtn");

if (languageBtn) {

    languageBtn.addEventListener("click", function () {

        if (currentLanguage === "en") {

            currentLanguage = "te";
            languageBtn.textContent = "English";

        } else {

            currentLanguage = "en";
            languageBtn.textContent = "తెలుగు";

        }

        changeLanguage();

    });

}


// ========================================
// LANGUAGE CHANGE FUNCTION
// ========================================

function changeLanguage() {

    const elements =
        document.querySelectorAll("[data-en]");

    elements.forEach(function (element) {

        if (currentLanguage === "en") {

            element.textContent =
                element.getAttribute("data-en");

        } else {

            element.textContent =
                element.getAttribute("data-te");

        }

    });


    // Update welcome message
    updateWelcomeMessage();


    // Refresh complaint cards
    displayComplaints();

}


// ========================================
// WELCOME MESSAGE
// ========================================

function updateWelcomeMessage() {

    if (!citizenWelcome) {
        return;
    }

    if (citizenName) {

        if (currentLanguage === "en") {

            citizenWelcome.textContent =
                `Welcome, ${citizenName}!`;

        } else {

            citizenWelcome.textContent =
                `స్వాగతం, ${citizenName}!`;

        }

    } else {

        if (currentLanguage === "en") {

            citizenWelcome.textContent =
                "Citizen";

        } else {

            citizenWelcome.textContent =
                "పౌరుడు";

        }

    }

}


// ========================================
// COMPLAINTS FROM BACKEND
// ========================================

let complaints = [];


// ========================================
// COMPLAINT LIST
// ========================================

const complaintList =
    document.getElementById("complaintList");


// ========================================
// CATEGORY NAMES
// ========================================

const categoryNames = {

    "Road": {
        en: "Road Problem",
        te: "రోడ్డు సమస్య"
    },

    "Water": {
        en: "Water Problem",
        te: "నీటి సమస్య"
    },

    "Garbage": {
        en: "Garbage Collection",
        te: "చెత్త సేకరణ"
    },

    "Street Light": {
        en: "Street Light",
        te: "వీధి దీపం"
    },

    "Other": {
        en: "Other Problem",
        te: "ఇతర సమస్య"
    }

};
// ========================================
// LOAD COMPLAINTS FROM BACKEND
// ========================================

async function loadComplaints() {

    try {

        const mobile = localStorage.getItem("citizenMobile");

        const response = await fetch(
    `https://nirmal-grama-backend.onrender.com/api/complaints?mobile=${mobile}`
);
        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message || "Failed to fetch complaints"
            );

        }

        complaints = data.complaints || [];

        updateStatistics();
        displayComplaints();

    } catch (error) {

        console.error(
            "Failed to load complaints:",
            error
        );

        complaints = [];

        updateStatistics();

        if (complaintList) {

            complaintList.innerHTML = `

                <div class="empty-complaints">

                    <p>
                        ${
                            currentLanguage === "en"
                            ? "Could not load your complaints. Please try again."
                            : "మీ ఫిర్యాదులను లోడ్ చేయలేకపోయాము. దయచేసి మళ్లీ ప్రయత్నించండి."
                        }
                    </p>

                </div>

            `;

        }

    }

}

// ========================================
// DISPLAY COMPLAINTS
// ========================================

function displayComplaints() {

    if (!complaintList) {
        return;
    }


    // Clear old cards
    complaintList.innerHTML = "";


    // ========================================
    // NO COMPLAINTS
    // ========================================

    if (complaints.length === 0) {

        complaintList.innerHTML = `

            <div class="empty-complaints">

                <p>
                    ${
                        currentLanguage === "en"
                        ? "You have not submitted any complaints yet."
                        : "మీరు ఇంకా ఎలాంటి ఫిర్యాదులు సమర్పించలేదు."
                    }
                </p>

            </div>

        `;

        return;

    }


    // ========================================
    // NEWEST COMPLAINTS FIRST
    // ========================================

    const sortedComplaints =
        [...complaints].reverse();


    // ========================================
    // CREATE COMPLAINT CARDS
    // ========================================

    sortedComplaints.forEach(function (complaint) {

        const card =
            document.createElement("div");

        card.className =
            "complaint-card";


        // ========================================
        // STATUS CLASS
        // ========================================

        let statusClass = "pending";

        if (complaint.status === "In Progress") {

            statusClass = "progress";

        }

        else if (complaint.status === "Resolved") {

            statusClass = "resolved";

        }

        // NEW: REJECTED STATUS
        else if (complaint.status === "Rejected") {

            statusClass = "rejected";

        }


        // ========================================
        // CATEGORY
        // ========================================

        const category =
            categoryNames[complaint.category];


        const categoryEnglish =
            category
            ? category.en
            : complaint.category || "Complaint";


        const categoryTelugu =
            category
            ? category.te
            : complaint.category || "ఫిర్యాదు";


        // ========================================
        // STATUS TEXT
        // ========================================

        const statusEnglish =
            complaint.status || "Pending";


        let statusTelugu =
            "పెండింగ్";


        if (complaint.status === "In Progress") {

            statusTelugu =
                "పురోగతిలో";

        }

        else if (complaint.status === "Resolved") {

            statusTelugu =
                "పరిష్కరించబడింది";

        }

        // NEW: REJECTED STATUS TEXT
        else if (complaint.status === "Rejected") {

            statusTelugu =
                "తిరస్కరించబడింది";

        }


        // ========================================
        // DESCRIPTION
        // ========================================

        let description =
            complaint.description
            ? complaint.description
            : (
                currentLanguage === "en"
                ? "No description provided"
                : "వివరణ అందించలేదు"
            );



        // ========================================
        // REJECTION MESSAGE
        // ========================================

        if (complaint.status === "Rejected") {

            const rejectionMessageEnglish =
                "Your complaint has been rejected by the concerned officer.";

            const rejectionMessageTelugu =
                "మీ ఫిర్యాదు సంబంధిత అధికారి ద్వారా తిరస్కరించబడింది.";

        if (currentLanguage === "en") {

            description =
            rejectionMessageEnglish;

        } else {

        description =
            rejectionMessageTelugu;

    }

}


        // ========================================
        // CREATE CARD HTML
        // ========================================

        card.innerHTML = `

            <div class="complaint-main">

                <div class="complaint-number">
                    #${complaint.complaintId}
                </div>

                <div>

                    <h3>
                        ${
                            currentLanguage === "en"
                            ? categoryEnglish
                            : categoryTelugu
                        }
                    </h3>

                    <p>
                        ${description}
                    </p>

                </div>

            </div>


            <div class="complaint-right">

                <span class="status ${statusClass}">

                    ${
                        currentLanguage === "en"
                        ? statusEnglish
                        : statusTelugu
                    }

                </span>

                <small>
    ${
        complaint.createdAt
        ? new Date(complaint.createdAt).toLocaleDateString()
        : ""
    }
</small>
            </div>

        `;


        // ========================================
        // CLICK COMPLAINT
        // ========================================

        card.addEventListener("click", function () {

            localStorage.setItem(
                "trackComplaintId",
                complaint.complaintId
            );

            window.location.href =
                "../track/track.html";

        });


        // ========================================
        // ADD CARD
        // ========================================

        complaintList.appendChild(card);

    });

}


// ========================================
// UPDATE STATISTICS
// ========================================

function updateStatistics() {

    const total =
        complaints.length;


    const pending =
        complaints.filter(function (complaint) {

            return complaint.status === "Pending";

        }).length;


    const progress =
        complaints.filter(function (complaint) {

            return complaint.status === "In Progress";

        }).length;


    const resolved =
        complaints.filter(function (complaint) {

            return complaint.status === "Resolved";

        }).length;


    const totalElement =
        document.getElementById("totalComplaints");

    const pendingElement =
        document.getElementById("pendingComplaints");

    const progressElement =
        document.getElementById("progressComplaints");

    const resolvedElement =
        document.getElementById("resolvedComplaints");


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (pendingElement) {

        pendingElement.textContent =
            pending;

    }


    if (progressElement) {

        progressElement.textContent =
            progress;

    }


    if (resolvedElement) {

        resolvedElement.textContent =
            resolved;

    }

}


// ========================================
// REPORT A PROBLEM
// ========================================

const reportNewBtn =
    document.getElementById("reportNewBtn");


if (reportNewBtn) {

    reportNewBtn.addEventListener("click", function () {

        window.location.href =
            "../report/report.html";

    });

}


const quickReport =
    document.getElementById("quickReport");


if (quickReport) {

    quickReport.addEventListener("click", function () {

        window.location.href =
            "../report/report.html";

    });

}


// ========================================
// TRACK COMPLAINT
// ========================================

const quickTrack =
    document.getElementById("quickTrack");


if (quickTrack) {

    quickTrack.addEventListener("click", function () {

        // ========================================
        // CLEAR PREVIOUSLY SELECTED COMPLAINT
        // ========================================

        localStorage.removeItem(
            "trackComplaintId"
        );


        // ========================================
        // OPEN CLEAN TRACK COMPLAINT PAGE
        // ========================================

        window.location.href =
            "../track/track.html";

    });

}


// ========================================
// COMPLAINT HISTORY
// ========================================

const quickHistory =
    document.getElementById("quickHistory");


if (quickHistory) {

    quickHistory.addEventListener("click", function () {

        const complaintsSection =
            document.querySelector(".complaints-section");


        if (complaintsSection) {

            complaintsSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

}


// ========================================
// VIEW ALL COMPLAINTS
// ========================================

const viewAllBtn =
    document.getElementById("viewAllBtn");


if (viewAllBtn) {

    viewAllBtn.addEventListener("click", function () {

        const complaintsSection =
            document.querySelector(".complaints-section");


        if (complaintsSection) {

            complaintsSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

}


// ========================================
// HELP BUTTON
// ========================================

const helpBtn =
    document.getElementById("helpBtn");


if (helpBtn) {

    helpBtn.addEventListener("click", function () {

        if (currentLanguage === "en") {

            alert(
                "For help, please contact your local Panchayat office."
            );

        } else {

            alert(
                "సహాయం కోసం మీ స్థానిక పంచాయతీ కార్యాలయాన్ని సంప్రదించండి."
            );

        }

    });

}


// ========================================
// LOGOUT
// ========================================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        localStorage.removeItem("citizenName");
        localStorage.removeItem("citizenMobile");
        localStorage.removeItem("citizenLatitude");
        localStorage.removeItem("citizenLongitude");

        localStorage.removeItem("latestComplaintId");
        localStorage.removeItem("trackComplaintId");


        window.location.href =
            "../../Home/index.html";

    });

}


updateWelcomeMessage();

changeLanguage();

loadComplaints();


// ========================================
// REFRESH WHEN RETURNING TO DASHBOARD
// ========================================

document.addEventListener("visibilitychange", function () {

    if (!document.hidden) {

        loadComplaints();

    }

});