import { useState, useEffect } from 'react'
import Search from './Components/Search'
import Display from './Components/Display'
import countriesService from './Services/Countries'

const App = () => {
  const [search, setSearch] = useState(null)
  const [allCountries, setAllCountries] = useState(null)
  const [searchResults, setSearchResults] = useState(null)
  const [country, setCountry] = useState(null)

  const handleSearch = (event) => setSearch(event.target.value)

  const handleShow = (countryName) => {
    console.log("Show", countryName)
    setCountry(allCountries.find(c => c.name.common === countryName))
  }

  useEffect(()=>{
    if(!allCountries){
      console.log("Fetch countries")
      countriesService.getAll()
        .then(countries => setAllCountries(countries))
    }

    if(search){
      const filtered = allCountries.filter(c => c.name.common.toLowerCase().includes(search.toLowerCase()))
      setSearchResults(filtered.map(c=>c.name.common))
      if(filtered.length==1){
        setCountry(filtered[0])
      } else {
        setCountry(null)
      }
    }
  },[allCountries, search])

  return (
    <div>
      <Search value={search} handleSearch={handleSearch}/>
      <Display searchResults={searchResults} country={country} onShow={handleShow}/>
    </div>
  )
}

export default App
