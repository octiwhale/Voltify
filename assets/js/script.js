document.addEventListener("DOMContentLoaded", function() {
    const batteryTypeSelect = document.querySelector(".battery-type");
    const voltageInput = document.querySelector("input[type='number']");
    const saveTypeBtn = document.getElementById("save-type-btn");
    const continueTypeBtn = document.getElementById("type-btn");
    const completeBtn = document.getElementById("complete-btn");
    const changeTypeBtn = document.getElementById("change-type-btn");
    const currentVoltage = document.getElementById("current-voltage-txt");
    const shareResultBtn = document.getElementById("share-result-btn");
    const restartBtn = document.getElementById("restart-btn");

    const batteryTypeCard = document.getElementById("battery-type-card");
    const batteryVoltageCard = document.getElementById("battery-voltage-card");
    const batteryResultCard = document.getElementById("battery-result-card");

    const summaryResultTxt = document.getElementById("summary-result-txt");
    const percentageResultTxt = document.getElementById("percentage-result-txt");
    const descriptionResultTxt = document.getElementById("description-result-txt");
    const resultProgress = document.querySelector(".progress-bar");

    let batteryType;

    // Generate the battery data dynamically
    function generateBatteryData(pack) {
        let counter = 0;
        let vCurrent = 3.000;
        const vIncrement = 0.012;
        const batteryData = [];
        while (counter <= 100) {
            batteryData.push({
                volts: parseFloat((vCurrent * pack).toFixed(2)),
                percentage: counter
            });
            vCurrent += vIncrement;
            counter++;
        }
        return batteryData;
    }

    const batteryData = {
        "36": generateBatteryData(10),
        "48": generateBatteryData(13),
        "52": generateBatteryData(14),
        "60": generateBatteryData(16),
        "72": generateBatteryData(20)
    };

    // Function to save battery type to localStorage
    function saveBatteryType(type, save) {
        batteryType = type;

        if (save) {
            localStorage.setItem("batteryType", type);
        }
    }

    // Function to get battery type from localStorage
    function getBatteryType() {
        return batteryType || localStorage.getItem("batteryType");
    }

    // Function to display the appropriate card based on battery type
    function displayCard() {
        batteryType = getBatteryType();
        if (batteryType) {
            batteryTypeCard.classList.add("d-none");
            batteryVoltageCard.classList.remove("d-none");
            currentVoltage.textContent = `(${batteryType}v)`; // Set the battery type as the current voltage
        } else {
            batteryTypeCard.classList.remove("d-none");
            batteryVoltageCard.classList.add("d-none");
        }
        batteryResultCard.classList.add("d-none");
    }

    // Function to calculate the charge percentage based on voltage
    function calculatePercentage(voltage) {
        const batteryType = getBatteryType();
        if (!batteryType || !batteryData[batteryType]) return 0;

        const data = batteryData[batteryType];
        for (let i = 0; i < data.length - 1; i++) {
            if (voltage >= data[i].volts && voltage < data[i + 1].volts) {
                return data[i].percentage;
            }
        }
        return voltage >= data[data.length - 1].volts ? 100 : 0; // Return 100% if voltage is above the max value, 0% if below the min value
    }

    // Function to display the result
    function displayResult(percentage) {
        percentageResultTxt.textContent = `${percentage}%`;
        resultProgress.style.width = `${percentage}%`;
        resultProgress.setAttribute("aria-valuenow", percentage);
        resultProgress.textContent = `${percentage}%`; // Update the label inside the progress bar

        if (percentage === 100) {
            resultProgress.classList.remove("bg-warning", "bg-danger");
            resultProgress.classList.add("bg-success");
            summaryResultTxt.textContent = "Fully charged";
            descriptionResultTxt.textContent = "Your battery is fully charged. You're ready to go!";
        } else if (percentage > 90) {
            resultProgress.classList.remove("bg-warning", "bg-danger");
            resultProgress.classList.add("bg-success");
            summaryResultTxt.textContent = "Almost Full";
            descriptionResultTxt.textContent = "Your battery is almost fully charged. You can go for a long ride with confidence.";
        } else if (percentage > 75) {
            resultProgress.classList.remove("bg-warning", "bg-danger");
            resultProgress.classList.add("bg-success");
            summaryResultTxt.textContent = "Fully charged";
            descriptionResultTxt.textContent = "Your battery is in excellent condition with a high charge. You're ready to go!";
        } else if (percentage > 60) {
            resultProgress.classList.remove("bg-success", "bg-danger");
            resultProgress.classList.add("bg-warning");
            summaryResultTxt.textContent = "High charge";
            descriptionResultTxt.textContent = "Your battery has a high charge. Suitable for long rides.";
        } else if (percentage > 50) {
            resultProgress.classList.remove("bg-success", "bg-danger");
            resultProgress.classList.add("bg-warning");
            summaryResultTxt.textContent = "Moderately charged";
            descriptionResultTxt.textContent = "Your battery has a decent amount of charge. It's good for a medium-distance ride.";
        } else if (percentage > 40) {
            resultProgress.classList.remove("bg-success", "bg-danger");
            resultProgress.classList.add("bg-warning");
            summaryResultTxt.textContent = "Medium charge";
            descriptionResultTxt.textContent = "Your battery is at a medium charge level. Consider recharging if you plan a long ride.";
        } else if (percentage > 30) {
            resultProgress.classList.remove("bg-success", "bg-danger");
            resultProgress.classList.add("bg-warning");
            summaryResultTxt.textContent = "Low-medium charge";
            descriptionResultTxt.textContent = "Your battery is starting to get low. A recharge soon would be a good idea.";
        } else if (percentage > 20) {
            resultProgress.classList.remove("bg-success", "bg-warning");
            resultProgress.classList.add("bg-danger");
            summaryResultTxt.textContent = "Low charge";
            descriptionResultTxt.textContent = "Your battery charge is low. Consider recharging soon to avoid running out of power.";
        } else if (percentage > 10) {
            resultProgress.classList.remove("bg-success", "bg-warning");
            resultProgress.classList.add("bg-danger");
            summaryResultTxt.textContent = "Very low charge";
            descriptionResultTxt.textContent = "Your battery charge is very low. Recharge immediately to avoid running out of power.";
        } else {
            resultProgress.classList.remove("bg-success", "bg-warning");
            resultProgress.classList.add("bg-danger");
            summaryResultTxt.textContent = "Critical charge";
            descriptionResultTxt.textContent = "Your battery is critically low. Recharge now to prevent losing power.";
        }
    }

    // Disable/enable the continue + save button if no battery type is selected
    function checkBatteryType() {
        const batteryType = batteryTypeSelect.value;
        saveTypeBtn.disabled = !batteryType;
        continueTypeBtn.disabled = !batteryType;
    }

    // Event listener for battery type select
    batteryTypeSelect.addEventListener("change", checkBatteryType);

    // Event listener for save type button
    saveTypeBtn.addEventListener("click", function() {
        const batteryType = batteryTypeSelect.value;
        if (batteryType) {
            saveBatteryType(batteryType, true);
            displayCard();
        } else {
            // Use Bootstrap form validation
            batteryTypeSelect.classList.add("is-invalid");
        }
    });

    // Event listener for continue button (w/o saving)
    continueTypeBtn.addEventListener("click", function() {
        const batteryType = batteryTypeSelect.value;
        if (batteryType) {
            saveBatteryType(batteryType, false);
            displayCard();
        } else {
            // Use Bootstrap form validation
            batteryTypeSelect.classList.add("is-invalid");
        }
    });

    // Event listener for complete button
    completeBtn.addEventListener("click", function() {
        const voltage = parseFloat(voltageInput.value);
        if (isNaN(voltage) || voltage <= 0) {
            // Use Bootstrap form validation
            voltageInput.classList.add("is-invalid");
        } else {
            voltageInput.classList.remove("is-invalid");
            const percentage = calculatePercentage(voltage);
            displayResult(percentage);
            batteryVoltageCard.classList.add("d-none");
            batteryResultCard.classList.remove("d-none");
        }
    });

    // Event listener for change type button
    changeTypeBtn.addEventListener("click", function() {
        localStorage.removeItem("batteryType");
        batteryType = null;
        displayCard();
    });

    // Event listener for restart button
    restartBtn.addEventListener("click", function() {
        displayCard();
        voltageInput.value = '';
    });

    // Check if share feature is supported
    if (!navigator.share) {
        shareResultBtn.classList.add("d-none");
        restartBtn.classList.remove("btn-primary");
        restartBtn.classList.add("btn-success");
    }

    // Event listener for share button
    shareResultBtn.addEventListener("click", function() {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: "Battery Charge Calculator",
                text: "Check the charge percentage of your battery",
                url: url
            }).then(() => {
                console.log("Successfully shared");
            }).catch((error) => {
                console.error("Error sharing:", error);
            });
        } else {
            alert("Share feature is not supported on this browser.");
        }
    });

    // Function to handle Enter key for moving between input fields
    voltageInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            completeBtn.click();
        }
    });

    // Initialize the page
    displayCard();
});
