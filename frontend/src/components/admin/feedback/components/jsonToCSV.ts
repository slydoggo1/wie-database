import { FeedbackList } from './types.ts';

export function downloadJSONAsCSV(jsonData: FeedbackList[]) {
    const csvData = jsonToCsv(jsonData);

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = `${new Date().toLocaleString()}_User_Feedback_Data`;
    document.body.appendChild(a);
    a.click();
}

export function jsonToCsv(jsonData: FeedbackList[]) {
    let csv = '';
    // Get the headers
    const headers: string[] = ['email', 'name', 'time', 'feedbackType', 'feedback'];
    csv += headers.join(',') + '\n';

    // Add the data
    jsonData.forEach((month) => {
        month.feedback.forEach(({ email, name, time, feedbackType, feedback }) => {
            const dataToAdd = `${email},${name},${time},${feedbackType},${feedback}`;
            csv += dataToAdd + '\n';
        });
    });
    return csv;
}
