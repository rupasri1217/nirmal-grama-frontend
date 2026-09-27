// ========================================
// NIRMAL GRAMA REPORT COMPLAINT
// ========================================


// ========================================
// CURRENT LANGUAGE
// ========================================

let currentLanguage = "en";


// ========================================
// LANGUAGE BUTTON
// ========================================

const languageBtn = document.getElementById("languageBtn");

languageBtn.addEventListener("click", function () {

    if (currentLanguage === "en") {

        currentLanguage = "te";

        languageBtn.textContent = "English";

    } else {

        currentLanguage = "en";

        languageBtn.textContent = "తెలుగు";
    }

    changeLanguage(currentLanguage);

});


// ========================================
// CHANGE LANGUAGE
// ========================================

function changeLanguage(language) {

    const elements = document.querySelectorAll("[data-en]");

    elements.forEach(function (element) {

        if (language === "te") {

            element.textContent =
                element.getAttribute("data-te");

        } else {

            element.textContent =
                element.getAttribute("data-en");

        }

    });


    // Change textarea placeholder

    const complaintText =
        document.getElementById("complaintText");

    if (language === "te") {

        complaintText.placeholder =
            complaintText.getAttribute("data-placeholder-te");

    } else {

        complaintText.placeholder =
            complaintText.getAttribute("data-placeholder-en");

    }

}


// ========================================
// BACK TO DASHBOARD
// ========================================

document.getElementById("backBtn").addEventListener("click", function () {

    window.location.href =
        "../dashboard/citizen-dashboard.html";

});


// ========================================
// CATEGORY SELECTION
// ========================================

let selectedCategory = "";

const categoryCards =
    document.querySelectorAll(".category-card");


categoryCards.forEach(function (card) {

    card.addEventListener("click", function () {

        categoryCards.forEach(function (item) {

            item.classList.remove("selected");

        });

        card.classList.add("selected");

        selectedCategory =
            card.getAttribute("data-category");

    });

});


// ========================================
// VOICE RECOGNITION
// ========================================

const voiceBtn =
    document.getElementById("voiceBtn");

const voiceStatus =
    document.getElementById("voiceStatus");

const complaintText =
    document.getElementById("complaintText");

let recognition = null;


// Check browser support

if ("SpeechRecognition" in window ||
    "webkitSpeechRecognition" in window) {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    recognition = new SpeechRecognition();

    recognition.continuous = false;

    recognition.interimResults = false;

    recognition.lang = "en-IN";


    // Voice button

    voiceBtn.addEventListener("click", function () {

        if (currentLanguage === "te") {

            recognition.lang = "te-IN";

        } else {

            recognition.lang = "en-IN";

        }

        recognition.start();

        voiceBtn.classList.add("listening");


        if (currentLanguage === "te") {

            voiceStatus.textContent =
                "వింటున్నాను... మాట్లాడండి";

            document.getElementById("voiceText").textContent =
                "మాట్లాడండి";

        } else {

            voiceStatus.textContent =
                "Listening... Please speak";

            document.getElementById("voiceText").textContent =
                "Listening...";

        }

    });


    // Voice result

    recognition.onresult = function (event) {

        const transcript =
            event.results[0][0].transcript;

        complaintText.value =
            transcript;

        voiceBtn.classList.remove("listening");


        if (currentLanguage === "te") {

            voiceStatus.textContent =
                "వాయిస్ నమోదు చేయబడింది ✓";

            document.getElementById("voiceText").textContent =
                "మళ్లీ మాట్లాడండి";

        } else {

            voiceStatus.textContent =
                "Voice recorded ✓";

            document.getElementById("voiceText").textContent =
                "Tap & Speak";

        }

    };


    // Voice ended

    recognition.onend = function () {

        voiceBtn.classList.remove("listening");

    };


    // Voice error

    recognition.onerror = function () {

        voiceBtn.classList.remove("listening");


        if (currentLanguage === "te") {

            voiceStatus.textContent =
                "వాయిస్ నమోదు కాలేదు. మళ్లీ ప్రయత్నించండి.";

        } else {

            voiceStatus.textContent =
                "Could not hear you. Please try again.";

        }

    };


} else {

    // Browser doesn't support speech recognition

    voiceBtn.addEventListener("click", function () {

        if (currentLanguage === "te") {

            voiceStatus.textContent =
                "మీ బ్రౌజర్ వాయిస్ ఇన్‌పుట్‌కు మద్దతు ఇవ్వదు.";

        } else {

            voiceStatus.textContent =
                "Your browser does not support voice input.";

        }

    });

}


