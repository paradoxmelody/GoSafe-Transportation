import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { auth } from "../js/firebase-config.js";

const submitButton = document.getElementById("submit");
const signupButton = document.getElementById("sign-up");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const main = document.getElementById("main");
const createacct = document.getElementById("create-acct");

const signupEmailIn = document.getElementById("email-signup");
const confirmSignupEmailIn = document.getElementById("confirm-email-signup");
const signupPasswordIn = document.getElementById("password-signup");
const confirmSignUpPasswordIn = document.getElementById("confirm-password-signup");
const createacctbtn = document.getElementById("create-acct-btn");
const returnBtn = document.getElementById("return-btn");

function goToHome() {
    window.location.href = "../home.html";
}

function authErrorMessage(error) {
    switch (error.code) {
        case "auth/invalid-email":
            return "Please enter a valid email address.";
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
            return "Incorrect email or password.";
        case "auth/email-already-in-use":
            return "An account with this email already exists.";
        case "auth/weak-password":
            return "Password should be at least 6 characters.";
        default:
            return "Something went wrong. Please try again.";
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        goToHome();
    }
});

if (new URLSearchParams(window.location.search).get("signup") === "1") {
    main.style.display = "none";
    createacct.style.display = "block";
}

createacctbtn.addEventListener("click", function () {
    const signupEmail = signupEmailIn.value.trim();
    const confirmSignupEmail = confirmSignupEmailIn.value.trim();
    const signupPassword = signupPasswordIn.value;
    const confirmSignUpPassword = confirmSignUpPasswordIn.value;

    if (!signupEmail || !confirmSignupEmail || !signupPassword || !confirmSignUpPassword) {
        window.alert("Please fill out all required fields.");
        return;
    }

    if (signupEmail !== confirmSignupEmail) {
        window.alert("Email fields do not match. Try again.");
        return;
    }

    if (signupPassword !== confirmSignUpPassword) {
        window.alert("Password fields do not match. Try again.");
        return;
    }

    createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
        .then(() => goToHome())
        .catch((error) => window.alert(authErrorMessage(error)));
});

submitButton.addEventListener("click", function () {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        window.alert("Please enter your email and password.");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then(() => goToHome())
        .catch((error) => window.alert(authErrorMessage(error)));
});

passwordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitButton.click();
});

signupButton.addEventListener("click", function () {
    main.style.display = "none";
    createacct.style.display = "block";
});

returnBtn.addEventListener("click", function () {
    main.style.display = "block";
    createacct.style.display = "none";
});
