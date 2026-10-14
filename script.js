/* =========================================================
   NEURAL NEXUS
   AI ENERGY WASTE DETECTIVE
   COMPLETE FRONTEND JAVASCRIPT
========================================================= */


/* =========================================================
   GLOBAL DATA
========================================================= */

let selectedSector = "home";
let selectedSubSector = "";
let inputMethod = "manual";

let energyData = [];

let chartInstance = null;

let currentChartPeriod = "daily";

let settings = {
    tariff: 8,
    carbonFactor: 0.82
};


/* =========================================================
   SECTOR INFORMATION
========================================================= */

const sectorInfo = {

    home: {
        name: "Home",
        icon: "🏠",
        subs: []
    },

    industry: {
        name: "Industries",
        icon: "🏭",
        subs: [
            "Hardware Industries",
            "Software Industries"
        ]
    },

    commercial: {
        name: "Commercial",
        icon: "🏢",
        subs: [
            "Banking",
            "General Shop",
            "Shopping Mall",
            "Jewellery Shop"
        ]
    },

    healthcare: {
        name: "Healthcare",
        icon: "🏥",
        subs: []
    },

    education: {
        name: "Education",
        icon: "🎓",
        subs: []
    }

};


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active-page");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    updateSidebar(pageId);

    if (pageId === "dashboard") {
        updateDashboard();
    }

    if (pageId === "analysis") {
        renderAnalysis();
    }

    if (pageId === "insights") {
        renderFullInsights();
    }

    if (pageId === "reports") {
        renderReports();
    }
}


/* =========================================================
   SIDEBAR ACTIVE STATE
========================================================= */

function updateSidebar(pageId) {

    document.querySelectorAll(".sidebar-menu button").forEach(button => {
        button.classList.remove("active");
    });

    const pageMap = {
        dashboard: "Overview",
        input: "Energy Input",
        analysis: "Energy Analysis",
        insights: "AI Insights",
        reports: "Reports",
        settings: "Settings"
    };

    const targetText = pageMap[pageId];

    if (!targetText) return;

    document.querySelectorAll(".sidebar-menu button").forEach(button => {

        if (button.textContent.includes(targetText)) {
            button.classList.add("active");
        }

    });
}


/* =========================================================
   MOBILE MENU
========================================================= */

function toggleMobileMenu() {

    const menu = document.getElementById("mobileMenu");

    menu.classList.toggle("show");
}


/* =========================================================
   HOME
========================================================= */

function scrollToSectors() {

    const section = document.getElementById("sectorSection");

    section.scrollIntoView({
        behavior: "smooth"
    });
}


function showHowItWorks() {

    document.getElementById("howModal").classList.add("show");
}


function closeHowItWorks() {

    document.getElementById("howModal").classList.remove("show");
}


/* =========================================================
   SELECT SECTOR
========================================================= */

function selectSector(sector) {

    selectedSector = sector;

    selectedSubSector = "";

    const info = sectorInfo[sector];

    document.getElementById("selectedSectorIcon").textContent =
        info.icon;

    document.getElementById("selectedSectorName").textContent =
        info.name;

    renderSubOptions();

    showPage("input");

    showToast(`${info.name} sector selected`);
}


/* =========================================================
   SUB OPTIONS
========================================================= */

function renderSubOptions() {

    const container = document.getElementById("subOptions");

    container.innerHTML = "";

    const subs = sectorInfo[selectedSector].subs;

    if (!subs.length) {
        return;
    }

    subs.forEach((sub, index) => {

        const button = document.createElement("button");

        button.className = "sub-option";

        if (index === 0) {
            button.classList.add("active");
            selectedSubSector = sub;
        }

        button.textContent = sub;

        button.onclick = () => {

            document
                .querySelectorAll(".sub-option")
                .forEach(btn =>
                    btn.classList.remove("active")
                );

            button.classList.add("active");

            selectedSubSector = sub;

            showToast(`${sub} selected`);
        };

        container.appendChild(button);

    });
}


/* =========================================================
   INPUT METHOD
========================================================= */

function changeInputMethod(method) {

    inputMethod = method;

    document
        .querySelectorAll(".method-btn")
        .forEach(button =>
            button.classList.remove("active")
        );

    if (method === "manual") {

        document
            .querySelectorAll(".method-btn")[0]
            .classList.add("active");

        document
            .getElementById("manualInput")
            .classList.remove("hidden");

        document
            .getElementById("csvInput")
            .classList.add("hidden");

        document
            .getElementById("demoInput")
            .classList.add("hidden");

    }

    if (method === "csv") {

        document
            .querySelectorAll(".method-btn")[1]
            .classList.add("active");

        document
            .getElementById("manualInput")
            .classList.add("hidden");

        document
            .getElementById("csvInput")
            .classList.remove("hidden");

        document
            .getElementById("demoInput")
            .classList.add("hidden");

    }

    if (method === "demo") {

        document
            .querySelectorAll(".method-btn")[2]
            .classList.add("active");

        document
            .getElementById("manualInput")
            .classList.add("hidden");

        document
            .getElementById("csvInput")
            .classList.add("hidden");

        document
            .getElementById("demoInput")
            .classList.remove("hidden");

    }
}