// ========================================
// PHOTO UPLOAD
// ========================================

const photoInput =
    document.getElementById("photoInput");

const photoPreview =
    document.getElementById("photoPreview");

let selectedPhoto = null;


photoInput.addEventListener("change", function () {

    const file =
        photoInput.files[0];


    if (!file) {

        selectedPhoto = null;

        photoPreview.innerHTML = "";

        return;
    }


    // Store selected photo

    selectedPhoto = file;


    // Show preview

    const reader =
        new FileReader();


    reader.onload = function (event) {

        photoPreview.innerHTML = `
            <img
                src="${event.target.result}"
                alt="Complaint Photo"
            >
        `;

    };


    reader.readAsDataURL(file);

});


// ========================================
// LOCATION
// ========================================

const locationBtn =
    document.getElementById("locationBtn");

const locationStatus =
    document.getElementById("locationStatus");


let complaintLatitude = null;

let complaintLongitude = null;

let complaintLocation = null;


locationBtn.addEventListener("click", function () {

    if (!navigator.geolocation) {

        locationStatus.textContent =
            currentLanguage === "te"
                ? "మీ బ్రౌజర్ లొకేషన్‌కు మద్దతు ఇవ్వదు."
                : "Your browser does not support location.";

        return;
    }


    locationStatus.textContent =
        currentLanguage === "te"
            ? "మీ స్థానాన్ని కనుగొంటున్నాము..."
            : "Finding your location...";


    navigator.geolocation.getCurrentPosition(

        async function (position) {

            complaintLatitude =
                position.coords.latitude;

            complaintLongitude =
                position.coords.longitude;


            try {

                const response =
                    await fetch(
                        `https://nirmal-grama-backend.onrender.com/api/location?lat=${complaintLatitude}&lon=${complaintLongitude}`
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Location lookup failed"
                    );

                }


                // Save readable address

                complaintLocation =
                    data.address;


                // Display address to citizen

                locationStatus.textContent =
                    "📍 " + data.displayName;


            } catch (error) {

                console.error(
                    "Location error:",
                    error
                );


                complaintLocation =
                    null;


                locationStatus.textContent =
                    currentLanguage === "te"
                        ? "చిరునామాను పొందలేకపోయాము. మళ్లీ ప్రయత్నించండి."
                        : "Could not find your address. Please try again.";

            }

        },


        function (error) {

            console.error(
                "Geolocation error:",
                error
            );


            locationStatus.textContent =
                currentLanguage === "te"
                    ? "స్థానాన్ని పొందలేకపోయాము. మళ్లీ ప్రయత్నించండి."
                    : "Could not get your location. Please try again.";

        }

    );

});


// ========================================
// SUBMIT COMPLAINT
// ========================================

const submitComplaint =
    document.getElementById("submitComplaint");


