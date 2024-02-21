import { useEffect, useState } from 'react';
import Search from './Search';
import SearchResults from './SearchResults';
import { useLocation } from 'react-router-dom';
import { searchTerms } from '../../types/Search';
import { engineerCardDTO } from '../../types/Engineer';

function SearchPage() {
    const [searchTerms, setSearchTerms] = useState<searchTerms | undefined>(undefined);
    const [searchResults, setSearchResults] = useState<engineerCardDTO[] | undefined | null>(undefined);
    const [loadingResults, setLoadingResults] = useState<boolean>(false);
    const [pagination, setPagination] = useState<number>(0);
    const { state } = useLocation();

    useEffect(() => {
        if (state) {
            const { data, pagination, searchTerms } = state;
            setSearchResults(data);
            setPagination(pagination);
            setSearchTerms(searchTerms);
        }
    }, [state]);

    return (
        <div className="flex flex-col p-3 md:px-10 md:py-[5px] 2xl:px-40 bg-[#F1EEF2] min-h-full items-center">
            <div className="w-full mb-16 max-md:w-full">
                <Search
                    setLoadingResults={setLoadingResults}
                    setSearchResults={setSearchResults}
                    setPagination={setPagination}
                    setSearchTerms={setSearchTerms}
                    searchTerms={searchTerms}
                    isHome={false}
                />
                <SearchResults
                    setLoadingResults={setLoadingResults}
                    setPagination={setPagination}
                    setSearchResults={setSearchResults}
                    setSearchTerms={setSearchTerms}
                    loadingResults={loadingResults}
                    searchResults={searchResults}
                    pagination={pagination}
                    searchTerms={searchTerms}
                />
            </div>
        </div>
    );
}

export default SearchPage;