/* =========================================================
   LIVE CALCULATION
========================================================= */

const formInputs = [
    "wattage",
    "quantity",
    "hours",
    "tariff"
];

formInputs.forEach(id => {

    const element = document.getElementById(id);

    if (element) {

        element.addEventListener("input", calculatePreview);

    }

});


function calculatePreview() {

    const wattage =
        Number(document.getElementById("wattage").value) || 0;

    const quantity =
        Number(document.getElementById("quantity").value) || 0;

    const hours =
        Number(document.getElementById("hours").value) || 0;

    const tariff =
        Number(document.getElementById("tariff").value) || 0;


    const daily =
        wattage *
        quantity *
        hours /
        1000;


    const monthly =
        daily * 30;


    const cost =
        monthly * tariff;


    document.getElementById("dailyResult").textContent =
        `${daily.toFixed(2)} kWh`;

    document.getElementById("monthlyResult").textContent =
        `${monthly.toFixed(2)} kWh`;

    document.getElementById("costResult").textContent =
        `₹ ${cost.toFixed(2)}`;
}


/* =========================================================
   FORM SUBMIT
========================================================= */

document
    .getElementById("energyForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const name =
            document.getElementById("equipmentName").value.trim();

        const wattage =
            Number(document.getElementById("wattage").value);

        const quantity =
            Number(document.getElementById("quantity").value);

        const hours =
            Number(document.getElementById("hours").value);

        const tariff =
            Number(document.getElementById("tariff").value);


        if (!name) {
            showToast("Please enter equipment name");
            return;
        }

        if (wattage <= 0) {
            showToast("Wattage must be greater than 0");
            return;
        }

        if (quantity <= 0) {
            showToast("Quantity must be greater than 0");
            return;
        }

        if (hours <= 0 || hours > 24) {
            showToast("Usage hours must be between 0 and 24");
            return;
        }

        if (tariff < 0) {
            showToast("Tariff cannot be negative");
            return;
        }


        addEquipment({
            name,
            wattage,
            quantity,
            hours,
            tariff,
            source: "User Entered"
        });


        clearForm();

        showToast("Equipment added successfully");

    });


/* =========================================================
   ADD EQUIPMENT
========================================================= */

function addEquipment(item) {

    const dailyKwh =
        item.wattage *
        item.quantity *
        item.hours /
        1000;

    const monthlyKwh =
        dailyKwh * 30;

    const monthlyCost =
        monthlyKwh * item.tariff;


    energyData.push({

        id: Date.now() + Math.random(),

        name: item.name,

        wattage: item.wattage,

        quantity: item.quantity,

        hours: item.hours,

        tariff: item.tariff,

        dailyKwh,

        monthlyKwh,

        monthlyCost,

        source: item.source || "User Entered"

    });


    renderInputEquipment();

    updateDashboard();

    renderAnalysis();

    renderFullInsights();

    renderReports();

}


/* =========================================================
   CLEAR FORM
========================================================= */

function clearForm() {

    document.getElementById("equipmentName").value = "";

    document.getElementById("wattage").value = "";

    document.getElementById("quantity").value = "1";

    document.getElementById("hours").value = "";

    document.getElementById("tariff").value =
        settings.tariff;

    calculatePreview();
}


/* =========================================================
   INPUT EQUIPMENT LIST
========================================================= */

function renderInputEquipment() {

    const container =
        document.getElementById("inputEquipmentList");

    const count =
        document.getElementById("equipmentCount");

    const analyzeButton =
        document.getElementById("analyzeBtn");


    count.textContent =
        `${energyData.length} equipment added`;


    analyzeButton.disabled =
        energyData.length === 0;


    if (!energyData.length) {

        container.innerHTML = `
            <div class="empty-state">
                <span>⚡</span>
                <p>No equipment added yet.</p>
            </div>
        `;

        return;
    }


    container.innerHTML = "";


    energyData.forEach(item => {

        const row =
            document.createElement("div");

        row.className =
            "input-equipment-row";


        row.innerHTML = `

            <strong>${escapeHTML(item.name)}</strong>

            <span>${item.wattage} W</span>

            <span>${item.quantity} ×</span>

            <span>${item.hours} hrs/day</span>

            <button
                class="delete-item"
                onclick="deleteEquipment('${item.id}')">
                ×
            </button>

        `;


        container.appendChild(row);

    });

}


