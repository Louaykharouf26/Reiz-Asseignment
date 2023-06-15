import React, { useState, useEffect } from 'react';
import Pagination from '@mui/material/Pagination';

interface Country {
  name: string;
  region: string;
  area: number;
}

function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(0);
  const [countriesPerPage] = useState(10);
  const [filterOptions, setFilterOptions] = useState<{ smallerThanLithuania: boolean; inOceania: boolean }>({
    smallerThanLithuania: false,
    inOceania: false,
  });

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [countries, filterOptions]);

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://restcountries.com/v2/all?fields=name,region,area');
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const applyFilters = () => {
    let filtered = countries;
    if (filterOptions.smallerThanLithuania) {
      const lithuaniaArea = countries.find((country) => country.name === 'Lithuania')?.area || 0;
      filtered = filtered.filter((country) => country.area < lithuaniaArea);
    }
    if (filterOptions.inOceania) {
      filtered = filtered.filter((country) => country.region === 'Oceania');
    }
    setFilteredCountries(filtered);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page - 1);
  };

  const indexOfLastCountry = (currentPage + 1) * countriesPerPage;
  const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
  const currentCountries = filteredCountries.slice(indexOfFirstCountry, indexOfLastCountry);

  const pageCount = Math.ceil(filteredCountries.length / countriesPerPage);

  const sortCountries = () => {
    const sortedCountries = [...filteredCountries].sort((a, b) =>
      sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
    setFilteredCountries(sortedCountries);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleFilterToggle = (filter: keyof typeof filterOptions) => {
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      [filter]: !prevOptions[filter],
    }));
  };

  return (
    <>
    
      <p>Candidate Name: louay kharouf</p>
      <p>Here is the list of the countries</p>
      <div>
        <button onClick={sortCountries} className="btn sortCountry btn-primary">
          Sort by Name ({sortOrder === 'asc' ? 'Ascending A->Z' : 'Descending Z->A'})
        </button>
        <button
          onClick={() => handleFilterToggle('smallerThanLithuania')}
          className={`filter-button ${filterOptions.smallerThanLithuania ? 'active' : ''}`}
        >
          Smaller than Lithuania by area
        </button>
        <button
          onClick={() => handleFilterToggle('inOceania')}
          className={`filter-button ${filterOptions.inOceania ? 'active' : ''}`}
        >
          In Oceania region
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Region</th>
            <th>Area</th>
          </tr>
        </thead>
        <tbody>
          {currentCountries.map((country) => (
            <tr key={country.name}>
              <td>{country.name}</td>
              <td>{country.region}</td>
              <td>{country.area}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        count={pageCount}
        page={currentPage + 1}
        onChange={handlePageChange}
        color="primary"
        className="pagination"
      />
    </>
  );
}

export default App;
