// ========================================
// NIRMAL GRAMA
// TRACK COMPLAINT JAVASCRIPT
// ========================================


// ========================================
// CURRENT LANGUAGE
// ========================================

let currentLanguage = "en";


// ========================================
// ELEMENTS
// ========================================

const languageBtn =
    document.getElementById("languageBtn");

const complaintIdInput =
    document.getElementById("complaintIdInput");

const trackButton =
    document.getElementById("trackButton");

const complaintDetails =
    document.getElementById("complaintDetails");

const emptyState =
    document.getElementById("emptyState");

const searchMessage =
    document.getElementById("searchMessage");


// ========================================
// CURRENT COMPLAINT
// ========================================

let currentComplaint = null;


// ========================================
// LOGGED-IN CITIZEN
// ========================================

const loggedInMobile =
    localStorage.getItem("citizenMobile");


// ========================================
// LANGUAGE BUTTON
// ========================================

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
// CHANGE LANGUAGE
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


    // Refresh currently displayed complaint
    if (currentComplaint) {

        displayComplaint(currentComplaint);

    }

}


// ========================================
// BACK TO DASHBOARD
// ========================================

const backBtn =
    document.getElementById("backBtn");


if (backBtn) {

    backBtn.addEventListener("click", function () {

        window.location.href =
            "../dashboard/citizen-dashboard.html";

    });

}


// ========================================
// CATEGORY NAMES
// ========================================

const categoryNames = {

    "Road": {
        en: "Road",
        te: "రోడ్డు"
    },

    "Water": {
        en: "Water",
        te: "నీరు"
    },

    "Garbage": {
        en: "Garbage",
        te: "చెత్త"
    },

    "Street Light": {
        en: "Street Light",
        te: "వీధి దీపం"
    },

    "Other": {
        en: "Other",
        te: "ఇతర"
    }

};


// ========================================
// TRACK BUTTON
// ========================================

if (trackButton) {

    trackButton.addEventListener("click", function () {

        const complaintId =
            complaintIdInput.value.trim().toUpperCase();


        // No Complaint ID entered
        if (!complaintId) {

            showMessage(
                currentLanguage === "en"
                    ? "Please enter your Complaint ID."
                    : "దయచేసి మీ ఫిర్యాదు IDని నమోదు చేయండి."
            );

            return;

        }


        findComplaint(complaintId);

    });

}


// ========================================
// ENTER KEY
// ========================================

if (complaintIdInput) {

    complaintIdInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                trackButton.click();

            }

        }
    );

}


// ========================================
// FIND COMPLAINT
// ========================================

async function findComplaint(complaintId) {

    try {

        const mobile =
    localStorage.getItem("citizenMobile");

    const response = await fetch(
    `https://nirmal-grama-backend.onrender.com/api/complaints/${complaintId}?mobile=${mobile}`
    );


        const data = await response.json();


        // ========================================
        // COMPLAINT NOT FOUND
        // ========================================

        if (!response.ok) {

            currentComplaint = null;

            complaintDetails.classList.remove("show");

            emptyState.style.display = "block";


            showMessage(
                currentLanguage === "en"
                    ? "Complaint not found. Please check the Complaint ID."
                    : "ఫిర్యాదు కనుగొనబడలేదు. దయచేసి ఫిర్యాదు IDని తనిఖీ చేయండి."
            );

            return;

        }


        // ========================================
        // COMPLAINT FOUND
        // ========================================

        const complaint = data;


        // ========================================
        // CHECK CITIZEN OWNERSHIP
        // ========================================

        if (
            loggedInMobile &&
            complaint.citizenMobile &&
            complaint.citizenMobile !== loggedInMobile
        ) {

            currentComplaint = null;

            complaintDetails.classList.remove("show");

            emptyState.style.display = "block";


            showMessage(
                currentLanguage === "en"
                    ? "This complaint does not belong to your account."
                    : "ఈ ఫిర్యాదు మీ ఖాతాకు సంబంధించినది కాదు."
            );

            return;

        }


        // ========================================
        // DISPLAY COMPLAINT
        // ========================================

        currentComplaint = complaint;

        displayComplaint(complaint);


    } catch (error) {

        console.error(
            "Track complaint error:",
            error
        );


        currentComplaint = null;

        complaintDetails.classList.remove("show");

        emptyState.style.display = "block";


        showMessage(
            currentLanguage === "en"
                ? "Could not connect to the server. Please try again."
                : "సర్వర్‌కు కనెక్ట్ కాలేకపోయాము. మళ్లీ ప్రయత్నించండి."
        );

    }

}


// ========================================
// DISPLAY COMPLAINT
// ========================================