/* =========================================================
   DELETE EQUIPMENT
========================================================= */

function deleteEquipment(id) {

    energyData =
        energyData.filter(
            item => String(item.id) !== String(id)
        );

    renderInputEquipment();

    updateDashboard();

    renderAnalysis();

    renderFullInsights();

    renderReports();

    showToast("Equipment removed");
}


/* =========================================================
   CLEAR ALL
========================================================= */

function clearAllData() {

    if (!energyData.length) {
        showToast("No data to clear");
        return;
    }

    const confirmed =
        confirm("Clear all energy data?");

    if (!confirmed) return;

    energyData = [];

    renderInputEquipment();

    updateDashboard();

    renderAnalysis();

    renderFullInsights();

    renderReports();

    showToast("All energy data cleared");
}


/* =========================================================
   DEMO DATA
========================================================= */

function useDemoData() {

    inputMethod = "demo";

    energyData = [];

    const demo = getDemoData(selectedSector);

    demo.forEach(item => {

        addEquipment({
            ...item,
            source: "Demo Data"
        });

    });


    changeInputMethod("demo");

    showToast(
        "Demo data loaded. Values are sample estimates."
    );

}


/* =========================================================
   SECTOR DEMO DATA
========================================================= */

function getDemoData(sector) {

    const tariff = settings.tariff;


    if (sector === "home") {

        return [
            {
                name: "Air Conditioner",
                wattage: 1500,
                quantity: 1,
                hours: 6,
                tariff
            },
            {
                name: "Refrigerator",
                wattage: 180,
                quantity: 1,
                hours: 10,
                tariff
            },
            {
                name: "Ceiling Fan",
                wattage: 75,
                quantity: 3,
                hours: 8,
                tariff
            },
            {
                name: "LED Lighting",
                wattage: 9,
                quantity: 8,
                hours: 6,
                tariff
            }
        ];

    }


    if (sector === "industry") {

        return [
            {
                name: "Industrial Motor",
                wattage: 5000,
                quantity: 2,
                hours: 8,
                tariff
            },
            {
                name: "Production Machine",
                wattage: 3500,
                quantity: 2,
                hours: 7,
                tariff
            },
            {
                name: "HVAC System",
                wattage: 3000,
                quantity: 1,
                hours: 8,
                tariff
            },
            {
                name: "Office Computers",
                wattage: 250,
                quantity: 10,
                hours: 7,
                tariff
            }
        ];

    }


    if (sector === "commercial") {

        return [
            {
                name: "Air Conditioner",
                wattage: 1800,
                quantity: 5,
                hours: 8,
                tariff
            },
            {
                name: "Lighting",
                wattage: 20,
                quantity: 50,
                hours: 9,
                tariff
            },
            {
                name: "Computers",
                wattage: 200,
                quantity: 20,
                hours: 8,
                tariff
            },
            {
                name: "Refrigeration",
                wattage: 1200,
                quantity: 2,
                hours: 10,
                tariff
            }
        ];

    }


    if (sector === "healthcare") {

        return [
            {
                name: "HVAC System",
                wattage: 5000,
                quantity: 2,
                hours: 12,
                tariff
            },
            {
                name: "Medical Equipment",
                wattage: 1200,
                quantity: 3,
                hours: 8,
                tariff
            },
            {
                name: "Hospital Lighting",
                wattage: 25,
                quantity: 80,
                hours: 12,
                tariff
            },
            {
                name: "Computers",
                wattage: 250,
                quantity: 15,
                hours: 8,
                tariff
            }
        ];

    }


    if (sector === "education") {

        return [
            {
                name: "Classroom Fans",
                wattage: 75,
                quantity: 30,
                hours: 7,
                tariff
            },
            {
                name: "Classroom Lighting",
                wattage: 20,
                quantity: 100,
                hours: 7,
                tariff
            },
            {
                name: "Computer Lab",
                wattage: 200,
                quantity: 30,
                hours: 6,
                tariff
            },
            {
                name: "Laboratory Equipment",
                wattage: 500,
                quantity: 10,
                hours: 4,
                tariff
            }
        ];

    }


    return [];

}


/* =========================================================
   CSV UPLOAD
========================================================= */

