import HomePageImage from './../../../assets/wen-image.jpg';

export default function VisionStatementBanner() {
    return (
        <div className="flex flex-col md:flex-row rounded-md p-[10px] mt-[20px] bg-white drop-shadow-md ">
            <img
                src={HomePageImage}
                alt="Students trying out science experiment"
                className="w-full h-full md:w-1/5 rounded-md bg-gray-200 mr-[20px] object-cover"
            />
            <div className="w-full mt-4 md:mt-0 align-middle flex-col items-center justify-center">
                <div className="font-bold text-2xl text-primary-100 ">Our Vision</div>
                <div className="pr-[20px] text-sm">
                    Our mission is to increase the visibility of Aotearoa’s amazing women engineers, and connect with
                    our educators to access resources and speakers so that more young people can find their role models
                    and be inspired to find out more about a wide range of engineering careers. This database also gives
                    our women engineers a way to connect with each other while supporting the next generation of
                    engineers in New Zealand. Create. Connect. Inspire.
                </div>
            </div>
        </div>
    );
}
