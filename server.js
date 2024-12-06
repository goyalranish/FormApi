document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'YOUR_API_KEY';
    const clientId = 'YOUR_CLIENT_ID';
    const spreadsheetId = 'YOUR_SPREADSHEET_ID';

    const form = document.getElementById('form');
    const nameInput = document.getElementById('name');
    const courseSelect = document.getElementById('courseSelect');
    const degreeSelect = document.getElementById('degreeSelect');
    const yearSelect = document.getElementById('yearSelect');
    const semesterSelect = document.getElementById('semesterSelect');

    // Add degree options
    const degreeOptions = [
        { value: "", text: "Select a degree" },
        { value: "Bachelor's", text: "Bachelor's" },
        { value: "Master's", text: "Master's" },
        { value: "PhD", text: "PhD" },
        { value: "Associate's", text: "Associate's" },
        { value: "Certificate", text: "Certificate" }
    ];

    degreeOptions.forEach(option => {
        const degreeOption = document.createElement("option");
        degreeOption.value = option.value;
        degreeOption.text = option.text;
        degreeSelect.appendChild(degreeOption);
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = nameInput.value;
        const course = courseSelect.value;
        const degree = degreeSelect.value;
        const year = yearSelect.value;
        const semester = semesterSelect.value;

        const data = [
            [name, course, degree, year, semester]
        ];

        gapi.load('client:auth2', initClient);

        function initClient() {
            gapi.client.init({
                apiKey: apiKey,
                clientId: clientId,
                discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
                scope: "https://www.googleapis.com/auth/spreadsheets"
            }).then(function () {
                return gapi.auth2.getAuthInstance().signIn();
            }).then(function () {
                return gapi.client.sheets.spreadsheets.values.append({
                    spreadsheetId: spreadsheetId,
                    range: 'Sheet1!A1:E1',
                    valueInputOption: 'USER_ENTERED',
                    resource: {
                        values: data
                    }
                });
            }).then(function(response) {
                console.log("Data saved to Google Sheets: " + response.result.updates.updatedRange);
                document.getElementById('response').textContent = 'Form submitted and data saved to Google Sheets!';
                form.reset();
            }, function(error) {
                console.error("Error: " + error);
            });
        }
    });
});