function handleCSV(event) {

    const file =
        event.target.files[0];

    const message =
        document.getElementById("csvMessage");


    if (!file) return;


    if (!file.name.toLowerCase().endsWith(".csv")) {

        message.textContent =
            "Please select a valid CSV file.";

        return;
    }


    const reader =
        new FileReader();


    reader.onload = function(e) {

        try {

            const text =
                e.target.result;

            const rows =
                parseCSV(text);


            if (rows.length < 2) {

                throw new Error(
                    "CSV does not contain enough data."
                );

            }


            const headers =
                rows[0].map(
                    h => h.trim().toLowerCase()
                );


            const required = [
                "name",
                "wattage",
                "quantity",
                "hours",
                "tariff"
            ];


            const missing =
                required.filter(
                    column =>
                        !headers.includes(column)
                );


            if (missing.length) {

                throw new Error(
                    "Missing columns: " +
                    missing.join(", ")
                );

            }


            energyData = [];


            for (let i = 1; i < rows.length; i++) {

                const row = rows[i];

                if (row.length < headers.length) {
                    continue;
                }


                const get =
                    column =>
                        row[
                            headers.indexOf(column)
                        ]?.trim();


                const item = {

                    name: get("name"),

                    wattage:
                        Number(get("wattage")),

                    quantity:
                        Number(get("quantity")),

                    hours:
                        Number(get("hours")),

                    tariff:
                        Number(get("tariff")),

                    source: "Uploaded Data"

                };


                if (
                    !item.name ||
                    item.wattage <= 0 ||
                    item.quantity <= 0 ||
                    item.hours <= 0 ||
                    item.hours > 24 ||
                    item.tariff < 0
                ) {

                    continue;

                }


                addEquipment(item);

            }


            message.textContent =
                `${energyData.length} valid records imported.`;

            showToast("CSV uploaded successfully");

        } catch (error) {

            message.textContent =
                error.message;

            showToast(
                "CSV validation failed"
            );

        }

    };


    reader.readAsText(file);

}


/* =========================================================
   SIMPLE CSV PARSER
========================================================= */

function parseCSV(text) {

    return text
        .trim()
        .split(/\r?\n/)
        .map(line =>
            line.split(",").map(
                value =>
                    value
                        .trim()
                        .replace(/^"|"$/g, "")
            )
        );

}


/* =========================================================
   DASHBOARD CALCULATIONS
========================================================= */

function getTotals() {

    const daily =
        energyData.reduce(
            (sum, item) =>
                sum + item.dailyKwh,
            0
        );


    const monthly =
        energyData.reduce(
            (sum, item) =>
                sum + item.monthlyKwh,
            0
        );


    const cost =
        energyData.reduce(
            (sum, item) =>
                sum + item.monthlyCost,
            0
        );


    return {
        daily,
        weekly: daily * 7,
        monthly,
        cost
    };

}


/* =========================================================
   WASTE CALCULATION
========================================================= */

function calculateWaste() {

    if (!energyData.length) {
        return 0;
    }


    const total =
        energyData.reduce(
            (sum, item) =>
                sum + item.monthlyKwh,
            0
        );


    if (total <= 0) return 0;


    /*
       Rule-based estimate.

       Equipment using more than 30%
       of total monthly energy is treated
       as a possible high-consumption area.
    */

    const highUsage =
        energyData.filter(
            item =>
                item.monthlyKwh / total >= 0.30
        );


    if (!highUsage.length) {
        return 8;
    }


    let waste = 8 + highUsage.length * 4;

    if (waste > 35) {
        waste = 35;
    }

    return waste;

}


/* =========================================================
   POTENTIAL SAVINGS
========================================================= */

function calculatePotentialSavings() {

    const totals = getTotals();

    const waste =
        calculateWaste();

    return (
        totals.cost *
        (waste / 100) *
        0.65
    );

}


/* =========================================================
   UPDATE DASHBOARD
========================================================= */

function updateDashboard() {

    const totals =
        getTotals();


    document.getElementById("totalUsage").textContent =
        formatNumber(totals.monthly);


    document.getElementById("totalCost").textContent =
        formatMoney(totals.cost);


    document.getElementById("potentialSavings").textContent =
        formatMoney(
            calculatePotentialSavings()
        );


    document.getElementById("wastePercent").textContent =
        calculateWaste();


    renderEquipmentTable();

    renderDashboardInsights();

    renderRecommendations();

    updateChart();

}


/* =========================================================
   EQUIPMENT TABLE
========================================================= */

