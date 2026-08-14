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
        window.location.href = "matching-results.html";

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


let donors = JSON.parse(localStorage.getItem("donors")) || [];

donors.push(donor);

localStorage.setItem("donors", JSON.stringify(donors));


alert("Donor registered successfully!");

    });

}
const donorResults = document.getElementById("donor-results");
const matchingTitle = document.getElementById("matching-title");

if (donorResults) {

    const donors =
        JSON.parse(localStorage.getItem("donors")) || [];

    const bloodRequest =
        JSON.parse(localStorage.getItem("bloodRequest"));

    donorResults.innerHTML = "";

    if (!bloodRequest) {

        donorResults.innerHTML =
            "<p>No blood request found.</p>";

    } else {

        const matchedDonors = donors.filter(function(donor) {

            return (
                donor.bloodGroup === bloodRequest.bloodGroup &&
                donor.availability === "Available"
            );

        });
        localStorage.setItem(
    "matchingDonorCount",
    matchedDonors.length
);
        if (matchingTitle) {
    matchingTitle.textContent =
        matchedDonors.length + " Matching Donors Found";
}
matchedDonors.sort(function(a, b) {

    let scoreA = 70;
    let scoreB = 70;

    if (
        a.location.toLowerCase() ===
        bloodRequest.location.toLowerCase()
    ) {
        scoreA += 20;
    }

    if (
        b.location.toLowerCase() ===
        bloodRequest.location.toLowerCase()
    ) {
        scoreB += 20;
    }

    if (a.availability === "Available") {
        scoreA += 10;
    }

    if (b.availability === "Available") {
        scoreB += 10;
    }

    return scoreB - scoreA;
});

        if (matchedDonors.length === 0) {

            donorResults.innerHTML =
                "<p>No matching donors found.</p>";

        } else {

            matchedDonors.forEach(function(donor) {

                let score = 70;

                if (
                    donor.location.toLowerCase() ===
                    bloodRequest.location.toLowerCase()
                ) {
                    score += 20;
                }

                if (donor.availability === "Available") {
                    score += 10;
                }


                donorResults.innerHTML += `
                    <div class="donor-card">

                        <h3>${donor.name}</h3>

                        <p>
                            <strong>Blood Group:</strong>
                            ${donor.bloodGroup}
                        </p>

                        <p>
                            <strong>Location:</strong>
                            ${donor.location}
                        </p>

                        <p>
                            <strong>Availability:</strong>
                            ${donor.availability}
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

        }

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