import { useState, useEffect } from 'react'
import Search from './Components/Search'
import Display from './Components/Display'
import countriesService from './Services/Countries'

function App() {
  const [search, setSearch] = useState(null)
  const [countries, setCountries] = useState(null)
  const [searchResults, setSearchResults] = useState(null)
  const [country, setCountry] = useState(null)

  const handleSearch = (event) => setSearch(event.target.value)

  useEffect(()=>{
    if(!countries){
      console.log("Get countries", search)
      countriesService.getAll()
        .then(countries => setCountries(countries))
    }

    if(search){
      const filtered = countries.filter(c => c.name.common.toLowerCase().includes(search.toLowerCase()))
      setSearchResults(filtered.map(c=>c.name.common))
      setCountry(null)
      if(filtered.length==1){
        setCountry(filtered.map(c => ({
          name: c.name.common,
          capital: c.capital,
          area: c.area, 
          languages: Object.values(c.languages || []),
          flag: Object.values(c.flags || [])
        }))[0])
      }
    }
  },[countries, search])

  return (
    <div>
      <Search value={search} handleSearch={handleSearch}/>
      <Display list={searchResults} detail={country} />
    </div>
  )
}

export default App
