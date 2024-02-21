import { Route, Routes } from 'react-router-dom';
import LoginPage from '../components/login/LoginPage.tsx';
import { SignUpContextProvider } from '../context/SignUpContext.tsx';
import SignUpPage from '../components/signup/SignUpPage.tsx';
import AccessDeniedPage from '../components/access-denied/AccessDeniedPage.tsx';
import LogoutPage from '../components/logout/LogoutPage.tsx';
import ForgotPasswordPage from '../components/login/ForgotPasswordPage.tsx';
import ErrorPage from '../components/error/ErrorPage.tsx';
import MainLayout from '../layouts/MainLayout.tsx';
import HomePage from '../components/home/HomePage.tsx';
import SearchPage from '../components/search/SearchPage.tsx';
import ProfilePage from '../components/profile/ProfilePage.tsx';
import UserProfilePage from '../components/profile/UserProfilePage.tsx';
import FeedbackForm from '../components/feedback/FeedbackForm.tsx';
import ProtectedRoute from '../layouts/ProtectedRoute.tsx';
import ContactForm from '../components/contact/ContactForm.tsx';
import AdminLayout from '../layouts/AdminLayout.tsx';
import AnalyticsPage from '../components/admin/AnalyticsPage.tsx';
import ProfileReviewPage from '../components/admin/ProfileReviewPage.tsx';
import ReviewFeedbackPage from '../components/admin/feedback/ReviewFeedbackPage.tsx';
import { useContext } from 'react';
import AuthenticationContext from '../context/AuthenticationContext.tsx';
import { CircularProgress } from '@mui/material';
import AccountManagementPage from '../components/admin/AccountManagement/AccountManagementPage.tsx';
import TermsAndConditionsPage from '../components/terms-and-conditions/TermsAndConditionsPage.tsx';
import FavouritesPage from '../components/favourites/FavouritesPage.tsx';
import ContactUs from '../components/contact-us/ContactUs.tsx';
import EditProfilePage from '../components/edit-profile/EditProfilePage.tsx';
import PageNotFound from '../components/error/404Page.tsx';
import AntiProtectedRoute from '../layouts/AntiProtectedRoute.tsx';

export default function Routing() {
    const { loadingAuth } = useContext(AuthenticationContext);

    return (
        <>
            {loadingAuth ? (
                <div className="min-h-screen w-full flex flex-col items-center justify-center">
                    <CircularProgress sx={{ color: '#4F2D7F' }} />
                    <p className="text-primary-100 text-lg font-medium">Loading...</p>
                </div>
            ) : (
                <Routes>
                    <Route element={<AntiProtectedRoute redirectPath="/" />}>
                        <Route path="/login" element={<LoginPage />} />
                    </Route>
                    <Route
                        path="/sign-up"
                        element={
                            <SignUpContextProvider>
                                <SignUpPage />
                            </SignUpContextProvider>
                        }
                    />

                    <Route path="/access-denied" element={<AccessDeniedPage />} />
                    <Route path="/logout" element={<LogoutPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/error" element={<ErrorPage />} />
                    <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
                    <Route path="*" element={<PageNotFound />} />

                    {/* Main Application Layout */}
                    <Route path="/" element={<MainLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/view-profile/:id" element={<ProfilePage />} />

                        <Route path="/feedback" element={<FeedbackForm />} />
                        <Route path="/contact-us" element={<ContactUs />} />

                        <Route element={<ProtectedRoute requiredClaims={['engineer', 'teacher', 'student']} />}>
                            <Route path="/favourites" element={<FavouritesPage />} />
                            <Route path="/contact" element={<ContactForm />} />
                        </Route>

                        {/* Only Teachers and students can Access */}
                        <Route element={<ProtectedRoute requiredClaims={['teacher', 'student']} />}>
                            <Route path="user-profile" element={<UserProfilePage />} />
                        </Route>

                        {/* Only Engineers can Access */}
                        <Route element={<ProtectedRoute requiredClaims={['engineer']} />}>
                            <Route path="profile" element={<ProfilePage />} />
                            <Route path="edit-profile" element={<EditProfilePage />} />
                        </Route>
                    </Route>

                    {/* Admin Application Layout */}
                    <Route path="/admin" element={<ProtectedRoute requiredClaims={['admin']} />}>
                        <Route element={<AdminLayout />}>
                            <Route path="analytics" element={<AnalyticsPage />} />
                            <Route path="profile-review" element={<ProfileReviewPage />} />
                            <Route path="account-management" element={<AccountManagementPage />} />
                            <Route path="review-feedback" element={<ReviewFeedbackPage />} />
                        </Route>
                    </Route>
                </Routes>
            )}
        </>
    );
}