function displayComplaint(complaint) {

    emptyState.style.display = "none";

    complaintDetails.classList.add("show");

    searchMessage.textContent = "";


    // ========================================
    // COMPLAINT ID
    // ========================================

    const displayComplaintId =
        document.getElementById("displayComplaintId");


    displayComplaintId.textContent =
        complaint.complaintId || "--";


    // ========================================
    // CATEGORY
    // ========================================

    const complaintCategory =
        document.getElementById("complaintCategory");


    const category =
        categoryNames[complaint.category];


    if (category) {

        complaintCategory.textContent =
            category[currentLanguage];

    } else {

        complaintCategory.textContent =
            complaint.category || "--";

    }


    // ========================================
    // DESCRIPTION
    // ========================================

    const complaintDescription =
        document.getElementById("complaintDescription");


    complaintDescription.textContent =
        complaint.description || "--";


    // ========================================
    // DATE
    // ========================================

    const complaintDate =
        document.getElementById("complaintDate");


    complaintDate.textContent =
        formatDate(complaint.createdAt);


    // ========================================
    // LOCATION
    // ========================================

    const complaintLocation =
        document.getElementById("complaintLocation");


    complaintLocation.textContent =
        getLocationText(complaint);


    // ========================================
    // STATUS
    // ========================================

    updateStatus(
        complaint.status || "Pending"
    );

}


// ========================================
// FORMAT DATE
// ========================================

function formatDate(dateValue) {

    if (!dateValue) {

        return "--";

    }


    const date =
        new Date(dateValue);


    // Invalid date
    if (isNaN(date.getTime())) {

        return dateValue;

    }


    return date.toLocaleDateString(

        currentLanguage === "te"
            ? "te-IN"
            : "en-IN",

        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }

    );

}


// ========================================
// LOCATION
// ========================================

function getLocationText(complaint) {

    if (!complaint.location) {

        return currentLanguage === "en"
            ? "Location not available"
            : "స్థానం అందుబాటులో లేదు";

    }


    const location = complaint.location;


    const parts = [
        location.houseNumber,
        location.street,
        location.village,
        location.mandal,
        location.district,
        location.pincode
    ].filter(function (value) {

        return value && value.trim();

    });


    if (parts.length === 0) {

        return currentLanguage === "en"
            ? "Location not available"
            : "స్థానం అందుబాటులో లేదు";

    }


    return parts.join(", ");

}

// ========================================
// UPDATE STATUS
// ========================================

function updateStatus(status) {

    const statusBadge =
        document.getElementById("statusBadge");

    const pendingStep =
        document.getElementById("pendingStep");

    const progressStep =
        document.getElementById("progressStep");

    const resolvedStep =
        document.getElementById("resolvedStep");

    const rejectedStep =
        document.getElementById("rejectedStep");


    // ========================================
    // RESET ALL STEPS
    // ========================================

    pendingStep.classList.remove(
        "active",
        "completed"
    );

    progressStep.classList.remove(
        "active",
        "completed"
    );

    resolvedStep.classList.remove(
        "active",
        "completed"
    );

    rejectedStep.classList.remove(
        "active",
        "completed"
    );


    // ========================================
    // RESET STATUS BADGE
    // ========================================

    statusBadge.classList.remove(
        "in-progress",
        "resolved",
        "rejected"
    );


    // ========================================
    // PENDING
    // ========================================

    if (status === "Pending") {

        pendingStep.classList.add("active");

        statusBadge.textContent =
            currentLanguage === "en"
                ? "Pending"
                : "పెండింగ్";

    }


    // ========================================
    // IN PROGRESS
    // ========================================

    else if (status === "In Progress") {

        pendingStep.classList.add("completed");

        progressStep.classList.add("active");

        statusBadge.classList.add("in-progress");

        statusBadge.textContent =
            currentLanguage === "en"
                ? "In Progress"
                : "పురోగతిలో ఉంది";

    }


    // ========================================
    // RESOLVED
    // ========================================

    else if (status === "Resolved") {

        pendingStep.classList.add("completed");

        progressStep.classList.add("completed");

        resolvedStep.classList.add("active");

        statusBadge.classList.add("resolved");

        statusBadge.textContent =
            currentLanguage === "en"
                ? "Resolved"
                : "పరిష్కరించబడింది";

    }


    // ========================================
    // REJECTED
    // ========================================

    else if (status === "Rejected") {

        rejectedStep.classList.add("active");

        statusBadge.classList.add("rejected");

        statusBadge.textContent =
            currentLanguage === "en"
                ? "Rejected"
                : "తిరస్కరించబడింది";

    }


    // ========================================
    // UNKNOWN STATUS
    // ========================================

    else {

        pendingStep.classList.add("active");

        statusBadge.textContent =
            status;

    }

}


// ========================================
// ERROR / SEARCH MESSAGE
// ========================================

function showMessage(message) {

    searchMessage.textContent =
        message;

}


// ========================================
// AUTO LOAD COMPLAINT
// ========================================

window.addEventListener("load", function () {

    const savedComplaintId =
        localStorage.getItem("trackComplaintId");


    // ========================================
    // ONLY AUTO-LOAD IF AN ID WAS EXPLICITLY
    // PASSED FROM ANOTHER PAGE
    // ========================================

    if (savedComplaintId) {

        complaintIdInput.value =
            savedComplaintId;


        findComplaint(
            savedComplaintId
        );


        // ========================================
        // IMPORTANT:
        // Remove the saved ID immediately after
        // using it so it cannot appear again
        // when Track Complaint is opened normally.
        // ========================================

        localStorage.removeItem(
            "trackComplaintId"
        );

    }

});