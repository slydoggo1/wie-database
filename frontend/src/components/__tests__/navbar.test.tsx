import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthenticationContext from '../../context/AuthenticationContext.tsx';
import NavbarMenu from '../nav/NavbarMenu.tsx';

describe('nav bar renders correctly', () => {
    it('login button appears when user is not logged in', () => {
        const firebaseUser = null;
        const login = vi.fn();
        const logout = vi.fn();
        const claim = null;
        const loadingClaim = true;
        const loadingAuth = true;
        const favouritedEngineers = [];

        const context = { firebaseUser, login, logout, claim, loadingClaim, loadingAuth, favouritedEngineers };

        const { getByText } = render(
            <BrowserRouter>
                <AuthenticationContext.Provider value={context}>
                    <NavbarMenu />
                </AuthenticationContext.Provider>
            </BrowserRouter>,
        );

        expect(getByText('Login')).toBeInTheDocument();
    });
});
