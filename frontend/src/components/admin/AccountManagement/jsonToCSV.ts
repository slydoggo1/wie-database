import { GetAllUsersDTO } from '../../../types/User.ts';
import { GetAllEngineersDTO } from '../../../types/Engineer.ts';

export function downloadJSONAsCSV(jsonData: GetAllUsersDTO[] | GetAllEngineersDTO[], currentTab: string) {
    const csvData = jsonToCsv(jsonData, currentTab);

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = `${new Date().toLocaleString()}_${currentTab}_Data`;
    document.body.appendChild(a);
    a.click();
}

export function jsonToCsv(jsonData: GetAllUsersDTO[] | GetAllEngineersDTO[], currentTab: string) {
    let csv = '';
    // Get the headers
    if (currentTab === 'User') {
        const headers: string[] = ['Name', 'Email', 'Role'];
        csv += headers.join(',') + '\n';

        // Add the data
        jsonData.forEach((user) => {
            const { firstName, lastName, email, role } = user;
            const dataToAdd = `${firstName} ${lastName},${email},${role}`;
            csv += dataToAdd + '\n';
        });
    } else {
        const headers: string[] = ['Name', 'Email'];
        csv += headers.join(',') + '\n';

        // Add the data
        jsonData.forEach(({ firstName, lastName, email }) => {
            const dataToAdd = `${firstName} ${lastName},${email}`;
            csv += dataToAdd + '\n';
        });
    }

    return csv;
}
