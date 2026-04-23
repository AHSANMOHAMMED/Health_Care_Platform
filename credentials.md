# MediConnect Lanka - Role-Based Access Credentials

Use the following credentials to access the different portals of the MediConnect platform. These accounts have been pre-configured with the necessary roles and data for testing.

## 👨‍⚕️ Doctor Portal
**URL:** `/login` (Select 'Doctor' context or use specific credentials)
- **Email:** `doctor@mediconnect.lk`
- **Password:** `password123`
- **Role:** `DOCTOR`
- **Features:** Patient search, Appointment management, Smart Clinical Summary, Digital Prescriptions, Communication Center.

## 🏥 Admin Portal
**URL:** `/login`
- **Email:** `admin@mediconnect.lk`
- **Password:** `password123`
- **Role:** `ADMIN`
- **Features:** User management, Service monitoring, System analytics, Hospital coordination.

## 👤 Patient Portal
**URL:** `/login`
- **Email:** `patient@mediconnect.lk`
- **Password:** `password123`
- **Role:** `PATIENT`
- **Features:** Booking appointments, Viewing medical records, Chatting with doctors, Voice note playback.

---

### 🛡️ Social Authentication (Mock)
You can also use the social login buttons on the login page to quickly enter the **Patient Portal**.
- **Google / Apple / Facebook**: Clicking any of these will simulate a successful OAuth flow and grant you access as a `PATIENT`.

> [!IMPORTANT]
> These credentials are for the development/staging environment. For security reasons, do not use these passwords for any production accounts.