function renderEquipmentTable() {

    const tbody =
        document.getElementById("equipmentTable");


    if (!energyData.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="table-empty">
                    No energy data available.
                </td>
            </tr>
        `;

        return;
    }


    const total =
        getTotals().monthly;


    tbody.innerHTML = "";


    energyData
        .slice()
        .sort(
            (a, b) =>
                b.monthlyKwh -
                a.monthlyKwh
        )
        .forEach(item => {

            const percentage =
                total > 0
                    ? (item.monthlyKwh / total) * 100
                    : 0;


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>${escapeHTML(item.name)}</td>

                <td>
                    ${formatNumber(item.monthlyKwh)}
                    kWh
                </td>

                <td>
                    ${percentage.toFixed(0)}%
                </td>

                <td>
                    <div class="progress">
                        <span style="width:${Math.min(
                            percentage,
                            100
                        )}%"></span>
                    </div>
                </td>

            `;


            tbody.appendChild(row);

        });

}


/* =========================================================
   DASHBOARD INSIGHTS
========================================================= */

function renderDashboardInsights() {

    const container =
        document.getElementById(
            "dashboardInsights"
        );


    if (!energyData.length) return;


    const total =
        getTotals().monthly;


    const sorted =
        [...energyData]
            .sort(
                (a, b) =>
                    b.monthlyKwh -
                    a.monthlyKwh
            );


    const highest =
        sorted[0];


    const highestPercentage =
        total > 0
            ? (
                highest.monthlyKwh /
                total *
                100
            )
            : 0;


    const savings =
        calculatePotentialSavings();


    container.innerHTML = `

        <div class="insight-card danger">

            <div class="insight-icon">⚠</div>

            <div>

                <strong>
                    High-consumption equipment detected
                </strong>

                <p>
                    ${escapeHTML(highest.name)}
                    represents
                    ${highestPercentage.toFixed(0)}%
                    of monthly energy usage.
                </p>

            </div>

            <span>›</span>

        </div>


        <div class="insight-card normal">

            <div class="insight-icon">💡</div>

            <div>

                <strong>
                    Usage pattern identified
                </strong>

                <p>
                    Daily estimated consumption is
                    ${formatNumber(getTotals().daily)}
                    kWh.
                </p>

            </div>

            <span>›</span>

        </div>


        <div class="insight-card saving">

            <div class="insight-icon">🍃</div>

            <div>

                <strong>
                    Potential to save more
                </strong>

                <p>
                    Estimated optimization opportunity:
                    ₹${formatNumber(savings)} / month.
                </p>

            </div>

            <span>›</span>

        </div>

    `;

}


/* =========================================================
   RECOMMENDATIONS
========================================================= */

function getRecommendations() {

    if (!energyData.length) {
        return [];
    }


    const total =
        getTotals().monthly;


    const sorted =
        [...energyData]
            .sort(
                (a, b) =>
                    b.monthlyKwh -
                    a.monthlyKwh
            );


    const recommendations = [];


    sorted.slice(0, 4).forEach(item => {

        const percentage =
            total > 0
                ? item.monthlyKwh /
                  total *
                  100
                : 0;


        let savingRate = 0.10;

        let action =
            "Optimize operating hours.";


        if (percentage >= 30) {

            savingRate = 0.15;

            action =
                "Reduce operating hours where practical.";

        } else if (percentage >= 20) {

            savingRate = 0.12;

            action =
                "Review usage schedule and efficiency.";

        } else {

            savingRate = 0.08;

            action =
                "Use efficient settings and avoid idle operation.";

        }


        /*
          Healthcare safety:
          Never suggest switching off critical
          medical equipment.
        */

        if (
            selectedSector === "healthcare" &&
            (
                item.name
                    .toLowerCase()
                    .includes("medical") ||
                item.name
                    .toLowerCase()
                    .includes("critical")
            )
        ) {

            action =
                "Maintain required operation; optimize only non-critical usage settings.";

            savingRate = 0.05;

        }


        const saving =
            item.monthlyCost *
            savingRate;


        recommendations.push({

            equipment: item.name,

            action,

            saving

        });

    });


    return recommendations;

}


/* =========================================================
   RENDER RECOMMENDATIONS
========================================================= */

