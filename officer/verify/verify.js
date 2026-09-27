// ========================================
// NIRMAL GRAMA
// VERIFY COMPLAINT JAVASCRIPT
// ========================================


// ========================================
// OFFICER DETAILS
// ========================================

const officerName =
    document.getElementById("officerName");

const officerArea =
    document.getElementById("officerArea");


officerName.textContent =
    localStorage.getItem("officerName") || "Officer";

officerArea.textContent =
    localStorage.getItem("officerArea") || "Assigned Area";


// ========================================
// SELECTED COMPLAINT ID
// ========================================

const selectedComplaintId =
    localStorage.getItem("selectedComplaintId");


// ========================================
// ELEMENTS
// ========================================

const complaintId =
    document.getElementById("complaintId");

const complaintStatus =
    document.getElementById("complaintStatus");

const complaintCategory =
    document.getElementById("complaintCategory");

const complaintDate =
    document.getElementById("complaintDate");

const citizenMobile =
    document.getElementById("citizenMobile");

const complaintDescription =
    document.getElementById("complaintDescription");

const village =
    document.getElementById("village");

const complaintLocation =
    document.getElementById("location");

const complaintPhoto =
    document.getElementById("complaintPhoto");

const noPhoto =
    document.getElementById("noPhoto");

const verifyBtn =
    document.getElementById("verifyBtn");

const rejectBtn =
    document.getElementById("rejectBtn");

const resolveBtn =
    document.getElementById("resolveBtn");

const backBtn =
    document.getElementById("backBtn");

const notification =
    document.getElementById("notification");

const notificationMessage =
    document.getElementById(
        "notificationMessage"
    );

const actionDescription =
    document.getElementById(
        "actionDescription"
    );


// ========================================
// BACKEND URL
// ========================================

const API_URL =
    "https://nirmal-grama-backend.onrender.com/api/complaints";

const OFFICER_API_URL =
    "https://nirmal-grama-backend.onrender.com/api/officer/complaints";

// ========================================
// DASHBOARD PATH
// ========================================

const dashboardPath =
    "../dashboard/officer-dashboard.html";


// ========================================
// CURRENT COMPLAINT
// ========================================

let complaint = null;


// ========================================
// CHECK SELECTED COMPLAINT ID
// ========================================

if (!selectedComplaintId) {

    alert(
        "No complaint was selected."
    );

    window.location.href =
        dashboardPath;

}


// ========================================
// SHOW NOTIFICATION
// ========================================

function showNotification(message) {

    notificationMessage.textContent =
        message;

    notification.classList.add(
        "show"
    );


    setTimeout(() => {

        notification.classList.remove(
            "show"
        );

    }, 3000);

}


// ========================================
// LOAD COMPLAINT FROM BACKEND
// ========================================

async function loadComplaint() {

    try {

        const response =
            await fetch(
                `${OFFICER_API_URL}/${selectedComplaintId}`
            );

        const data =
            await response.json();
        if (!response.ok) {

            alert(
                data.message ||
                "Complaint could not be found."
            );

            window.location.href =
                dashboardPath;

            return;
        }

        complaint =
        data.complaint ||
        data;

        displayComplaint();
    } catch (error) {

        console.error(
            "Failed to load complaint:",
            error
        );

        alert(
            "Could not connect to the server. Please make sure the backend is running."
        );

        window.location.href =
            dashboardPath;
    }
}


// ========================================
// DISPLAY COMPLAINT
// ========================================

