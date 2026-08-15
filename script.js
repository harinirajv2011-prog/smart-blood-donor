const bloodForm = document.getElementById("blood-request-form");

if (bloodForm) {

    bloodForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const patientName =
            document.getElementById("patient-name").value;

        const bloodGroup =
            document.getElementById("blood-group").value;

        const location =
            document.getElementById("location").value;

        const hospital =
            document.getElementById("hospital").value;

        const units =
            document.getElementById("units").value;

        const urgency =
            document.getElementById("urgency").value;


        if (
            patientName === "" ||
            bloodGroup === "" ||
            location === "" ||
            hospital === "" ||
            units === "" ||
            urgency === ""
        ) {

            alert("Please fill in all the details.");

            return;
        }


        const bloodRequest = {
            patientName: patientName,
            bloodGroup: bloodGroup,
            location: location,
            hospital: hospital,
            units: units,
            urgency: urgency
        };


        localStorage.setItem(
            "bloodRequest",
            JSON.stringify(bloodRequest)
        );


        fetch("https://smart-blood-donor-sl8b.onrender.com/api/requests", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                patient_name: patientName,
                blood_group: bloodGroup,
                city: location,
                units_needed: Number(units)
            })
        })

        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to create blood request");
            }

            return response.json();

        })

        .then(data => {

            console.log("Blood request created:", data);

            window.location.href = "matching-results.html";

        })

        .catch(error => {

            console.error(error);

            alert(
                "Unable to create blood request. " +
                "Please make sure the backend is running."
            );

        });

    });

}
const donorForm = document.getElementById("donor-form");

if (donorForm) {

    donorForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const donorName =
            document.getElementById("donor-name").value;

        const donorAge =
            document.getElementById("donor-age").value;

        const donorBlood =
            document.getElementById("donor-blood").value;

        const donorLocation =
            document.getElementById("donor-location").value;

        const donorPhone =
            document.getElementById("donor-phone").value;

        const lastDonation =
            document.getElementById("last-donation").value;

        const availability =
            document.getElementById("availability").value;


        if (
            donorName === "" ||
            donorAge === "" ||
            donorBlood === "" ||
            donorLocation === "" ||
            donorPhone === "" ||
            lastDonation === "" ||
            availability === ""
        ) {

            alert("Please fill in all the details.");

            return;
        }


        const donor = {
            name: donorName,
            age: donorAge,
            bloodGroup: donorBlood,
            location: donorLocation,
            phone: donorPhone,
            lastDonation: lastDonation,
            availability: availability
        };


        fetch("https://smart-blood-donor-sl8b.onrender.com/api/donors", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: donorName,
                age: Number(donorAge),
                blood_group: donorBlood,
                phone: donorPhone,
                city: donorLocation
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to register donor");
            }

            return response.json();
        })
        .then(data => {
            alert("Donor registered successfully!");
        })
        .catch(error => {
            console.error(error);
            alert("Unable to register donor. Please make sure the backend is running.");
        });

    });

}   // THIS WAS MISSING


const donorResults = document.getElementById("donor-results");
const matchingTitle = document.getElementById("matching-title");

if (donorResults) {

    const bloodRequest =
        JSON.parse(localStorage.getItem("bloodRequest"));

    donorResults.innerHTML = "";

    if (!bloodRequest) {

        donorResults.innerHTML =
            "<p>No blood request found.</p>";

    } else {

        fetch(
            "https://smart-blood-donor-sl8b.onrender.com/api/match?blood_group=" +
            encodeURIComponent(bloodRequest.bloodGroup) +
            "&city=" +
            encodeURIComponent(bloodRequest.location)
        )

        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to fetch matching donors");
            }

            return response.json();

        })

        .then(data => {

            const matchedDonors = data.matching_donors;

            localStorage.setItem(
                "matchingDonorCount",
                matchedDonors.length
            );

            if (matchingTitle) {

                matchingTitle.textContent =
                    matchedDonors.length +
                    " Matching Donors Found";

            }


            if (matchedDonors.length === 0) {

                donorResults.innerHTML =
                    "<p>No matching donors found.</p>";

                return;
            }


            matchedDonors.forEach(function(donor) {

                let score = 70;

                if (
                    donor.city.toLowerCase() ===
                    bloodRequest.location.toLowerCase()
                ) {
                    score += 20;
                }



                donorResults.innerHTML += `

                    <div class="donor-card">

                        <h3>${donor.name}</h3>

                        <p>
                            <strong>Blood Group:</strong>
                            ${donor.blood_group}
                        </p>

                        <p>
                            <strong>Location:</strong>
                            ${donor.city}
                        </p>

                        <p>
                            <strong>Availability:</strong>
                            Available
                        </p>

                        <div class="match-score">
                            Match Score: ${score}%
                        </div>

                        <button onclick="sendBloodRequest()">
                            Contact Donor
                        </button>

                    </div>

                `;

            });

        })

        .catch(error => {

            console.error(error);

            donorResults.innerHTML =
                "<p>Unable to find donors. Please make sure the backend is running.</p>";

        });

    }

}


function sendBloodRequest() {

    alert(
        "Blood request sent successfully!\n\n" +
        "The donor has been notified."
    );

}


const summaryPatient = document.getElementById("summary-patient");

if (summaryPatient) {

    const bloodRequest =
        JSON.parse(localStorage.getItem("bloodRequest"));

    if (bloodRequest) {

        document.getElementById("summary-patient").textContent =
            bloodRequest.patientName;

        document.getElementById("summary-blood").textContent =
            bloodRequest.bloodGroup;

        document.getElementById("summary-location").textContent =
            bloodRequest.location;

        document.getElementById("summary-hospital").textContent =
            bloodRequest.hospital;

        document.getElementById("summary-units").textContent =
            bloodRequest.units;

        document.getElementById("summary-urgency").textContent =
            bloodRequest.urgency;

    }

}


const dashboard = document.getElementById("total-donors");

if (dashboard) {

    const donors =
        JSON.parse(localStorage.getItem("donors")) || [];

    const totalDonors = donors.length;

    const availableDonors =
        donors.filter(function(donor) {
            return donor.availability === "Available";
        }).length;


    document.getElementById("total-donors").textContent =
        totalDonors;

    document.getElementById("available-donors").textContent =
        availableDonors;


    const bloodGroups = {};

    donors.forEach(function(donor) {

        if (bloodGroups[donor.bloodGroup]) {

            bloodGroups[donor.bloodGroup]++;

        } else {

            bloodGroups[donor.bloodGroup] = 1;

        }

    });


    const bloodGroupList =
        document.getElementById("blood-group-list");

    bloodGroupList.innerHTML = "";


    for (const group in bloodGroups) {

        bloodGroupList.innerHTML += `
            <div class="donor-card">

                <h3>${group}</h3>

                <p>
                    ${bloodGroups[group]} Donor(s) Available
                </p>

            </div>
        `;

    }

}


const bloodRequest =
    JSON.parse(localStorage.getItem("bloodRequest"));

const totalRequests = bloodRequest ? 1 : 0;

const requestCount =
    document.getElementById("total-requests");

if (requestCount) {
    requestCount.textContent = totalRequests;
}


const matchingDonorCount =
    localStorage.getItem("matchingDonorCount") || 0;

const matchingCount =
    document.getElementById("matching-donors");

if (matchingCount) {
    matchingCount.textContent = matchingDonorCount;
}
