interface TextAreaProps {
    label?: string;
    placeholder?: string;
    className?: string;
}

export default function TextArea({ label, placeholder, className }: TextAreaProps) {
    return (
        <div className={className}>
            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {label}
            </label>
            <textarea
                id="message"
                rows={4}
                className="block p-2.5 w-full text-md border-slate-200 border-2 bg-gray-50 rounded-lg"
                placeholder={placeholder}
            ></textarea>
        </div>
    );
}