submitComplaint.addEventListener("click", async function () {

    // ========================================
    // CHECK CATEGORY
    // ========================================

    if (!selectedCategory) {

        alert(
            currentLanguage === "te"
                ? "దయచేసి సమస్యను ఎంచుకోండి."
                : "Please select the problem."
        );

        return;
    }


    // ========================================
    // CHECK COMPLAINT TEXT
    // ========================================

    const complaintDescription =
        complaintText.value.trim();


    if (!complaintDescription) {

        alert(
            currentLanguage === "te"
                ? "దయచేసి మీ సమస్యను చెప్పండి లేదా టైప్ చేయండి."
                : "Please tell us about your problem or type it."
        );

        return;
    }


    // ========================================
    // CHECK LOCATION
    // ========================================

    if (!complaintLocation) {

        alert(
            currentLanguage === "te"
                ? "దయచేసి మీ స్థానాన్ని జోడించండి."
                : "Please add your location."
        );

        return;
    }


    // ========================================
    // PREVENT MULTIPLE CLICKS
    // ========================================

    submitComplaint.disabled = true;


    submitComplaint.querySelector(
        "span:last-child"
    ).textContent =
        currentLanguage === "te"
            ? "పంపుతోంది..."
            : "SENDING...";


    try {

        // ========================================
        // CONVERT PHOTO TO BASE64
        // ========================================

        let photoBase64 = "";


        if (selectedPhoto) {

            photoBase64 =
                await new Promise((resolve, reject) => {

                    const reader =
                        new FileReader();


                    reader.onload = function () {

                        resolve(
                            reader.result
                        );

                    };


                    reader.onerror = function () {

                        reject(
                            new Error(
                                "Failed to read photo"
                            )
                        );

                    };


                    reader.readAsDataURL(
                        selectedPhoto
                    );

                });

        }


        // ========================================
        // SEND COMPLAINT TO BACKEND
        // ========================================

        const response =
    await fetch(
        "https://nirmal-grama-backend.onrender.com/api/complaints",
        {
            method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },


                    body: JSON.stringify({

                        citizenMobile:
                            localStorage.getItem(
                                "citizenMobile"
                            ),


                        category:
                            selectedCategory,


                        description:
                            complaintDescription,


                        // PHOTO

                        photo:
                            photoBase64,


                        // LOCATION

                        location: {

                            houseNumber:
                                complaintLocation.house_number ||
                                "",


                            street:
                                complaintLocation.road ||
                                complaintLocation.residential ||
                                "",


                            village:
                                complaintLocation.village ||
                                complaintLocation.town ||
                                complaintLocation.city ||
                                complaintLocation.municipality ||
                                "",


                            mandal:
                                complaintLocation.county ||
                                "",


                            district:
                                complaintLocation.state_district ||
                                complaintLocation.district ||
                                "",


                            pincode:
                                complaintLocation.postcode ||
                                ""

                        }

                    })

                }
            );


        // ========================================
        // READ RESPONSE
        // ========================================

        const data =
            await response.json();


        if (!response.ok) {

            console.error(
                "BACKEND ERROR:",
                data
            );


            throw new Error(
                data.error ||
                data.message ||
                "Failed to submit complaint"
            );

        }


        // ========================================
        // COMPLAINT SUCCESSFULLY SAVED
        // ========================================

        const complaintId =
            data.complaint.complaintId;


        // Save latest complaint ID

        localStorage.setItem(
            "latestComplaintId",
            complaintId
        );


        // Show Complaint ID

        document.getElementById(
            "complaintIdDisplay"
        ).textContent =
            complaintId;


        // Show success modal

        document.getElementById(
            "successModal"
        ).classList.add("show");


    } catch (error) {

        console.error(
            "Complaint submission error:",
            error
        );


        alert(
            currentLanguage === "te"
                ? "ఫిర్యాదును పంపలేకపోయాము. దయచేసి మళ్లీ ప్రయత్నించండి."
                : "Could not submit complaint. Please try again."
        );


    } finally {

        // Enable button again

        submitComplaint.disabled =
            false;


        submitComplaint.querySelector(
            "span:last-child"
        ).textContent =
            currentLanguage === "te"
                ? "ఫిర్యాదును పంపండి"
                : "SEND COMPLAINT";

    }

});


// ========================================
// TRACK COMPLAINT
// ========================================

document.getElementById(
    "trackComplaintBtn"
).addEventListener("click", function () {

    const complaintId =
        document.getElementById(
            "complaintIdDisplay"
        ).textContent;


    localStorage.setItem(
        "trackComplaintId",
        complaintId
    );


    window.location.href =
        "../track/track.html";

});


// ========================================
// GO TO DASHBOARD
// ========================================

document.getElementById(
    "dashboardBtn"
).addEventListener("click", function () {

    window.location.href =
        "../dashboard/citizen-dashboard.html";

});


// ========================================
// INITIAL LANGUAGE
// ========================================

changeLanguage("en");