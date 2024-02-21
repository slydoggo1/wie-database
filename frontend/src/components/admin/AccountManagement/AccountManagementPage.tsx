import { useContext, useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, CircularProgress, Modal, TextField, styled } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PageContainer from '../components/PageContainer.tsx';
import PageHeader from '../components/PageHeader.tsx';
import { adminGetAllEngineers, adminGetAllUsers, createNewAdmin } from '../../../api/admin.ts';
import AuthenticationContext from '../../../context/AuthenticationContext.tsx';
import { getUserIdToken } from '../../../api/firebase.ts';
import Tabs from '../components/Tabs.tsx';
import { GetAllUsersDTO } from '../../../types/User.ts';
import { GetAllEngineersDTO } from '../../../types/Engineer.ts';
import Table from '../components/Table.tsx';
import UserTableRow from '../components/UserTableRow.tsx';
import EngineerTableRow from '../components/EngineerTableRow.tsx';
import { deleteEngineer, deleteUser } from '../../../api/admin.ts';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { downloadJSONAsCSV } from './jsonToCSV.ts';

interface HelperText {
    firstName: string;
    lastName: string;
    email: string;
}

const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
            borderColor: '#4F2D7F',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#4F2D7F',
        },
    },
});

function AccountManagementPage() {
    const [open, setOpen] = useState<boolean>(false);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [helperText, setHelperText] = useState<HelperText>({
        firstName: '',
        lastName: '',
        email: '',
    });
    const { firebaseUser } = useContext(AuthenticationContext);

    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState({
        id: '',
        name: '',
    });

    const tabs = ['User', 'Engineer'];
    const userColumns = ['Account Name', 'Role', 'Email'];
    const engineerColumns = ['Account Name', 'Email'];

    const [activeTab, setActiveTab] = useState<string>('User');
    const activeTabRef = useRef(activeTab);
    activeTabRef.current = activeTab;

    const [users, setUsers] = useState<GetAllUsersDTO[]>([]);
    const [engineers, setEngineers] = useState<GetAllEngineersDTO[]>([]);

    const engineersRef = useRef<GetAllEngineersDTO[]>([]);
    const usersRef = useRef<GetAllUsersDTO[]>([]);
    engineersRef.current = engineers;
    usersRef.current = users;

    const [accountCount, setAccountCount] = useState<number>(Infinity);
    const accountCountRef = useRef<number>(accountCount);
    accountCountRef.current = accountCount;

    const [isExportLoading, setIsExportLoading] = useState<boolean>(false);

    const handleOpenModal = () => {
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
    };

    const handleOpenDeleteModal = () => {
        setDeleteOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setDeleteOpen(false);
        setDeleteId({
            id: '',
            name: '',
        });
    };

    const handleSetFirstName = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFirstName(event.target.value);
    };

    const handleSetLastName = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setLastName(event.target.value);
    };

    const handleSetEmail = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEmail(event.target.value);
    };

    const validateForm = () => {
        let isValid: boolean = true;
        const newHelperText: HelperText = {
            firstName: '',
            lastName: '',
            email: '',
        };

        if (firstName == '') {
            isValid = false;
            newHelperText.firstName = 'Please enter a first name';
        }

        if (lastName == '') {
            isValid = false;
            newHelperText.lastName = 'Please enter a last name';
        }

        if (email == '') {
            isValid = false;
            newHelperText.email = 'Please enter an email';
        } else if (!email.includes('@')) {
            isValid = false;
            newHelperText.email = 'Please enter a valid email';
        }

        setHelperText(newHelperText);
        return isValid;
    };

    const handleSubmit = async () => {
        const isValid = validateForm();

        if (isValid && firebaseUser) {
            setIsSubmitting(true);
            const token = await getUserIdToken(firebaseUser);
            createNewAdmin(firstName, lastName, email, token)
                .then((response) => {
                    if (response.status == 201) {
                        setIsSubmitting(false);
                        handleCloseModal();
                        setFirstName('');
                        setLastName('');
                        setEmail('');
                        toast.success('New admin successfully submitted');
                    }
                })
                .catch(() => {
                    toast.error('Unable to add new admin. Please try again');
                    setIsSubmitting(false);
                });
        }
    };

    const handleClickExportFeedback = () => {
        setIsExportLoading(true);

        const data = activeTab === tabs[0] ? users : engineers;

        if (data.length === 0) {
            toast.error('No account data to export');
        } else {
            downloadJSONAsCSV(data, activeTab);
            toast.success('Export completed!');
        }

        setIsExportLoading(false);
    };

    useEffect(() => {
        if (firebaseUser) {
            getUserIdToken(firebaseUser).then((token) => {
                if (activeTab == 'User') {
                    adminGetAllUsers(token, undefined, 20).then((response) => {
                        if (response) {
                            setUsers(response.data);
                            setAccountCount(response.headers['count']);
                        }
                    });
                } else if (activeTab == 'Engineer') {
                    adminGetAllEngineers(token, undefined, 10).then((response) => {
                        if (response) {
                            setEngineers(response.data);
                            setAccountCount(response.headers['count']);
                        }
                    });
                }
            });
        }
    }, [activeTab]);

    const handleDelete = (uid: string, name: string) => {
        setDeleteId({
            id: uid,
            name: name,
        });
        handleOpenDeleteModal();
    };

    const handleDeleteConfirm = async () => {
        setIsSubmitting(true);
        getUserIdToken(firebaseUser!).then((token) => {
            if (activeTab == 'User') {
                deleteUser(deleteId.id, token)
                    .then((response) => {
                        if (response) {
                            toast.success('User successfully deleted');
                            adminGetAllUsers(token, undefined, 10).then((response) => {
                                if (response) {
                                    setUsers(response.data);
                                    setAccountCount(response.headers['count']);
                                }
                            });

                            handleCloseDeleteModal();
                        } else {
                            toast.error('Unable to delete user. Please try again');
                            handleCloseDeleteModal();
                        }
                        setIsSubmitting(false);
                    })
                    .catch(() => {
                        toast.error('Unable to delete user. Please try again');
                        handleCloseDeleteModal();
                        setIsSubmitting(false);
                    });
            } else if (activeTab == 'Engineer') {
                deleteEngineer(deleteId.id, token)
                    .then((response) => {
                        if (response.status == 200) {
                            toast.success('Engineer successfully deleted');
                            adminGetAllEngineers(token, undefined, 10).then((response) => {
                                if (response) {
                                    setEngineers(response.data);
                                    setAccountCount(response.headers['count']);
                                }
                            });
                            handleCloseDeleteModal();
                        } else {
                            toast.error('Unable to delete engineer. Please try again');
                            handleCloseDeleteModal();
                        }

                        setIsSubmitting(false);
                    })
                    .catch(() => {
                        toast.error('Unable to delete user. Please try again');
                        handleCloseDeleteModal();
                        setIsSubmitting(false);
                    });
            }
        });
    };

    useEffect(() => {
        // Add scroll event listener to table fetch more data when scrolled to bottom

        const table = document.getElementById('users-table')!;

        const handleScroll = () => {
            if (table.scrollHeight - table.scrollTop - table.clientHeight < 1) {
                if (firebaseUser) {
                    if (activeTabRef.current == 'User' && usersRef.current.length >= accountCountRef.current) {
                        return;
                    }

                    if (activeTabRef.current == 'Engineer' && engineersRef.current.length >= accountCountRef.current) {
                        return;
                    }

                    getUserIdToken(firebaseUser).then((token) => {
                        if (activeTab == 'User') {
                            adminGetAllUsers(token, usersRef.current[usersRef.current.length - 1].uid, 10).then(
                                (response) => {
                                    if (response) {
                                        setUsers([...usersRef.current, ...response.data]);
                                    }
                                },
                            );
                        } else if (activeTab == 'Engineer') {
                            adminGetAllEngineers(
                                token,
                                engineersRef.current[engineersRef.current.length - 1].uid,
                                10,
                            ).then((response) => {
                                if (response) {
                                    setEngineers([...engineersRef.current, ...response.data]);
                                }
                            });
                        }
                    });
                }
            }
        };

        table?.addEventListener('scroll', handleScroll);

        return () => table.removeEventListener('scroll', handleScroll);
    }, [activeTab]);

    return (
        <PageContainer>
            <PageHeader title="Account Management" />
            <div className="flex flex-col bg-white rounded-lg p-4 grow overflow-hidden">
                <div className="flex justify-between grow-0">
                    <h1 className="text-primary-100 font-semibold text-xl">User Accounts</h1>
                    <button
                        className="font-semibold text-[#4F2D7F] hover:text-[#3C2065] transition ease-in-out delay-50"
                        onClick={() => handleOpenModal()}
                    >
                        + Add an admin
                    </button>
                </div>
                <hr className="h-[2px] mt-7 mb-4 border-0 bg-[#E4E5E7] rounded-full grow-0" />

                <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

                <div className="grow overflow-auto mt-2" id="users-table">
                    <Table
                        titles={activeTab == 'User' ? userColumns : engineerColumns}
                        className="mt-3 text-primary-100"
                    >
                        {activeTab == 'User'
                            ? users.map(({ firstName, lastName, email, role, uid }) => {
                                  const name = firstName + ' ' + lastName;
                                  return (
                                      <UserTableRow
                                          key={uid}
                                          id={uid}
                                          name={name}
                                          role={role}
                                          email={email}
                                          onDelete={() => {
                                              handleDelete(uid, firstName + ' ' + lastName);
                                          }}
                                      />
                                  );
                              })
                            : engineers.map(
                                  ({ firstName, lastName, profilePictureURL, email, professionalTitle, uid }) => {
                                      return (
                                          <EngineerTableRow
                                              key={uid}
                                              email={email}
                                              name={firstName + ' ' + lastName}
                                              professionalTitle={professionalTitle}
                                              profilePictureURL={profilePictureURL}
                                              onDelete={() => {
                                                  handleDelete(uid, firstName + ' ' + lastName);
                                              }}
                                          />
                                      );
                                  },
                              )}
                    </Table>
                    {(activeTab == 'User' && users.length < accountCount && (
                        <p className="text-center text-primary-100 font-semibold mt-2">Loading...</p>
                    )) ||
                        (activeTab == 'Engineer' && engineers.length < accountCount && (
                            <p className="text-center text-primary-100 font-semibold mt-2">Loading...</p>
                        ))}
                </div>
            </div>
            <Modal open={open} onClose={() => handleCloseModal()}>
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-[40%] max-w-[45%] bg-white shadow-lg rounded-xl p-6 flex flex-col">
                    <CloseRoundedIcon
                        sx={{ fontSize: '25px' }}
                        className="self-end text-[#4F2D7F] hover:text-[#3C2065] hover:cursor-pointer"
                        onClick={() => handleCloseModal()}
                    />
                    <h1 className="text-[#4F2D7F] font-semibold text-2xl">Add a new admin</h1>
                    <p className="text-[#808080] text-sm mb-4">
                        Setup a new admin account by entering the name and email below
                    </p>
                    <div className="flex flex-row gap-x-1 mb-1">
                        <h3>First name</h3>
                        <h3 className="text-[#BF3E36]">*</h3>
                    </div>
                    <StyledTextField
                        error={helperText.firstName != ''}
                        onChange={(event) => handleSetFirstName(event)}
                        helperText={helperText.firstName}
                    />
                    <div className="flex flex-row gap-x-1 mb-1 mt-2">
                        <h3>Last name</h3>
                        <h3 className="text-[#BF3E36]">*</h3>
                    </div>
                    <StyledTextField
                        error={helperText.lastName != ''}
                        onChange={(event) => handleSetLastName(event)}
                        helperText={helperText.lastName}
                    />
                    <div className="flex flex-row gap-x-1 mb-1 mt-2">
                        <h3>Email address</h3>
                        <h3 className="text-[#BF3E36]">*</h3>
                    </div>
                    <StyledTextField
                        error={helperText.email != ''}
                        onChange={(event) => handleSetEmail(event)}
                        helperText={helperText.email}
                    />
                    <button
                        className="self-end rounded-md bg-[#4F2D7F]
                            text-white font-medium
                            px-3 py-1
                            border-2
                            mt-8
                            border-[#4F2D7F]
                            hover:bg-[#3C2065]
                            hover:border-[#3C2065]
                            transition ease-in-out delay-50"
                        onClick={() => handleSubmit()}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </Box>
            </Modal>

            <Modal open={deleteOpen} onClose={() => handleCloseDeleteModal()}>
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-[40%] max-w-[45%] bg-white shadow-lg rounded-xl p-6 flex flex-col">
                    <CloseRoundedIcon
                        sx={{ fontSize: '25px' }}
                        className="self-end text-[#4F2D7F] hover:text-[#3C2065] hover:cursor-pointer"
                        onClick={() => handleCloseDeleteModal()}
                    />
                    <h1 className="text-[#4F2D7F] font-semibold text-2xl">
                        Are you sure you want to delete this account?
                    </h1>
                    <p className="text-[#808080] text-md mb-4 mt-3">This cannot be undone.</p>

                    <p className="font-semibold text-primary-100">Account to Delete:</p>
                    <p className="text-5xl font-bold">{deleteId.name}</p>
                    <button
                        className="self-end rounded-md bg-[#4F2D7F]
                            text-white font-medium
                            px-3 py-1
                            border-2
                            mt-8
                            border-[#4F2D7F]
                            hover:bg-[#3C2065]
                            hover:border-[#3C2065]
                            transition ease-in-out delay-50"
                        onClick={() => handleDeleteConfirm()}
                    >
                        {isSubmitting ? 'Deleting User...' : 'Delete User'}
                    </button>
                </Box>
            </Modal>
            <div className="flex flex-col justify-between flex-grow mb-[20px]">
                <div className="flex flex-row justify-normal mt-[20px]">
                    <button
                        onClick={handleClickExportFeedback}
                        className="text-center items-center w-[220px] h-[50px]
                                  border-solid border-[#4F2D7F] rounded-md py-[10px] px-[30px] border-2
                                  font-medium hover:text-white hover:bg-[#3C2065] hover:border-[#3C2065]
                                  bg-[#4F2D7F] text-white hover:cursor-pointer
                                  transition ease-in-out delay-50"
                    >
                        {isExportLoading ? (
                            <CircularProgress size="24px" style={{ color: 'white' }} />
                        ) : (
                            <div className="flex justify-between">
                                <DownloadRoundedIcon />
                                Export {activeTab}s
                            </div>
                        )}
                    </button>
                </div>
            </div>
            <ToastContainer />
        </PageContainer>
    );
}

export default AccountManagementPage;