function renderRecommendations() {

    const container =
        document.getElementById(
            "recommendationsList"
        );


    const recommendations =
        getRecommendations();


    if (!recommendations.length) {

        container.innerHTML = `

            <div class="empty-state">

                <span>🍃</span>

                <p>
                    Add energy data to receive
                    recommendations.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML = "";


    recommendations.forEach(rec => {

        const div =
            document.createElement("div");

        div.className =
            "recommendation";


        div.innerHTML = `

            <div class="recommendation-icon">
                ⚡
            </div>

            <div>

                <strong>
                    ${escapeHTML(rec.equipment)}
                </strong>

                <p>
                    ${escapeHTML(rec.action)}
                </p>

            </div>

            <span>
                ₹${formatNumber(rec.saving)}
            </span>

        `;


        container.appendChild(div);

    });

}


/* =========================================================
   CHART
========================================================= */

function getChartData(period) {

    const totals =
        getTotals();


    if (period === "daily") {

        if (!energyData.length) {

            return {
                labels: [
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                    "Sun"
                ],
                values: [0, 0, 0, 0, 0, 0, 0]
            };

        }


        const base =
            totals.daily;


        return {

            labels: [
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun"
            ],

            values: [
                base * 0.88,
                base * 0.96,
                base * 0.82,
                base * 1.05,
                base * 0.94,
                base * 1.12,
                base
            ]

        };

    }


    if (period === "weekly") {

        return {

            labels: [
                "Week 1",
                "Week 2",
                "Week 3",
                "Week 4"
            ],

            values: [
                totals.monthly * 0.21,
                totals.monthly * 0.24,
                totals.monthly * 0.27,
                totals.monthly * 0.28
            ]

        };

    }


    return {

        labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun"
        ],

        values: [
            totals.monthly * 0.72,
            totals.monthly * 0.78,
            totals.monthly * 0.86,
            totals.monthly * 0.91,
            totals.monthly * 0.96,
            totals.monthly
        ]

    };

}


/* =========================================================
   CREATE / UPDATE CHART
========================================================= */

function updateChart() {

    const canvas =
        document.getElementById(
            "energyChart"
        );


    if (!canvas) return;


    const ctx =
        canvas.getContext("2d");


    const chartData =
        getChartData(currentChartPeriod);


    if (chartInstance) {

        chartInstance.destroy();

    }


    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            300
        );


    gradient.addColorStop(
        0,
        "rgba(67,243,154,0.95)"
    );

    gradient.addColorStop(
        1,
        "rgba(15,183,164,0.35)"
    );


    chartInstance =
        new Chart(ctx, {

            type: "bar",

            data: {

                labels: chartData.labels,

                datasets: [

                    {

                        label:
                            "Energy Consumption (kWh)",

                        data:
                            chartData.values,

                        backgroundColor:
                            gradient,

                        borderColor:
                            "#43f39a",

                        borderWidth: 1,

                        borderRadius: 5,

                        maxBarThickness: 42

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                interaction: {
                    intersect: false,
                    mode: "index"
                },

                plugins: {

                    legend: {
                        display: false
                    },

                    tooltip: {

                        backgroundColor:
                            "#062631",

                        borderColor:
                            "rgba(67,243,154,0.35)",

                        borderWidth: 1,

                        titleColor: "#43f39a",

                        bodyColor: "#eafaff",

                        callbacks: {

                            label: function(context) {

                                return (
                                    " " +
                                    Number(
                                        context.raw
                                    ).toFixed(2) +
                                    " kWh"
                                );

                            }

                        }

                    }

                },

                scales: {

                    x: {

                        grid: {
                            display: false
                        },

                        ticks: {
                            color: "#8eafb8"
                        }

                    },

                    y: {

                        beginAtZero: true,

                        grid: {
                            color:
                                "rgba(95,178,190,0.12)"
                        },

                        ticks: {
                            color: "#8eafb8"
                        }

                    }

                }

            }

        });

}


/* =========================================================
   CHART PERIOD
========================================================= */

function changeChartPeriod(period, button) {

    currentChartPeriod = period;


    document
        .querySelectorAll(".chart-tab")
        .forEach(tab =>
            tab.classList.remove("active")
        );


    if (button) {
        button.classList.add("active");
    }


    updateChart();
}


/* =========================================================
   ANALYSIS
========================================================= */

function generateAnalysis() {

    if (!energyData.length) {

        showToast(
            "Please add energy data first."
        );

        showPage("input");

        return;

    }


    renderAnalysis();

    renderFullInsights();

    updateDashboard();

    showToast(
        "Energy analysis generated successfully."
    );

    showPage("analysis");

}


function renderAnalysis() {

    const totals =
        getTotals();


    document.getElementById(
        "analysisDaily"
    ).textContent =
        `${formatNumber(totals.daily)} kWh`;


    document.getElementById(
        "analysisWeekly"
    ).textContent =
        `${formatNumber(totals.weekly)} kWh`;


    document.getElementById(
        "analysisMonthly"
    ).textContent =
        `${formatNumber(totals.monthly)} kWh`;


    document.getElementById(
        "analysisCost"
    ).textContent =
        `₹ ${formatNumber(totals.cost)}`;


    const score =
        calculateEfficiencyScore();


    document.getElementById(
        "efficiencyScore"
    ).textContent =
        score;


    const scoreTitle =
        document.getElementById(
            "scoreTitle"
        );


    const scoreDescription =
        document.getElementById(
            "scoreDescription"
        );


    if (!energyData.length) {

        scoreTitle.textContent =
            "Waiting for energy data";

        scoreDescription.textContent =
            "Add equipment data to generate an efficiency score.";

    } else if (score >= 80) {

        scoreTitle.textContent =
            "Excellent Energy Efficiency";

        scoreDescription.textContent =
            "Your current usage pattern appears relatively efficient.";

    } else if (score >= 60) {

        scoreTitle.textContent =
            "Good, With Optimization Potential";

        scoreDescription.textContent =
            "Some equipment can be optimized to reduce energy waste.";

    } else {

        scoreTitle.textContent =
            "High Optimization Potential";

        scoreDescription.textContent =
            "Several high-consumption areas should be reviewed.";

    }


    renderAnalysisAlerts();

}


/* =========================================================
   EFFICIENCY SCORE
========================================================= */

function calculateEfficiencyScore() {

    if (!energyData.length) {
        return 0;
    }


    const waste =
        calculateWaste();


    return Math.max(
        0,
        Math.round(
            100 - waste * 1.5
        )
    );

}


/* =========================================================
   ANALYSIS ALERTS
========================================================= */

function renderAnalysisAlerts() {

    const container =
        document.getElementById(
            "analysisAlerts"
        );


    if (!energyData.length) {

        container.innerHTML = `
            <div class="empty-state">
                <span>🔍</span>
                <p>No analysis available yet.</p>
            </div>
        `;

        return;

    }


    const total =
        getTotals().monthly;


    const sorted =
        [...energyData]
            .sort(
                (a, b) =>
                    b.monthlyKwh -
                    a.monthlyKwh
            );


    container.innerHTML = "";


    sorted.slice(0, 4).forEach(item => {

        const percentage =
            item.monthlyKwh /
            total *
            100;


        let level =
            percentage >= 30
                ? "danger"
                : percentage >= 20
                    ? "warning"
                    : "";


        let icon =
            percentage >= 30
                ? "⚠"
                : percentage >= 20
                    ? "!"
                    : "✓";


        let message;


        if (percentage >= 30) {

            message =
                `${item.name} is a major contributor to total energy usage. Review its operating schedule and efficiency settings.`;

        } else if (percentage >= 20) {

            message =
                `${item.name} has noticeable energy consumption. Consider optimizing usage hours.`;

        } else {

            message =
                `${item.name} is currently within a lower consumption range.`;

        }


        const alert =
            document.createElement("div");


        alert.className =
            `analysis-alert ${level}`;


        alert.innerHTML = `

            <div class="alert-icon">
                ${icon}
            </div>

            <div>

                <h4>
                    ${escapeHTML(item.name)}
                    — ${percentage.toFixed(0)}% of usage
                </h4>

                <p>
                    ${escapeHTML(message)}
                </p>

            </div>

            <span class="alert-saving">
                ${percentage >= 20 ? "Review" : "Normal"}
            </span>

        `;


        container.appendChild(alert);

    });

}


/* =========================================================
   FULL AI INSIGHTS
========================================================= */

function renderFullInsights() {

    const container =
        document.getElementById(
            "fullInsights"
        );


    if (!energyData.length) {

        container.innerHTML = `
            <div class="empty-state">
                <span>♧</span>
                <h3>No insights yet</h3>
                <p>
                    Add energy data to generate
                    personalized insights.
                </p>
            </div>
        `;

        return;

    }


    const total =
        getTotals().monthly;


    const sorted =
        [...energyData]
            .sort(
                (a, b) =>
                    b.monthlyKwh -
                    a.monthlyKwh
            );


    container.innerHTML = "";


    sorted.slice(0, 6).forEach(item => {

        const percentage =
            item.monthlyKwh /
            total *
            100;


        let cause;

        let action;

        let savingRate;


        if (percentage >= 30) {

            cause =
                "This equipment contributes a significant portion of the estimated monthly energy consumption.";

            action =
                "Review operating hours, temperature/settings, maintenance and equipment efficiency.";

            savingRate = 0.15;

        } else if (percentage >= 20) {

            cause =
                "This equipment has a noticeable contribution to total estimated energy use.";

            action =
                "Check whether operating hours can be reduced or scheduled more efficiently.";

            savingRate = 0.12;

        } else {

            cause =
                "The current estimated contribution is relatively moderate.";

            action =
                "Continue monitoring usage and prefer efficient operating modes.";

            savingRate = 0.08;

        }


        if (
            selectedSector === "healthcare" &&
            item.name
                .toLowerCase()
                .includes("medical")
        ) {

            action =
                "Do not switch off critical medical equipment. Optimize only permitted operating settings and non-critical loads.";

            savingRate = 0.05;

        }


        const saving =
            item.monthlyCost *
            savingRate;


        const card =
            document.createElement("article");


        card.className =
            "ai-insight-card";


        card.innerHTML = `

            <div class="big-icon">
                ${percentage >= 30 ? "⚠" : "🍃"}
            </div>

            <h3>
                ${escapeHTML(item.name)}
                usage insight
            </h3>

            <p class="cause">
                <strong>Possible cause:</strong><br>
                ${escapeHTML(cause)}
            </p>

            <div class="action-box">

                <strong>Recommended action</strong>

                <br><br>

                ${escapeHTML(action)}

            </div>

            <div class="saving-value">
                Estimated opportunity:
                ₹${formatNumber(saving)} / month
            </div>

        `;


        container.appendChild(card);

    });

}


/* =========================================================
   REPORTS
========================================================= */

function renderReports() {

    const totals =
        getTotals();


    document.getElementById(
        "reportRecords"
    ).textContent =
        energyData.length;


    document.getElementById(
        "reportUsage"
    ).textContent =
        `${formatNumber(totals.monthly)} kWh`;


    document.getElementById(
        "reportCost"
    ).textContent =
        `₹ ${formatNumber(totals.cost)}`;


    const source =
        energyData.length
            ? [...new Set(
                energyData.map(
                    item => item.source
                )
            )].join(", ")
            : "No Data";


    document.getElementById(
        "reportDataType"
    ).textContent =
        source;


    const tbody =
        document.getElementById(
            "reportTable"
        );


    if (!energyData.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="table-empty">
                    No records available.
                </td>
            </tr>
        `;

        return;

    }


    tbody.innerHTML = "";


    energyData.forEach(item => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${escapeHTML(item.name)}</td>

            <td>${item.wattage} W</td>

            <td>${item.quantity}</td>

            <td>${item.hours}</td>

            <td>
                ${formatNumber(item.monthlyKwh)}
            </td>

            <td>
                ₹${formatNumber(item.monthlyCost)}
            </td>

            <td>
                ${escapeHTML(item.source)}
            </td>

        `;


        tbody.appendChild(row);

    });

}


/* =========================================================
   DOWNLOAD CSV REPORT
========================================================= */

function downloadCSV() {

    if (!energyData.length) {

        showToast(
            "No data available for report."
        );

        return;

    }


    const headers = [
        "Sector",
        "Sub Sector",
        "Equipment",
        "Wattage",
        "Quantity",
        "Daily Hours",
        "Daily kWh",
        "Monthly kWh",
        "Tariff",
        "Monthly Cost",
        "Source"
    ];


    const rows =
        energyData.map(item => [

            selectedSector,

            selectedSubSector,

            item.name,

            item.wattage,

            item.quantity,

            item.hours,

            item.dailyKwh.toFixed(2),

            item.monthlyKwh.toFixed(2),

            item.tariff,

            item.monthlyCost.toFixed(2),

            item.source

        ]);


    const csv = [

        headers,

        ...rows

    ]

        .map(row =>
            row.map(csvEscape).join(",")
        )

        .join("\n");


    const blob =
        new Blob(
            [csv],
            {
                type: "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "neural-nexus-energy-report.csv";


    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);


    showToast(
        "CSV report downloaded."
    );

}


/* =========================================================
   SETTINGS
========================================================= */

function saveSettings() {

    const tariff =
        Number(
            document.getElementById(
                "defaultTariff"
            ).value
        );


    const carbon =
        Number(
            document.getElementById(
                "carbonFactor"
            ).value
        );


    if (tariff < 0 || carbon < 0) {

        showToast(
            "Settings values cannot be negative."
        );

        return;

    }


    settings.tariff = tariff;

    settings.carbonFactor = carbon;


    document.getElementById(
        "tariff"
    ).value = tariff;


    showToast(
        "Settings saved successfully."
    );

}


/* =========================================================
   UTILITY FUNCTIONS
========================================================= */

function formatNumber(value) {

    return Number(value || 0)
        .toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 1
            }
        );

}


function formatMoney(value) {

    return Number(value || 0)
        .toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 0
            }
        );

}


function csvEscape(value) {

    const text =
        String(value ?? "");


    if (
        text.includes(",") ||
        text.includes('"') ||
        text.includes("\n")
    ) {

        return `"${text.replace(
            /"/g,
            '""'
        )}"`;

    }


    return text;

}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 3000);

}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        renderInputEquipment();

        updateDashboard();

        calculatePreview();

        renderAnalysis();

        renderFullInsights();

        renderReports();

    }
);


/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================================= */

document
    .getElementById("howModal")
    .addEventListener(
        "click",
        function(event) {

            if (
                event.target === this
            ) {

                closeHowItWorks();

            }

        }
    );


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeHowItWorks();

        }

    }
);