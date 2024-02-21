import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';
import SearchResultCard from './SearchResultCard';
import Pagination from '@mui/material/Pagination';
import { getSearchResults } from '../../api/search';
import { engineerCardDTO } from '../../types/Engineer';
import { searchTerms } from '../../types/Search';

const StyledPagination = styled(Pagination)({
    '& li .Mui-selected': {
        color: 'white',
        backgroundColor: '#7F7194',
    },
});

interface SearchResultsProps {
    setLoadingResults: Dispatch<SetStateAction<boolean>>;
    setPagination: Dispatch<SetStateAction<number>>;
    setSearchResults: Dispatch<SetStateAction<engineerCardDTO[] | undefined | null>>;
    setSearchTerms: Dispatch<SetStateAction<searchTerms | undefined>>;
    loadingResults: boolean;
    searchResults: engineerCardDTO[] | undefined | null;
    pagination: number;
    searchTerms: searchTerms | undefined;
}

function SearchResults({
    setLoadingResults,
    setPagination,
    setSearchResults,
    setSearchTerms,
    loadingResults,
    searchResults,
    pagination,
    searchTerms,
}: SearchResultsProps) {
    const scrollRef = useRef<null | HTMLDivElement>(null);
    // show all engineers on the default search page
    useEffect(() => {
        setLoadingResults(true);
        getSearchResults('', [], [], 0)
            .then((response) => {
                setSearchResults(response.data);
                setPagination(parseInt(response.headers.totalpages));
                setSearchTerms({ generalSearch: '', specialisations: [], interests: [] });
                setLoadingResults(false);
            })
            .catch((err) => console.log(err));
    }, []);

    const handleNewSearchResults = (_event: React.ChangeEvent<unknown>, page: number) => {
        if (searchTerms) {
            getSearchResults(searchTerms.generalSearch, searchTerms.specialisations, searchTerms.interests, page - 1)
                .then((response) => {
                    setSearchResults(response.data);
                })
                .catch((err) => console.log(err));
        }
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }, [searchResults]);

    if (loadingResults) {
        return (
            <div className="flex justify-center bg-[#F1EEF2] mt-[20vh]">
                <div className="flex flex-col items-center gap-y-2">
                    <CircularProgress sx={{ color: '#4F2D7F' }} />
                    <p className="text-primary-100 text-lg font-medium">Loading results...</p>
                </div>
            </div>
        );
    } else if (!loadingResults && searchResults?.length == 0) {
        return (
            <div className="mt-[50px]">
                <div className="flex flex-col items-center">
                    <h1 className="text-primary-100 font-semibold text-[24px]">Sorry! We couldn't find any results</h1>
                    <h1 className="text-primary-100 font-semibold text-[24px]">Please try another search</h1>
                </div>
            </div>
        );
    } else if (!loadingResults && searchResults === null) {
        return (
            <div className="mt-[50px]">
                <div className="flex flex-col items-center">
                    <h1 className="text-primary-100 font-semibold text-[24px]">Oops! something went wrong</h1>
                    <h1 className="text-primary-100 font-semibold text-[24px]">Please try another search</h1>
                </div>
            </div>
        );
    }
    return (
        <div ref={scrollRef} className="flex flex-col">
            <div className="grid grid-cols-4 auto-rows-min max-md:grid-cols-1 gap-5 w-full mt-5 max-search:grid-cols-3">
                {searchResults?.map((value, index) => <SearchResultCard result={value} key={index} />)}
            </div>
            {searchResults && searchResults?.length > 0 && pagination > 1 && (
                <StyledPagination
                    count={pagination}
                    sx={{ alignSelf: 'center', marginTop: 'calc(100vh*0.1)' }}
                    onChange={handleNewSearchResults}
                />
            )}
        </div>
    );
}

export default SearchResults;