function displayComplaint() {

    console.log("DISPLAYING COMPLAINT:", complaint);

    if (!complaint) {
        return;
    }

    // ====================================
    // BASIC DETAILS
    // ====================================

    complaintId.textContent =
        complaint.complaintId || "Not available";

    complaintStatus.textContent =
        complaint.status || "Pending";

    complaintCategory.textContent =
        complaint.category || "Not available";

    complaintDate.textContent =
        complaint.createdAt
            ? new Date(complaint.createdAt).toLocaleString()
            : "Not available";

    citizenMobile.textContent =
        complaint.citizenMobile || "Not available";

    complaintDescription.textContent =
        complaint.description || "No description available.";


    // ====================================
    // LOCATION
    // ====================================

    village.textContent =
        complaint.location?.village || "Not available";

    complaintLocation.textContent =
        [
            complaint.location?.houseNumber,
            complaint.location?.street,
            complaint.location?.village,
            complaint.location?.mandal,
            complaint.location?.district,
            complaint.location?.pincode
        ]
        .filter(Boolean)
        .join(", ") || "Not available";


    // ====================================
    // PHOTO
    // ====================================

    if (complaint.photo) {

        complaintPhoto.src =
            complaint.photo;

        complaintPhoto.style.display =
            "block";

        noPhoto.style.display =
            "none";

    } else {

        complaintPhoto.style.display =
            "none";

        noPhoto.style.display =
            "block";
    }


    // ====================================
    // UPDATE ACTION BUTTONS
    // ====================================

    updateActionButtons();
}

// ========================================
// UPDATE ACTION BUTTONS
// ========================================

function updateActionButtons() {

    if (!complaint) {
        return;
    }


    // ====================================
    // REJECTED
    // ====================================

    if (complaint.status === "Rejected") {

        verifyBtn.style.display =
            "none";

        rejectBtn.style.display =
            "none";

        resolveBtn.style.display =
            "none";

        actionDescription.textContent =
            "This complaint has been rejected and no further action is required.";

        return;

    }


    // ====================================
    // ALREADY RESOLVED
    // ====================================

    if (complaint.status === "Resolved") {

        verifyBtn.style.display =
            "none";

        rejectBtn.style.display =
            "none";

        resolveBtn.style.display =
            "none";

        actionDescription.textContent =
            "This complaint has already been resolved.";

        return;

    }


    // ====================================
    // VERIFIED / IN PROGRESS
    // ====================================

    if (
        complaint.verified === true ||
        complaint.status === "In Progress"
    ) {

        verifyBtn.style.display =
            "none";

        rejectBtn.style.display =
            "none";

        resolveBtn.style.display =
            "inline-block";

        actionDescription.textContent =
            "This complaint has been verified and the details have been sent to the responsible person. Mark it as resolved once the work is completed.";

        return;

    }


    // ====================================
    // NOT VERIFIED / PENDING
    // ====================================

    verifyBtn.style.display =
        "inline-block";

    rejectBtn.style.display =
        "inline-block";

    resolveBtn.style.display =
        "none";

    actionDescription.textContent =
        "Please review all the information before verifying or rejecting this complaint.";

}


// ========================================
// VERIFY COMPLAINT
// ========================================

verifyBtn.addEventListener(
    "click",
    async () => {

        if (!complaint) {
            return;
        }


        // --------------------------------
        // PREVENT DOUBLE VERIFICATION
        // --------------------------------

        if (
            complaint.verified === true ||
            complaint.status === "In Progress"
        ) {

            showNotification(
                "This complaint has already been verified."
            );

            return;

        }


        try {

            // ----------------------------
            // SEND VERIFY REQUEST
            // ----------------------------

            const response =
                await fetch(
                    `${API_URL}/${complaint.complaintId}/verify`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );


            const data =
                await response.json();


            // ----------------------------
            // HANDLE ERROR
            // ----------------------------

            if (!response.ok) {

                showNotification(
                    data.message ||
                    "Failed to verify complaint."
                );

                return;

            }


            // ----------------------------
            // UPDATE LOCAL COMPLAINT
            // ----------------------------

            complaint =
                data.complaint;


            // ----------------------------
            // UPDATE PAGE
            // ----------------------------

            displayComplaint();


            // ----------------------------
            // SUCCESS MESSAGE
            // ----------------------------

            showNotification(
                "Complaint verified. Details sent to the responsible person."
            );


        } catch (error) {

            console.error(
                "Verify complaint error:",
                error
            );

            showNotification(
                "Could not connect to the server."
            );

        }

    }
);


