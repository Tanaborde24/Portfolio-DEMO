import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBbejxg9D7SJtynVJY-V39upIOSAYTjW8Q",
    authDomain: "portfolio-tanaborde.firebaseapp.com",
    projectId: "portfolio-tanaborde",
    storageBucket: "portfolio-tanaborde.firebasestorage.app",
    messagingSenderId: "541175984616",
    appId: "1:541175984616:web:b954029a37761eae54f45d",
    measurementId: "G-V78ZSK5RY2"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ตรวจสอบว่าได้ตั้งค่าแล้วหรือยัง
const isFirebaseConfigured = firebaseConfig.apiKey !== "AIzaSyBbejxg9D7SJtynVJY-V39upIOSAYTjW8Q";

if (isFirebaseConfigured) {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    console.log("✅ Firebase initialized successfully!");
} else {
    console.warn(
        "⚠️ Firebase ยังไม่ได้ตั้งค่า!\n" +
        "กรุณาแก้ไขไฟล์ firebase-config.js โดยใส่ค่า Config จาก Firebase Console\n" +
        "ดูวิธีตั้งค่าได้ที่ด้านบนของไฟล์นี้"
    );
}
