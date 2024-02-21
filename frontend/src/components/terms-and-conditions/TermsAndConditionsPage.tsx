import Title from '../signup/components/Title';
import SubTerm from './components/SubTerm';

export default function TermsAndConditionsPage() {
    return (
        <div className="h-screen w-screen bg-background px-5 md:px-10 md:py-5 overflow-auto">
            <div className="bg-white w-full rounded-md drop-shadow-md px-5 md:px-20 md:py-10">
                <Title className="text-2xl md:text-3xl">Terms and Conditions</Title>
                <p className="mt-3">Please refer to the relevant user roles for the terms that apply</p>

                <Title className=" mt-5">General Terms</Title>

                <SubTerm
                    title={'1.1 User Accounts'}
                    term={
                        'All users must create an account to access and use the specific features of our website. Users are responsible for protecting their account information and are liable for all activities under their account.'
                    }
                />

                <SubTerm
                    title={'1.2 Content'}
                    term={
                        'Users agree that all the information provided during the registration is accurate, complete, and up to date.'
                    }
                />

                <SubTerm
                    title={'1.3 Modifications'}
                    term={
                        'We reserve the right to modify or replace these terms at any time. It is the user’s responsibility to review these terms periodically for changes.'
                    }
                />

                <Title className="mt-5">Engineer</Title>

                <SubTerm
                    title={'2.1 Profile Information'}
                    term={
                        'Engineers agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.'
                    }
                />

                <SubTerm
                    title={'2.2 Availability for Contact'}
                    term={
                        'By registering, engineers agree to be searchable and contactable by other registered users, namely teachers and students, for purposes related to professional networking, mentoring, or educational insight.'
                    }
                />

                <SubTerm
                    title={'2.3 Survey Participation'}
                    term={
                        'Engineers, by providing their email, may be contacted for participation in surveys conducted by WiE. Participation in such surveys is voluntary.'
                    }
                />

                <Title className="mt-5">Teacher</Title>
                <SubTerm
                    title={'3.1 Searching Profiles'}
                    term={
                        'Teachers are permitted to search and view the profiles of engineers for the purpose of gathering information, seeking professional development, and enabling student-mentor matching.'
                    }
                />

                <SubTerm
                    title={'3.2 Privacy and Respect'}
                    term={
                        'Teachers agree to respect the privacy and professional boundaries of engineers listed in the database, ensuring no misuse of the information provided.'
                    }
                />

                <SubTerm
                    title={'3.3 Usage of Information'}
                    term={
                        'Information extracted from engineers’ profiles must be used ethically and for educational and professional development purposes only.'
                    }
                />

                <Title className="mt-5">Student</Title>
                <SubTerm
                    title={'4.1 Educational Use'}
                    term={
                        'Students are allowed to use the platform to search and view engineer profiles for educational and informational purposes, such as seeking career advice or understanding different STEM fields.'
                    }
                />

                <SubTerm
                    title={'4.2 Respectful Interaction'}
                    term={'Students must adhere to respectful interaction norms when communicating with engineers.'}
                />

                <SubTerm
                    title={'4.3 Guardian Approval'}
                    term={
                        'If the student is under the age of 16, they must obtain approval from a parent or guardian to use the platform.'
                    }
                />
                <div className="flex justify-center mt-5">
                    <button
                        className="text-center items-center w-[300px] h-[50px]
                                  border-solid border-primary-100 rounded-md py-[10px] px-[30px] border-2
                                  font-medium hover:text-white hover:bg-[#3C2065] hover:border-[#3C2065]
                                  bg-primary-100 text-white hover:cursor-pointer
                                  transition ease-in-out delay-50"
                    >
                        <a href="/">Back to Home</a>
                    </button>
                </div>
            </div>
        </div>
    );
}
