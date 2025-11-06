const Display = ({list, detail}) => {
    if(detail){
        return (
            <>
                <h1>{detail.name}</h1>
                <div>Capital {detail.capital}</div>
                <div>Area {detail.area}</div>

                <h2>Languages</h2>
                <ul>
                    {detail.languages.map(l => <li>{l}</li>)}
                </ul>
                <img src={detail.flag[0]} alt={`Flag for ${detail.name}`}/>
            </>
        )
    }
    if(list){
        if(list.length <= 10){
            return list.map(c => <div key={c}>{c}</div>)
        } else {
            return <div>Too many matches, specify another filter</div>
        }
    } else {
        return
    }
}

export default Display