// ========================================
// RESOLVE COMPLAINT
// ========================================

resolveBtn.addEventListener(
    "click",
    async () => {

        if (!complaint) {
            return;
        }


        // --------------------------------
        // ONLY VERIFIED COMPLAINTS
        // CAN BE RESOLVED
        // --------------------------------

        if (
            complaint.verified !== true &&
            complaint.status !== "In Progress"
        ) {

            showNotification(
                "Please verify the complaint first."
            );

            return;

        }


        // --------------------------------
        // PREVENT DOUBLE RESOLUTION
        // --------------------------------

        if (
            complaint.status === "Resolved"
        ) {

            showNotification(
                "This complaint has already been resolved."
            );

            return;

        }


        // --------------------------------
        // CONFIRM RESOLUTION
        // --------------------------------

        const confirmed =
            confirm(
                "Are you sure you want to mark this complaint as resolved?"
            );


        if (!confirmed) {
            return;
        }


        try {

            // ----------------------------
            // SEND RESOLVE REQUEST
            // ----------------------------

            const response =
                await fetch(
                    `${API_URL}/${complaint.complaintId}/resolve`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );


            const data =
                await response.json();


            // ----------------------------
            // HANDLE ERROR
            // ----------------------------

            if (!response.ok) {

                showNotification(
                    data.message ||
                    "Failed to resolve complaint."
                );

                return;

            }


            // ----------------------------
            // UPDATE LOCAL COMPLAINT
            // ----------------------------

            complaint =
                data.complaint;


            // ----------------------------
            // UPDATE PAGE
            // ----------------------------

            displayComplaint();


            // ----------------------------
            // SUCCESS MESSAGE
            // ----------------------------

            showNotification(
                "Complaint has been marked as resolved."
            );


        } catch (error) {

            console.error(
                "Resolve complaint error:",
                error
            );

            showNotification(
                "Could not connect to the server."
            );

        }

    }
);


// ========================================
// REJECT COMPLAINT
// ========================================

rejectBtn.addEventListener(
    "click",
    async () => {

        if (!complaint) {
            return;
        }


        // --------------------------------
        // PREVENT REJECTION AFTER VERIFY
        // --------------------------------

        if (
            complaint.verified === true ||
            complaint.status === "In Progress"
        ) {

            showNotification(
                "This complaint has already been verified and cannot be rejected."
            );

            return;

        }


        // --------------------------------
        // CONFIRM REJECTION
        // --------------------------------

        const confirmed =
            confirm(
                "Are you sure you want to reject this complaint?"
            );


        if (!confirmed) {
            return;
        }


        try {

            // ----------------------------
            // SEND REJECT REQUEST
            // ----------------------------

            const response =
                await fetch(
                    `${API_URL}/${complaint.complaintId}/reject`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );


            const data =
                await response.json();


            // ----------------------------
            // HANDLE ERROR
            // ----------------------------

            if (!response.ok) {

                showNotification(
                    data.message ||
                    "Failed to reject complaint."
                );

                return;

            }


            // ----------------------------
            // UPDATE LOCAL COMPLAINT
            // ----------------------------

            complaint =
                data.complaint;


            // ----------------------------
            // SUCCESS MESSAGE
            // ----------------------------

            showNotification(
                "Complaint has been rejected."
            );


            // ----------------------------
            // RETURN TO DASHBOARD
            // ----------------------------

            setTimeout(() => {

                window.location.href =
                    dashboardPath;

            }, 1200);


        } catch (error) {

            console.error(
                "Reject complaint error:",
                error
            );

            showNotification(
                "Could not connect to the server."
            );

        }

    }
);


// ========================================
// BACK TO DASHBOARD
// ========================================

backBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            dashboardPath;

    }
);


// ========================================
// INITIAL LOAD
// ========================================

loadComplaint();