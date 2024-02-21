import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PlaceIcon from '@mui/icons-material/Place';
import EmailIcon from '@mui/icons-material/Email';

export default function ContactUs() {
    const copyToClipboard = (text) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                toast.success('Copied to clipboard!', { autoClose: 1000 });
            })
            .catch((err) => {
                console.error('Could not copy text: ', err);
                toast.error('Failed to copy!', { autoClose: 1000 });
            });
    };

    return (
        <div className="h-full flex flex-col md:px-10 md:py-[5px] xl:py-4 2xl:px-40  bg-background">
            <ToastContainer />
            <div className="flex flex-col bg-white p-8 rounded-xl relative">
                <h1 className="text-3xl font-bold mb-6 text-primary-100">Contact us</h1>

                <div
                    className="mb-4 flex items-center hover:bg-gray-100 cursor-pointer p-2 rounded"
                    onClick={() => copyToClipboard('5-7 Grafton Road, Auckland, 1010')}
                >
                    <PlaceIcon className="mr-3 text-primary-100" />
                    <span className="text-lg">5-7 Grafton Road, Auckland, 1010</span>
                </div>

                <div
                    className="flex items-center hover:bg-gray-100 cursor-pointer p-2 rounded"
                    onClick={() => copyToClipboard('wie@auckland.ac.nz')}
                >
                    <EmailIcon className="mr-3 text-primary-100" />
                    <span className="text-lg">wie@auckland.ac.nz</span>
                </div>
            </div>
        </div>
    );
}
