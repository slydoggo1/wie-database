export default interface ContactDetail {
    email: string;
    yourEmail: string | null;
    name: string | null;
    title: string;
    emailMessage: string;
    token: string | null | undefined;
}
