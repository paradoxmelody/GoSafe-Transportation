import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";
import { calculateFare, formatZAR, geocodeAddress, haversineKm } from "./pricing.js";

const rideForm = document.getElementById("rideForm");
const pickupInput = document.getElementById("pickup");
const dropoffInput = document.getElementById("dropoff");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const estimateBtn = document.getElementById("estimateBtn");
const requestBtn = document.getElementById("requestBtn");
const pricePanel = document.getElementById("pricePanel");
const priceAmount = document.getElementById("priceAmount");
const priceDetails = document.getElementById("priceDetails");
const rideStatus = document.getElementById("rideStatus");
const userEmailEl = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

let currentUser = null;
let currentQuote = null;

function setDefaultDateTime() {
    const now = new Date();
    dateInput.value = now.toISOString().split("T")[0];
    timeInput.value = now.toTimeString().slice(0, 5);
}

function showStatus(message, type) {
    rideStatus.hidden = false;
    rideStatus.textContent = message;
    rideStatus.className = `ride-status ${type}`;
}

function clearStatus() {
    rideStatus.hidden = true;
    rideStatus.textContent = "";
    rideStatus.className = "ride-status";
}

function setLoading(isLoading) {
    estimateBtn.disabled = isLoading;
    requestBtn.disabled = isLoading;
    estimateBtn.textContent = isLoading ? "Calculating..." : "See price";
}

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "signup/home.html";
        return;
    }

    currentUser = user;
    userEmailEl.textContent = user.email || "Signed in";
});

logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
});

rideForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await handleEstimate();
});

requestBtn.addEventListener("click", async () => {
    await handleRideRequest();
});

async function handleEstimate() {
    clearStatus();
    currentQuote = null;
    requestBtn.hidden = true;

    const pickup = pickupInput.value.trim();
    const dropoff = dropoffInput.value.trim();

    pickupInput.classList.remove("error");
    dropoffInput.classList.remove("error");

    if (!pickup || !dropoff) {
        showStatus("Please enter both pickup and dropoff locations.", "error");
        if (!pickup) pickupInput.classList.add("error");
        if (!dropoff) dropoffInput.classList.add("error");
        return;
    }

    if (pickup.toLowerCase() === dropoff.toLowerCase()) {
        dropoffInput.classList.add("error");
        showStatus("Pickup and dropoff cannot be the same.", "error");
        return;
    }

    setLoading(true);
    showStatus("Looking up locations and calculating your fare...", "loading");

    try {
        const [pickupLoc, dropoffLoc] = await Promise.all([
            geocodeAddress(pickup),
            geocodeAddress(dropoff)
        ]);

        const straightKm = haversineKm(pickupLoc.lat, pickupLoc.lon, dropoffLoc.lat, dropoffLoc.lon);
        const { roadKm, fare } = calculateFare(straightKm);

        currentQuote = {
            pickup,
            dropoff,
            pickupResolved: pickupLoc.displayName,
            dropoffResolved: dropoffLoc.displayName,
            distanceKm: roadKm,
            estimatedPrice: fare,
            date: dateInput.value,
            time: timeInput.value
        };

        priceAmount.textContent = formatZAR(fare);
        priceDetails.textContent = `${roadKm} km estimated · ${pickup} → ${dropoff}`;
        pricePanel.hidden = false;
        requestBtn.hidden = false;
        clearStatus();
    } catch (error) {
        pricePanel.hidden = true;
        showStatus(error.message || "Something went wrong. Please try again.", "error");
    } finally {
        setLoading(false);
    }
}

async function handleRideRequest() {
    if (!currentQuote || !currentUser) {
        showStatus("Get a price estimate first.", "error");
        return;
    }

    setLoading(true);
    showStatus("Sending your ride request...", "loading");

    try {
        await addDoc(collection(db, "rideRequests"), {
            userId: currentUser.uid,
            userEmail: currentUser.email,
            pickup: currentQuote.pickup,
            dropoff: currentQuote.dropoff,
            pickupResolved: currentQuote.pickupResolved,
            dropoffResolved: currentQuote.dropoffResolved,
            distanceKm: currentQuote.distanceKm,
            estimatedPrice: currentQuote.estimatedPrice,
            currency: "ZAR",
            scheduledDate: currentQuote.date,
            scheduledTime: currentQuote.time,
            status: "pending",
            createdAt: serverTimestamp()
        });

        showStatus("Ride requested! A GoSafe driver will be in touch shortly.", "success");
        requestBtn.hidden = true;
    } catch (error) {
        console.error(error);
        showStatus("Could not submit your request. Check your connection and try again.", "error");
    } finally {
        setLoading(false);
    }
}

setDefaultDateTime();
