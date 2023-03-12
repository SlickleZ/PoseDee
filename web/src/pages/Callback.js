import React, { useEffect } from 'react'
import {
    useLocation
  } from "react-router-dom";
import useCookie from 'react-use-cookie';

function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

function Callback() {
    let query = useQuery();
    const [userinfo, setUserInfo] = useCookie('userinfo', '');
    useEffect(()=>{
        setUserInfo(JSON.stringify({
            name: query.get("name"),
            email: query.get("email"),
            picture: query.get("picture")
        }))
        window.location.href="/app"
    },[])
  return (
    <div>
        {/* <p>{query.get("name")}</p>
        <p>{query.get("email")}</p>
        <img src={query.get("picture")}/> */}
    </div>
  )
}

export default Callback
