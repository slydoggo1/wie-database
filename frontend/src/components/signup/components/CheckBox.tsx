interface CheckBoxProps {
    label?: string;
    className?: string;
    onClick?: () => void;
}

export default function CheckBox({ label, className, onClick }: CheckBoxProps) {
    return (
        <div className={`flex items-center mb-4 ${className}`}>
            <input
                id={label}
                type="checkbox"
                value=""
                className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                onClick={onClick}
            />
            <label
                htmlFor={label}
                className="text-slate-500 ml-6 text-sm font-medium text-gray-900 dark:text-gray-300 font-sans hover:cursor-pointer"
            >
                {label}
            </label>
        </div>
    );
}
