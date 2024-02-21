import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { InputAdornment, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, FormControl } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { getSpecialisations, getSearchResults } from '../../api/search';
import { TopicsDTO, searchTerms } from '../../types/Search';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { engineerCardDTO } from '../../types/Engineer';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
            borderColor: '#4F2D7F',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#4F2D7F',
        },
        height: '49px',
    },
});

const interestOptions: string[] = ['Collaboration', 'Conference', 'Committees', 'Mentoring', 'Outreach'];

interface SearchProps {
    setLoadingResults?: Dispatch<SetStateAction<boolean>>;
    setSearchResults?: Dispatch<SetStateAction<engineerCardDTO[] | undefined | null>>;
    setPagination?: Dispatch<SetStateAction<number>>;
    setSearchTerms?: Dispatch<SetStateAction<searchTerms | undefined>>;
    isHome: boolean;
    searchTerms?: searchTerms | undefined;
}

function Search({
    setLoadingResults,
    setSearchResults,
    setPagination,
    setSearchTerms,
    isHome,
    searchTerms,
}: SearchProps) {
    const [generalSearch, setGeneralSearch] = useState<string>('');
    const [specialisations, setSpecialisations] = useState<string[]>([]);
    const [specialisationOptions, setSpecialisationOptions] = useState<string[]>([]);
    const [interests, setInterests] = useState<string[]>([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSetGeneralSearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setGeneralSearch(event.target.value);
    };

    const handleSetSpecialisation = (event: SelectChangeEvent<string[]>) => {
        setSpecialisations(event.target.value as string[]);
    };

    const handleSetInterest = (event: SelectChangeEvent<string[]>) => {
        setInterests(event.target.value as string[]);
    };

    useEffect(() => {
        getSpecialisations().then((response) => {
            const topics: TopicsDTO[] = response.data;
            const topicNames = topics.map((item) => item.topicDisplayName);
            setSpecialisationOptions(topicNames);
        });
    }, []);

    useEffect(() => {
        if (searchTerms) {
            setGeneralSearch(searchTerms.generalSearch);
            if (searchTerms.specialisations.length !== 0) {
                setSpecialisations(searchTerms.specialisations);
            }
            if (searchTerms.interests.length !== 0) {
                setInterests(searchTerms.interests);
            }
        }
    }, [searchTerms]);

    const handleSearch = () => {
        setIsLoading(true);
        if (setLoadingResults && setSearchTerms) {
            setLoadingResults(true);
            setSearchTerms({
                generalSearch: generalSearch,
                specialisations: specialisations,
                interests: interests,
            });
        }
        getSearchResults(generalSearch, specialisations, interests, 0)
            .then((response) => {
                if (isHome) {
                    setTimeout(() => {
                        setIsLoading(false);
                        navigate('/search', {
                            state: {
                                data: response.data,
                                pagination: parseInt(response.headers.totalpages),
                                searchTerms: {
                                    generalSearch: generalSearch,
                                    specialisations: specialisations,
                                    interests: interests,
                                },
                            },
                        });
                    }, 1000);
                }
                if (setSearchResults && setPagination && setLoadingResults) {
                    setSearchResults(response.data);
                    setPagination(parseInt(response.headers.totalpages));
                    setLoadingResults(false);
                }
            })
            .catch((err) => {
                setIsLoading(false);
                if (isHome && err.response.status == 500) {
                    navigate('/search', {
                        state: {
                            data: null,
                            pagination: 0,
                            searchTerms: {
                                generalSearch: generalSearch,
                                specialisations: specialisations,
                                interests: interests,
                            },
                        },
                    });
                }

                if (err.response.status == 500 && setSearchResults && setLoadingResults) {
                    setSearchResults(null);
                    setLoadingResults(false);
                }
            });
    };

    return (
        <div className="flex flex-col p-4 bg-white rounded-lg w-full self-center">
            <h1 className="text-primary-100 font-semibold text-2xl">Find an Expert</h1>
            <div className="mb-1 mt-3">
                <h3>General search</h3>
            </div>
            <StyledTextField
                fullWidth
                placeholder="Engineers, location..."
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchRoundedIcon className="text-primary-100" />
                        </InputAdornment>
                    ),
                }}
                onChange={(event) => handleSetGeneralSearch(event)}
                onKeyDown={(ev) => {
                    if (ev.key === 'Enter') {
                        ev.preventDefault();
                        handleSearch();
                    }
                }}
                value={generalSearch}
                size="small"
            />
            {/* <div className="flex flex-row mt-4 justify-between gap-x-4 max-md:flex-col"> */}
            <div className="grid grid-cols-search gap-4 mt-4 max-md:grid-cols-none">
                <div className="flex-grow">
                    <div className="mb-1">
                        <h3>Specialisation</h3>
                    </div>
                    <FormControl fullWidth>
                        {specialisations.length === 0 ? (
                            <InputLabel
                                disableAnimation
                                shrink={false}
                                focused={false}
                                sx={{ color: '#ACACAC', marginTop: '-2px' }}
                            >
                                Specialisation
                            </InputLabel>
                        ) : null}
                        <Select
                            fullWidth
                            size="small"
                            value={specialisations}
                            multiple
                            onChange={(event) => handleSetSpecialisation(event)}
                            sx={{
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#4F2D7F',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#4F2D7F',
                                },
                                '.MuiSvgIcon-root ': {
                                    fill: '#4F2D7F',
                                },
                                minHeight: '49px',
                            }}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value, index) => (
                                        <Chip
                                            key={index}
                                            label={value}
                                            variant="outlined"
                                            sx={{
                                                backgroundColor: '#00000',
                                                color: '#4F2D7F',
                                                marginRight: '5px',
                                            }}
                                            onMouseDown={(event) => {
                                                event.stopPropagation();
                                            }}
                                            onDelete={() => {
                                                const newSpecialisations = specialisations.filter(
                                                    (item) => item !== value,
                                                );
                                                setSpecialisations(newSpecialisations);
                                            }}
                                        />
                                    ))}
                                </Box>
                            )}
                        >
                            {specialisationOptions.map((value) => (
                                <MenuItem value={value} key={value}>
                                    {value}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="flex-grow">
                    <div className="mb-1">
                        <h3>Who is interested in</h3>
                    </div>
                    <FormControl fullWidth>
                        {interests.length === 0 ? (
                            <InputLabel
                                disableAnimation
                                shrink={false}
                                focused={false}
                                sx={{ color: '#ACACAC', marginTop: '-2px' }}
                            >
                                Interest
                            </InputLabel>
                        ) : null}
                        <Select
                            fullWidth
                            size="small"
                            multiple
                            value={interests}
                            onChange={(event) => handleSetInterest(event)}
                            sx={{
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#4F2D7F',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#4F2D7F',
                                },
                                '.MuiSvgIcon-root ': {
                                    fill: '#4F2D7F',
                                },
                                minHeight: '49px',
                            }}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value, index) => (
                                        <Chip
                                            key={index}
                                            label={value}
                                            variant="outlined"
                                            sx={{
                                                backgroundColor: '#00000',
                                                color: '#4F2D7F',
                                                marginRight: '5px',
                                            }}
                                            onMouseDown={(event) => {
                                                event.stopPropagation();
                                            }}
                                            onDelete={() => {
                                                const newInterests = interests.filter((item) => item !== value);
                                                setInterests(newInterests);
                                            }}
                                        />
                                    ))}
                                </Box>
                            )}
                        >
                            {interestOptions.map((value) => (
                                <MenuItem value={value} key={value}>
                                    {value}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </div>
            <button
                className="self-end mt-5 rounded-md bg-primary-100
                                text-white font-medium
                                px-3 py-1
                                border-2
                                border-primary-100
                                hover:bg-[#3C2065]
                                hover:border-[#3C2065]
                                transition ease-in-out delay-50"
                onClick={() => handleSearch()}
            >
                {isHome && isLoading ? (
                    <div className="flex flex-row items-center gap-y-5 gap-x-2">
                        <CircularProgress size={18} color="inherit" />
                        <p className="text-white font-medium">Loading...</p>
                    </div>
                ) : (
                    'Search'
                )}
            </button>
        </div>
    );
}

export default Search;
