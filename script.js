// ========================================
// NIRMAL GRAMA HOMEPAGE
// ========================================


// ========================================
// CURRENT LANGUAGE
// ========================================

let currentLanguage = "en";


// ========================================
// LANGUAGE DROPDOWN
// ========================================

const languageSelect =
    document.getElementById("languageSelect");


if (languageSelect) {

    languageSelect.addEventListener("change", function () {

        currentLanguage = this.value;

        changeLanguage(currentLanguage);

    });

}


// ========================================
// CHANGE ALL TEXT
// ========================================

function changeLanguage(language) {

    const elements =
        document.querySelectorAll("[data-en]");


    elements.forEach(function (element) {

        const englishText =
            element.getAttribute("data-en");

        const teluguText =
            element.getAttribute("data-te");


        if (language === "te") {

            element.textContent =
                teluguText;

        } else {

            element.textContent =
                englishText;

        }

    });


    // ====================================
    // CHANGE INPUT PLACEHOLDERS
    // ====================================

    const inputs =
        document.querySelectorAll(
            "[data-placeholder-en]"
        );


    inputs.forEach(function (input) {

        if (language === "te") {

            input.placeholder =
                input.getAttribute(
                    "data-placeholder-te"
                );

        } else {

            input.placeholder =
                input.getAttribute(
                    "data-placeholder-en"
                );

        }

    });


    // ====================================
    // CHANGE HTML LANGUAGE
    // ====================================

    document.documentElement.lang =
        language === "te"
            ? "te"
            : "en";

}


// ========================================
// CITIZEN LOGIN MODAL
// ========================================

const citizenLoginModal =
    document.getElementById(
        "citizenLoginModal"
    );

const closeCitizenLogin =
    document.getElementById(
        "closeCitizenLogin"
    );

const reportBtn =
    document.getElementById(
        "reportBtn"
    );


// ========================================
// OPEN CITIZEN LOGIN
// ========================================

if (reportBtn) {

    reportBtn.addEventListener(
        "click",
        function () {

            citizenLoginModal.classList.add(
                "active"
            );

        }
    );

}


// ========================================
// CLOSE CITIZEN LOGIN
// ========================================

if (closeCitizenLogin) {

    closeCitizenLogin.addEventListener(
        "click",
        function () {

            citizenLoginModal.classList.remove(
                "active"
            );

        }
    );

}


// ========================================
// CLOSE WHEN CLICKING OUTSIDE CARD
// ========================================

if (citizenLoginModal) {

    citizenLoginModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                citizenLoginModal
            ) {

                citizenLoginModal.classList.remove(
                    "active"
                );

            }

        }
    );

}


// ========================================
// CLOSE WITH ESCAPE KEY
// ========================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            citizenLoginModal
        ) {

            citizenLoginModal.classList.remove(
                "active"
            );

        }

    }
);


// ========================================
// CITIZEN CONTINUE LOGIN
// ========================================

const citizenContinueBtn =
    document.getElementById(
        "citizenContinueBtn"
    );


if (citizenContinueBtn) {

    citizenContinueBtn.addEventListener(
        "click",
        function () {

            const name =
                document
                    .getElementById(
                        "citizenName"
                    )
                    .value
                    .trim();


            const mobile =
                document
                    .getElementById(
                        "citizenMobile"
                    )
                    .value
                    .trim();


            // ====================================
            // CHECK NAME
            // ====================================

            if (!name) {

                if (
                    currentLanguage === "en"
                ) {

                    alert(
                        "Please enter your name."
                    );

                } else {

                    alert(
                        "దయచేసి మీ పేరు నమోదు చేయండి."
                    );

                }

                return;

            }


            // ====================================
            // CHECK MOBILE NUMBER
            // ====================================

            if (!/^\d{10}$/.test(mobile)) {

                if (
                    currentLanguage === "en"
                ) {

                    alert(
                        "Please enter a valid 10-digit mobile number."
                    );

                } else {

                    alert(
                        "దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి."
                    );

                }

                return;

            }


            // ====================================
            // SAVE CITIZEN DETAILS
            // ====================================

            localStorage.setItem(
                "citizenLoggedIn",
                "true"
            );

            localStorage.setItem(
                "citizenName",
                name
            );

            localStorage.setItem(
                "citizenMobile",
                mobile
            );


            // ====================================
            // OPEN CITIZEN DASHBOARD
            // ====================================

            window.location.href =
                "citizen/dashboard/citizen-dashboard.html";

        }
    );

}


// ========================================
// TRACK COMPLAINT
// ========================================

const trackBtn =
    document.getElementById(
        "trackBtn"
    );


