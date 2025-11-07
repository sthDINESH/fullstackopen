const Display = ({searchResults, country, onShow}) => {
    if(country){
        return (
            <>
                <h1>{country.name.common}</h1>
                <div>Capital {country.capital}</div>
                <div>Area {country.area}</div>

                <h2>Languages</h2>
                <ul>
                    {Object.values(country.languages || []).map(l => <li key={l}>{l}</li>)}
                </ul>
                <img src={Object.values(country.flags || [])[0]} alt={`Flag for ${country.name.common}`}/>
            </>
        )
    }
    if(searchResults){
        if(searchResults.length <= 10){
            return searchResults.map(c => <div key={c}>{c} <button onClick={()=>onShow(c)}>Show</button></div>)
        } else {
            return <div>Too many matches, specify another filter</div>
        }
    } else {
        return
    }
}

export default Display