if (trackBtn) {

    trackBtn.addEventListener(
        "click",
        function () {

            // ====================================
            // CHECK IF CITIZEN IS LOGGED IN
            // ====================================

            const loggedInMobile =
                localStorage.getItem(
                    "citizenMobile"
                );


            // ====================================
            // ALREADY LOGGED IN
            // ====================================

            if (loggedInMobile) {

                localStorage.removeItem(
                    "trackComplaintId"
                );


                window.location.href =
                    "../citizen/dashboard/citizen-dashboard.html";

                return;

            }


            // ====================================
            // NOT LOGGED IN
            // ====================================

            if (citizenLoginModal) {

                citizenLoginModal.classList.add(
                    "active"
                );

            }

        }
    );

}


// ========================================
// OFFICER LOGIN MODAL
// ========================================

const loginBtn =
    document.getElementById(
        "loginBtn"
    );

const officerLoginModal =
    document.getElementById(
        "officerLoginModal"
    );

const closeOfficerLogin =
    document.getElementById(
        "closeOfficerLogin"
    );

const officerContinueBtn =
    document.getElementById(
        "officerContinueBtn"
    );


// ========================================
// OPEN OFFICER LOGIN
// ========================================

if (loginBtn) {

    loginBtn.addEventListener(
        "click",
        function () {

            if (officerLoginModal) {

                officerLoginModal.classList.add(
                    "active"
                );

            }

        }
    );

}


// ========================================
// CLOSE OFFICER LOGIN
// ========================================

if (closeOfficerLogin) {

    closeOfficerLogin.addEventListener(
        "click",
        function () {

            officerLoginModal.classList.remove(
                "active"
            );

        }
    );

}


// ========================================
// CLOSE OUTSIDE OFFICER MODAL
// ========================================

if (officerLoginModal) {

    officerLoginModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                officerLoginModal
            ) {

                officerLoginModal.classList.remove(
                    "active"
                );

            }

        }
    );

}


// ========================================
// OFFICER CONTINUE
// ========================================

if (officerContinueBtn) {

    officerContinueBtn.addEventListener(
        "click",
        function () {

            const name =
                document
                    .getElementById(
                        "officerLoginName"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "officerLoginEmail"
                    )
                    .value
                    .trim();


            const area =
                document
                    .getElementById(
                        "officerLoginArea"
                    )
                    .value
                    .trim();


            // ====================================
            // CHECK NAME
            // ====================================

            if (name === "") {

                if (
                    currentLanguage === "en"
                ) {

                    alert(
                        "Please enter your name."
                    );

                } else {

                    alert(
                        "దయచేసి మీ పేరు నమోదు చేయండి."
                    );

                }

                return;

            }


            // ====================================
            // CHECK EMAIL
            // ====================================

            if (email === "") {

                if (
                    currentLanguage === "en"
                ) {

                    alert(
                        "Please enter your email address."
                    );

                } else {

                    alert(
                        "దయచేసి మీ ఇమెయిల్ చిరునామాను నమోదు చేయండి."
                    );

                }

                return;

            }


            // ====================================
            // CHECK EMAIL FORMAT
            // ====================================

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailPattern.test(email)
            ) {

                if (
                    currentLanguage === "en"
                ) {

                    alert(
                        "Please enter a valid email address."
                    );

                } else {

                    alert(
                        "దయచేసి సరైన ఇమెయిల్ చిరునామాను నమోదు చేయండి."
                    );

                }

                return;

            }


            // ====================================
            // CHECK AREA
            // ====================================

            if (area === "") {

                if (
                    currentLanguage === "en"
                ) {

                    alert(
                        "Please enter your area."
                    );

                } else {

                    alert(
                        "దయచేసి మీ ప్రాంతాన్ని నమోదు చేయండి."
                    );

                }

                return;

            }


            // ====================================
            // SAVE OFFICER DETAILS
            // ====================================

            localStorage.setItem(
                "officerName",
                name
            );


            localStorage.setItem(
                "officerEmail",
                email
            );


            localStorage.setItem(
                "officerArea",
                area
            );


            // ====================================
            // OPEN OFFICER DASHBOARD
            // ====================================

            window.location.href =
                "officer/dashboard/officer-dashboard.html";

        }
    );

}


// ========================================
// HELP SECTION REPORT BUTTON
// ========================================

const helpReportBtn =
    document.getElementById(
        "helpReportBtn"
    );


if (helpReportBtn) {

    helpReportBtn.addEventListener(
        "click",
        function () {

            if (
                currentLanguage === "en"
            ) {

                alert(
                    "The Report a Problem page will open here."
                );

            } else {

                alert(
                    "సమస్యను తెలియజేసే పేజీ ఇక్కడ తెరవబడుతుంది."
                );

            }

        }
    );

}